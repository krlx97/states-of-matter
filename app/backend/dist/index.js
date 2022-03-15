import { createServer } from 'http';
import process$1 from 'process';
import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig.js';
import { MongoClient } from 'mongodb';
import fetch from 'node-fetch';
import { Server } from 'socket.io';
import { PlayerStatus } from '@som/shared/enums';
import { randomInt } from 'crypto';
import { cards } from '@som/shared/data';

const settings = {
    mongo: {
        uri: "mongodb://localhost:27017"
    },
    eos: {
        endpoint: "https://testnet.telos.net",
        contractAccount: "telosgamesbp",
        contractKey: process.env.EOS_CONTRACT_KEY || "5K2rKojEWKC1UmmiyWKvvXcVeS1Devq2LQEgDyKejyFNJAX2AX2"
    },
    socket: {
        opts: {
            cors: {
                origin: "*"
            }
        }
    },
    server: {
        port: process.env.PORT || 4200
    }
};

const sendChatMsg = (services) => {
    const { mongoService, socketService } = services;
    const { $chats, $players } = mongoService;
    const { io, socket } = socketService;
    socket.on("sendChatMsg", async (params) => {
        const { sender, receiver, text, date } = params;
        const updateChat = await $chats.updateOne({
            players: { $all: [sender, receiver] }
        }, {
            $push: {
                messages: { sender, text, date }
            }
        });
        if (!updateChat.modifiedCount) {
            return;
        }
        socket.emit("sendChatMsgSender", { sender, receiver, text, date });
        const player = await $players.findOne({
            username: receiver
        });
        if (!player || !player.socketId) {
            return;
        }
        io.to(player.socketId).emit("sendChatMsgReceiver", { sender, text, date });
    });
};

const updateFriend = (services) => {
    const { mongoService, socketService } = services;
    const { $players } = mongoService;
    const { io, socket, socketId } = socketService;
    socket.on("updateStatus", async () => {
        const player = await $players.findOne({ socketId });
        if (!player) {
            return;
        }
        const { username, status, social: { friends } } = player;
        const socketIds = await mongoService.getSocketIds(friends);
        io.to(socketIds).emit("updateStatus", { username, status });
    });
};

const disconnect = (services) => {
    const { mongoService, socketService } = services;
    const { $players } = mongoService;
    const { io, socket, socketId } = socketService;
    socket.on("disconnect", async (reason) => {
        const $player = await $players.findOneAndUpdate({ socketId }, {
            $set: {
                socketId: "",
                status: PlayerStatus.OFFLINE
            }
        }, {
            returnDocument: "after"
        });
        if (!$player.value) {
            return;
        }
        const { username, status, social } = $player.value;
        const socketIds = await mongoService.getSocketIds(social.friends);
        io.to(socketIds).emit("updateStatus", { username, status });
    });
};

const getPrivateKeyHash = (services) => {
    const { mongoService, socketService } = services;
    const { $players } = mongoService;
    const { socket } = socketService;
    socket.on("getPrivateKeyHash", async (params) => {
        const { username } = params;
        const $player = await $players.findOne({ username });
        if (!$player) {
            socket.emit("notification", "Player not found.");
            return;
        }
        const { privateKeyHash } = $player;
        socket.emit("getPrivateKeyHash", { privateKeyHash });
    });
};

// this needs refactoring...
const signin = (services) => {
    const { eosService, mongoService, socketService } = services;
    const { $chats, $games, $lobbies, $players } = mongoService;
    const { socket, socketId } = socketService;
    socket.on("signin", async (params) => {
        const { username, publicKey, signature } = params;
        let lobby, game;
        // const transaction = await blockchainService.transact("signin", {publicKey, signature});
        // if (!transaction) { return; }
        const $player = await $players.findOneAndUpdate({ username }, [{
                $set: {
                    socketId,
                    status: {
                        $switch: {
                            branches: [{
                                    case: {
                                        $gt: ["$lobbyId", 0]
                                    },
                                    then: PlayerStatus.INLOBBY
                                }, {
                                    case: {
                                        $gt: ["$gameId", 0]
                                    },
                                    then: PlayerStatus.INGAME
                                }],
                            default: PlayerStatus.ONLINE
                        }
                    }
                }
            }], {
            returnDocument: "after"
        });
        const player$ = await eosService.findPlayer(username);
        if (!$player.value || !player$) {
            return;
        }
        const { wallet, last_nonce } = player$;
        const { friends } = $player.value.social;
        const friendsView = [];
        for (const friendname of friends) {
            const [friend, chat] = await Promise.all([
                $players.findOne({
                    username: friendname
                }),
                $chats.findOne({
                    players: {
                        $all: [username, friendname]
                    }
                })
            ]);
            if (!friend || !chat) {
                return;
            }
            const { status, avatarId } = friend;
            const { messages } = chat;
            friendsView.push({ username: friendname, status, avatarId, messages });
        }
        const { lobbyId, gameId } = $player.value;
        let gameView;
        if (lobbyId) {
            lobby = await $lobbies.findOne({ lobbyId });
            if (!lobby) {
                return;
            }
        }
        else if (gameId) {
            game = await $games.findOne({ gameId });
            if (!game) {
                return;
            }
            if ($player.value.username === game.playerA.username) {
                gameView = {
                    gameId: game.gameId,
                    currentPlayer: game.currentPlayer,
                    player: game.playerA,
                    opponent: {
                        ...game.playerB,
                        deck: game.playerB.deck.length,
                        hand: game.playerB.hand.length
                    }
                };
            }
            else {
                gameView = {
                    gameId: game.gameId,
                    currentPlayer: game.currentPlayer,
                    player: game.playerB,
                    opponent: {
                        ...game.playerA,
                        deck: game.playerA.deck.length,
                        hand: game.playerA.hand.length
                    }
                };
            }
        }
        socket.emit("signin", {
            player: { ...$player.value, wallet, last_nonce },
            friends: friendsView,
            lobby,
            game: gameView
        });
    });
};

const signup = (services) => {
    const { eosService, mongoService, socketService } = services;
    const { $players } = mongoService;
    const { socket } = socketService;
    socket.on("signup", async (params) => {
        const { username, publicKey, privateKeyHash } = params;
        const $player = await $players.findOne({ username });
        if ($player) {
            socket.emit("notification", "Username taken.");
            return;
        }
        const [transaction, insertPlayer] = await Promise.all([
            eosService.transact("signup", {
                username,
                public_key: publicKey
            }),
            $players.insertOne({
                socketId: "",
                username,
                publicKey,
                privateKeyHash,
                status: PlayerStatus.OFFLINE,
                xp: 0,
                lv: 1,
                deckId: 0,
                avatarId: 0,
                lobbyId: 0,
                gameId: 0,
                decks: [
                    { id: 0, klass: 1, name: "Deck 1", cards: [] },
                    { id: 1, klass: 2, name: "Deck 2", cards: [] },
                    { id: 2, klass: 3, name: "Deck 3", cards: [] },
                    { id: 3, klass: 4, name: "Deck 4", cards: [] }
                ],
                social: {
                    friends: [],
                    requests: [],
                    blocked: []
                }
            })
        ]);
        if (!transaction || !insertPlayer.insertedId) {
            socket.emit("notification", "Error creating account.");
            return;
            // if signup fails on-chain, should we check whether it passed off-chain
            // and remove the document from mongodb?
        }
        socket.emit("notification", "Account created successfully.");
    });
};

const destroyLobby = (services) => {
    const { mongoService, socketService } = services;
    const { $lobbies, $players } = mongoService;
    const { io, socket, socketId } = socketService;
    socket.on("destroyLobby", async () => {
        const $player = await $players.findOne({ socketId });
        if (!$player) {
            return;
        }
        const { username, lobbyId } = $player;
        if (!lobbyId) {
            socket.emit("notification", "You are not in a lobby.");
            return;
        }
        const lobby = await $lobbies.findOne({ lobbyId });
        if (!lobby) {
            return;
        }
        if (username !== lobby.host.username) {
            socket.emit("notification", "You are not the lobby host.");
            return;
        }
        const [deleteLobby, updatePlayer] = await Promise.all([
            $lobbies.deleteOne({ lobbyId }),
            $players.updateOne({ socketId }, {
                $set: {
                    lobbyId: 0,
                    status: PlayerStatus.ONLINE
                }
            })
        ]);
        if (!deleteLobby.deletedCount || !updatePlayer.modifiedCount) {
            return;
        }
        if (lobby.challengee.username) {
            const challengee = await $players.findOneAndUpdate({
                username: lobby.challengee.username
            }, {
                $set: {
                    lobbyId: 0,
                    status: PlayerStatus.ONLINE
                }
            }, {
                returnDocument: "after"
            });
            if (!challengee.value) {
                return;
            }
        }
        socket.emit("destroyLobby");
        io.to(lobby.challengee.socketId).emit("destroyLobby");
    });
};

const joinLobby = (services) => {
    const { mongoService, socketService } = services;
    const { $lobbies, $players } = mongoService;
    const { io, socket, socketId } = socketService;
    socket.on("joinLobby", async (params) => {
        const { lobbyId } = params;
        const [$player, $lobby] = await Promise.all([
            $players.findOne({ socketId }),
            $lobbies.findOne({ lobbyId })
        ]);
        if (!$player) {
            socket.emit("notification", "Player not found.");
            return;
        }
        if (!$lobby) {
            socket.emit("notification", "Lobby not found.");
            return;
        }
        if ($player.lobbyId) {
            socket.emit("notification", "You are already in a lobby.");
            return;
        }
        if ($player.gameId) {
            socket.emit("notification", "You can't join a lobby while in game.");
            return;
        }
        if ($lobby.challengee.username) {
            socket.emit("notification", "Lobby is full.");
            return;
        }
        const { username, avatarId } = $player;
        const [modifiedLobby, updatedPlayer] = await Promise.all([
            $lobbies.findOneAndUpdate({ lobbyId }, {
                $set: {
                    challengee: { username, socketId, avatarId }
                }
            }, {
                returnDocument: "after"
            }),
            $players.updateOne({ socketId }, {
                $set: {
                    lobbyId,
                    status: PlayerStatus.INLOBBY
                }
            })
        ]);
        if (!modifiedLobby.value || !updatedPlayer.modifiedCount) {
            socket.emit("notification", "Error joining lobby.");
            return;
        }
        const lobby = modifiedLobby.value;
        const { challengee } = modifiedLobby.value;
        socket.emit("joinLobbySender", { lobby });
        io.to($lobby.host.socketId).emit("joinLobbyReceiver", { challengee });
    });
};

const leaveLobby = (services) => {
    const { mongoService, socketService } = services;
    const { $lobbies, $players } = mongoService;
    const { io, socket, socketId } = socketService;
    socket.on("leaveLobby", async () => {
        const $player = await $players.findOne({ socketId });
        if (!$player) {
            socket.emit("notification", "Player not found.");
            return;
        }
        if (!$player.lobbyId) {
            socket.emit("notification", "You are not in a lobby.");
            return;
        }
        const { lobbyId } = $player;
        const $lobby = await $lobbies.findOne({ lobbyId });
        if (!$lobby) {
            socket.emit("notification", "Lobby not found.");
            return;
        }
        const [$updateLobby, $updatePlayer] = await Promise.all([
            $lobbies.updateOne({ lobbyId }, {
                $set: {
                    challengee: {
                        username: "",
                        socketId: "",
                        avatarId: 0
                    }
                }
            }),
            $players.updateOne({ socketId }, {
                $set: {
                    lobbyId: 0,
                    status: PlayerStatus.ONLINE
                }
            })
        ]);
        if (!$updateLobby.modifiedCount || !$updatePlayer.modifiedCount) {
            return;
        }
        socket.emit("leaveLobbySender");
        io.to($lobby.host.socketId).emit("leaveLobbyReceiver");
    });
};

const makeLobby = (services) => {
    const { mongoService, socketService } = services;
    const { $lobbies, $players } = mongoService;
    const { socket, socketId } = socketService;
    socket.on("makeLobby", async () => {
        const player = await $players.findOne({ socketId });
        if (!player) {
            socket.emit("notification", "Player not found.");
            return;
        }
        if (player.lobbyId) {
            socket.emit("notification", "You are already in a lobby.");
            return;
        }
        if (player.gameId) {
            socket.emit("notification", "You can't make a lobby while in game.");
            return;
        }
        const { username, avatarId } = player;
        const lobbyId = randomInt(1, 1000000);
        const [insertLobby, updatePlayer] = await Promise.all([
            $lobbies.insertOne({
                lobbyId,
                host: { username, socketId, avatarId },
                challengee: {
                    username: "",
                    socketId: "",
                    avatarId: 0
                }
            }),
            $players.updateOne({ socketId }, {
                $set: {
                    lobbyId,
                    status: PlayerStatus.INLOBBY
                }
            })
        ]);
        if (!insertLobby.insertedId || !updatePlayer.modifiedCount) {
            return;
        }
        const lobby = await $lobbies.findOne({ lobbyId });
        if (!lobby) {
            return;
        }
        socket.emit("makeLobby", { lobby });
    });
};

const saveDeck = (services) => {
    const { mongoService, socketService } = services;
    const { $players } = mongoService;
    const { socket, socketId } = socketService;
    socket.on("saveDeck", async (params) => {
        const { cards } = params;
        const player = await $players.findOne({ socketId });
        if (!player) {
            return;
        }
        const { deckId } = player;
        const updatePlayer = await $players.updateOne({
            socketId,
            "decks.id": deckId
        }, {
            $set: {
                "decks.$.cards": cards
            }
        });
        if (!updatePlayer.modifiedCount) {
            return;
        }
        socket.emit("saveDeck", { cards });
    });
};

const selectDeck = (services) => {
    const { mongoService, socketService } = services;
    const { $players } = mongoService;
    const { socket, socketId } = socketService;
    socket.on("selectDeck", async (params) => {
        const { deckId } = params;
        const updatePlayer = await $players.updateOne({ socketId }, {
            $set: { deckId }
        });
        if (!updatePlayer.modifiedCount) {
            return;
        }
        socket.emit("selectDeck", { deckId });
    });
};

const sendToken = (services) => {
    const { eosService, socketService } = services;
    const { socket } = socketService;
    socket.on("sendToken", async (params) => {
        const transaction = await eosService.transact("transfer", params);
        if (!transaction) {
            socket.emit("notification", "Error sending token.");
            return;
        }
    });
};

const setDeckKlass = (services) => {
    const { mongoService, socketService } = services;
    const { $players } = mongoService;
    const { socket, socketId } = socketService;
    socket.on("setDeckKlass", async (params) => {
        const { deckId, klass } = params;
        const updatePlayer = await $players.updateOne({
            socketId,
            "decks.id": deckId
        }, {
            $set: {
                "decks.$.klass": klass
            }
        });
        if (!updatePlayer.modifiedCount) {
            return;
        }
        socket.emit("setDeckKlass", { deckId, klass });
    });
};

const setDeckName = (services) => {
    const { mongoService, socketService } = services;
    const { $players } = mongoService;
    const { socket, socketId } = socketService;
    socket.on("setDeckName", async (params) => {
        const { id, name } = params;
        const $updatePlayer = await $players.updateOne({
            socketId,
            "decks.id": id
        }, {
            $set: {
                "decks.$.name": name
            }
        });
        if (!$updatePlayer.modifiedCount) {
            return;
        }
        socket.emit("setDeckName", { id, name });
    });
};

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = randomInt(0, i + 1);
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
const startGame = (services) => {
    const { mongoService, socketService } = services;
    const { $games, $lobbies, $players } = mongoService;
    const { io, socket } = socketService;
    socket.on("startGame", async (params) => {
        const { lobbyId } = params;
        const $lobby = await $lobbies.findOne({ lobbyId });
        const $deleteLobby = await $lobbies.deleteOne({ lobbyId });
        if (!$lobby || !$deleteLobby.deletedCount) {
            return;
        }
        const [playerA, playerB] = await Promise.all([
            $players.findOneAndUpdate({
                username: $lobby.host.username
            }, {
                $set: {
                    lobbyId: 0,
                    gameId: lobbyId,
                    status: PlayerStatus.INGAME
                }
            }, {
                returnDocument: "after"
            }),
            $players.findOneAndUpdate({
                username: $lobby.challengee.username
            }, {
                $set: {
                    lobbyId: 0,
                    gameId: lobbyId,
                    status: PlayerStatus.INGAME
                }
            }, {
                returnDocument: "after"
            })
        ]);
        if (!playerA.value || !playerB.value)
            return;
        let gid = 1;
        let playerADeck = [];
        const playerAHand = [];
        let playerBDeck = [];
        const playerBHand = [];
        for (let i = 0; i < playerA.value.decks[playerA.value.deckId].cards.length; i += 1) {
            let id = playerA.value.decks[playerA.value.deckId].cards[i].id;
            const card = cards.find((card) => card.id === id);
            if (!card)
                return;
            if (card.health) {
                playerADeck.push({ gid, ...card, maxHealth: card.health });
            }
            else {
                playerADeck.push({ gid, ...card });
            }
            gid += 1;
            if (playerA.value.decks[playerA.value.deckId].cards[i].amount > 1) {
                if (card.health) {
                    playerADeck.push({ gid, ...card, maxHealth: card.health });
                }
                else {
                    playerADeck.push({ gid, ...card });
                }
                gid += 1;
            }
        }
        for (let i = 0; i < playerB.value.decks[playerB.value.deckId].cards.length; i += 1) {
            let id = playerB.value.decks[playerB.value.deckId].cards[i].id;
            const card = cards.find((card) => card.id === id);
            if (!card)
                return;
            if (card.health) {
                playerBDeck.push({ gid, ...card, maxHealth: card.health });
            }
            else {
                playerBDeck.push({ gid, ...card });
            }
            gid += 1;
            if (playerB.value.decks[playerB.value.deckId].cards[i].amount > 1) {
                if (card.health) {
                    playerBDeck.push({ gid, ...card, maxHealth: card.health });
                }
                else {
                    playerBDeck.push({ gid, ...card });
                }
                gid += 1;
            }
        }
        // playerB.decks[playerB.deckId].cards.
        shuffleArray(playerADeck);
        shuffleArray(playerBDeck);
        playerAHand.push(...playerADeck.slice(-5));
        playerBHand.push(...playerBDeck.slice(-5));
        playerADeck = playerADeck.slice(0, -5);
        playerBDeck = playerBDeck.slice(0, -5);
        const game = {
            gameId: $lobby.lobbyId,
            currentPlayer: $lobby.host.username,
            playerA: {
                username: $lobby.host.username,
                hero: {
                    id: 2,
                    health: 600,
                    maxHealth: 600,
                    mana: 100,
                    maxMana: 100,
                    damage: 30,
                    passive: 25
                },
                fields: {
                    magic: undefined,
                    minionA: undefined,
                    minionB: undefined,
                    minionC: undefined,
                    minionD: undefined,
                    trap: undefined,
                },
                deck: playerADeck,
                hand: playerAHand,
                graveyard: []
            },
            playerB: {
                username: $lobby.challengee.username,
                hero: {
                    id: 4,
                    health: 600,
                    maxHealth: 600,
                    mana: 100,
                    maxMana: 100,
                    damage: 20,
                    passive: 25
                },
                fields: {
                    magic: undefined,
                    minionA: undefined,
                    minionB: undefined,
                    minionC: undefined,
                    minionD: undefined,
                    trap: undefined,
                },
                deck: playerBDeck,
                hand: playerBHand,
                graveyard: []
            },
        };
        const isInserted = await $games.insertOne(game);
        if (!isInserted.insertedId) {
            return;
        }
        const gameSender = {
            gameId: $lobby.lobbyId,
            currentPlayer: $lobby.host.username,
            player: {
                username: $lobby.host.username,
                hero: {
                    id: 2,
                    health: 600,
                    maxHealth: 600,
                    mana: 100,
                    maxMana: 100,
                    damage: 30,
                    passive: 25
                },
                fields: {
                    magic: undefined,
                    minionA: undefined,
                    minionB: undefined,
                    minionC: undefined,
                    minionD: undefined,
                    trap: undefined
                },
                deck: playerADeck,
                hand: playerAHand,
                graveyard: []
            },
            opponent: {
                username: $lobby.challengee.username,
                hero: {
                    id: 4,
                    health: 600,
                    maxHealth: 600,
                    mana: 100,
                    maxMana: 100,
                    damage: 20,
                    passive: 25
                },
                fields: {
                    magic: undefined,
                    minionA: undefined,
                    minionB: undefined,
                    minionC: undefined,
                    minionD: undefined,
                    trap: undefined
                },
                deck: playerBDeck.length,
                hand: playerBHand.length,
                graveyard: []
            }
        };
        const gameReceiver = {
            gameId: $lobby.lobbyId,
            currentPlayer: $lobby.host.username,
            player: {
                username: $lobby.challengee.username,
                hero: {
                    id: 4,
                    health: 600,
                    maxHealth: 600,
                    mana: 100,
                    maxMana: 100,
                    damage: 20,
                    passive: 25
                },
                fields: {
                    magic: undefined,
                    minionA: undefined,
                    minionB: undefined,
                    minionC: undefined,
                    minionD: undefined,
                    trap: undefined,
                },
                deck: playerBDeck,
                hand: playerBHand,
                graveyard: []
            },
            opponent: {
                username: $lobby.host.username,
                hero: {
                    id: 2,
                    health: 600,
                    maxHealth: 600,
                    mana: 100,
                    maxMana: 100,
                    damage: 30,
                    passive: 25
                },
                fields: {
                    magic: undefined,
                    minionA: undefined,
                    minionB: undefined,
                    minionC: undefined,
                    minionD: undefined,
                    trap: undefined,
                },
                deck: playerADeck.length,
                hand: playerAHand.length,
                graveyard: []
            }
        };
        socket.emit("startGame", { game: gameSender });
        const { username } = $lobby.challengee;
        const challengee = await $players.findOne({ username });
        if (!challengee || !challengee.socketId) {
            return;
        }
        io.to(challengee.socketId).emit("startGame", { game: gameReceiver });
    });
};

const attackCard = (services) => {
    const { mongoService, socketService } = services;
    const { $games, $players } = mongoService;
    const { io, socket, socketId } = socketService;
    socket.on("attackCard", async (params) => {
        const { attacked, attacker } = params;
        const player = await $players.findOne({ socketId });
        if (!player) {
            return;
        }
        const { gameId } = player;
        const game = await $games.findOne({ gameId });
        if (!game) {
            return;
        }
        let opponentUsername;
        const endGame = async (winner) => {
            const { playerA, playerB } = game;
            const [A, B] = await Promise.all([
                $players.findOneAndUpdate({
                    username: playerA.username
                }, {
                    $set: {
                        gameId: 0,
                        status: PlayerStatus.ONLINE
                    }
                }, {
                    returnDocument: "after"
                }),
                $players.findOneAndUpdate({
                    username: playerB.username
                }, {
                    $set: {
                        gameId: 0,
                        status: PlayerStatus.ONLINE
                    }
                }, {
                    returnDocument: "after"
                })
            ]);
            if (!A.value || !B.value) {
                return;
            }
            const isDeletedGame = await $games.deleteOne({ gameId });
            if (!isDeletedGame.deletedCount) {
                return;
            }
            if (winner === "A") {
                io.to(A.value.socketId).emit("notification", "You won!");
                io.to(B.value.socketId).emit("notification", "You lost...");
            }
            else if (winner === "B") {
                io.to(B.value.socketId).emit("notification", "You won!");
                io.to(A.value.socketId).emit("notification", "You lost...");
            }
            io.to([A.value.socketId, B.value.socketId]).emit("endGame");
        };
        // ;w;
        if (player.username === game.playerA.username) {
            opponentUsername = game.playerB.username;
            const { playerA, playerB } = game;
            if (attacker === "hero") { // attacking with hero
                if (attacked === "hero") { // attacking hero with hero
                    playerA.hero.health -= playerB.hero.damage;
                    playerB.hero.health -= playerA.hero.damage;
                    if (playerB.hero.health <= 0) {
                        await endGame("A");
                        return;
                    }
                    else if (playerA.hero.health <= 0) {
                        await endGame("B");
                        return;
                    }
                }
                else { // attacking card with hero
                    const attackedCard = playerB.fields[attacked];
                    if (!attackedCard ||
                        !attackedCard.health ||
                        !attackedCard.damage) {
                        return;
                    }
                    playerA.hero.health -= attackedCard.damage;
                    attackedCard.health -= playerA.hero.damage;
                    if (playerA.hero.health <= 0) {
                        await endGame("B");
                        return;
                    }
                    if (attackedCard.health <= 0) {
                        playerB.graveyard.push(attackedCard);
                        playerB.fields[attacked] = undefined;
                    }
                }
            }
            else { // attacking with card
                if (attacked === "hero") { // attacking hero with card
                    const attackerCard = playerA.fields[attacker];
                    if (!attackerCard || !attackerCard.health || !attackerCard.damage) {
                        return;
                    }
                    attackerCard.health -= playerB.hero.damage;
                    playerB.hero.health -= attackerCard.damage;
                    if (playerB.hero.health <= 0) {
                        await endGame("A");
                        return;
                    }
                    if (attackerCard.health <= 0) {
                        playerA.graveyard.push(attackerCard);
                        playerA.fields[attacker] = undefined;
                    }
                }
                else { // attacking card with card
                    const attackerCard = playerA.fields[attacker];
                    const attackedCard = playerB.fields[attacked];
                    if (!attackedCard ||
                        !attackedCard.health ||
                        !attackedCard.damage ||
                        !attackerCard ||
                        !attackerCard.health ||
                        !attackerCard.damage) {
                        return;
                    }
                    attackerCard.health -= attackedCard.damage;
                    attackedCard.health -= attackerCard.damage;
                    if (attackerCard.health <= 0) {
                        playerA.graveyard.push(attackerCard);
                        playerA.fields[attacker] = undefined;
                    }
                    if (attackedCard.health <= 0) {
                        playerB.graveyard.push(attackedCard);
                        playerB.fields[attacked] = undefined;
                    }
                }
            }
            await $games.updateOne({ gameId }, { $set: { playerA, playerB } });
        }
        else {
            opponentUsername = game.playerA.username;
            const { playerA, playerB } = game;
            if (attacker === "hero") { // attacking with hero
                if (attacked === "hero") { // attacking hero with hero
                    playerB.hero.health -= playerA.hero.damage;
                    playerA.hero.health -= playerB.hero.damage;
                    if (playerB.hero.health <= 0) {
                        await endGame("A");
                        return;
                    }
                    else if (playerA.hero.health <= 0) {
                        await endGame("B");
                        return;
                    }
                }
                else { // attacking card with hero
                    const attackedCard = playerA.fields[attacked];
                    if (!attackedCard ||
                        !attackedCard.health ||
                        !attackedCard.damage) {
                        return;
                    }
                    playerB.hero.health -= attackedCard.damage;
                    attackedCard.health -= playerB.hero.damage;
                    if (playerB.hero.health <= 0) {
                        return await endGame("A");
                    }
                    if (attackedCard.health <= 0) {
                        playerA.graveyard.push(attackedCard);
                        playerA.fields[attacked] = undefined;
                    }
                }
            }
            else { // attacking with card
                if (attacked === "hero") { // attacking hero with card
                    const attackerCard = playerB.fields[attacker];
                    if (!attackerCard || !attackerCard.health || !attackerCard.damage) {
                        return;
                    }
                    attackerCard.health -= playerA.hero.damage;
                    playerA.hero.health -= attackerCard.damage;
                    if (playerA.hero.health <= 0) {
                        await endGame("B");
                        return;
                    }
                    if (attackerCard.health <= 0) {
                        playerB.graveyard.push(attackerCard);
                        playerB.fields[attacker] = undefined;
                    }
                }
                else { // attacking card with card
                    const attackerCard = playerB.fields[attacker];
                    const attackedCard = playerA.fields[attacked];
                    if (!attackedCard ||
                        !attackedCard.health ||
                        !attackedCard.damage ||
                        !attackerCard ||
                        !attackerCard.health ||
                        !attackerCard.damage) {
                        return;
                    }
                    attackerCard.health -= attackedCard.damage;
                    attackedCard.health -= attackerCard.damage;
                    if (attackerCard.health <= 0) {
                        playerB.graveyard.push(attackerCard);
                        playerB.fields[attacker] = undefined;
                    }
                    if (attackedCard.health <= 0) {
                        playerA.graveyard.push(attackedCard);
                        playerA.fields[attacked] = undefined;
                    }
                }
            }
            await $games.updateOne({ gameId }, { $set: { playerA, playerB } });
        }
        socket.emit("attackCardSender", params);
        const opponent = await $players.findOne({
            username: opponentUsername
        });
        if (!opponent || !opponent.socketId) {
            return;
        }
        io.to(opponent.socketId).emit("attackCardReceiver", params);
    });
};

const endTurn = (services) => {
    const { mongoService, socketService } = services;
    const { $games, $players } = mongoService;
    const { io, socket, socketId } = socketService;
    socket.on("endTurn", async () => {
        const player = await $players.findOne({ socketId });
        if (!player) {
            return;
        }
        const { gameId } = player;
        const game = await $games.findOne({ gameId });
        if (!game) {
            return;
        }
        let opponentUsername;
        if (player.username === game.playerA.username) {
            const { playerA, playerB } = game;
            if (playerA.username !== game.currentPlayer) {
                return;
            }
            const { username, hand, deck, hero } = playerB;
            const card = deck.pop();
            opponentUsername = username;
            if (!card) {
                const [A, B] = await Promise.all([
                    $players.findOneAndUpdate({
                        username: playerA.username
                    }, {
                        $set: {
                            gameId: 0,
                            status: PlayerStatus.ONLINE
                        }
                    }, {
                        returnDocument: "after"
                    }),
                    $players.findOneAndUpdate({
                        username: playerB.username
                    }, {
                        $set: {
                            gameId: 0,
                            status: PlayerStatus.ONLINE
                        }
                    }, {
                        returnDocument: "after"
                    })
                ]);
                if (!A.value || !B.value) {
                    return;
                }
                io.to(A.value.socketId).emit("notification", "You won!");
                io.to(B.value.socketId).emit("notification", "You lost...");
                io.to([A.value.socketId, B.value.socketId]).emit("endGame");
                const isDeletedGame = await $games.deleteOne({ gameId });
                if (!isDeletedGame.deletedCount) {
                    return;
                }
                return;
            }
            hand.push(card);
            hero.mana = 100;
            const currentPlayer = username;
            await $games.updateOne({ gameId }, { $set: { currentPlayer, playerB } });
        }
        else {
            const { playerA, playerB } = game;
            if (playerB.username !== game.currentPlayer) {
                return;
            }
            const { username, hand, deck, hero } = playerA;
            opponentUsername = username;
            const card = deck.pop();
            if (!card) {
                const [A, B] = await Promise.all([
                    $players.findOneAndUpdate({
                        username: playerA.username
                    }, {
                        $set: {
                            gameId: 0,
                            status: PlayerStatus.ONLINE
                        }
                    }, {
                        returnDocument: "after"
                    }),
                    $players.findOneAndUpdate({
                        username: playerB.username
                    }, {
                        $set: {
                            gameId: 0,
                            status: PlayerStatus.ONLINE
                        }
                    }, {
                        returnDocument: "after"
                    })
                ]);
                if (!A.value || !B.value) {
                    return;
                }
                io.to(A.value.socketId).emit("notification", "You lost...");
                io.to(B.value.socketId).emit("notification", "You won!");
                io.to([A.value.socketId, B.value.socketId]).emit("endGame");
                const isDeletedGame = await $games.deleteOne({ gameId });
                if (!isDeletedGame.deletedCount) {
                    return;
                }
                return;
            }
            hand.push(card);
            hero.mana = 100;
            const currentPlayer = username;
            await $games.updateOne({ gameId }, { $set: { currentPlayer, playerA } });
        }
        socket.emit("endTurnPlayer");
        const opponent = await $players.findOne({
            username: opponentUsername
        });
        if (!opponent || !opponent.socketId) {
            return;
        }
        io.to(opponent.socketId).emit("endTurnOpponent");
    });
};

const hoverCard = (services) => {
    const { mongoService, socketService } = services;
    const { $games, $players } = mongoService;
    const { io, socket, socketId } = socketService;
    socket.on("hoverCard", async (params) => {
        const $player = await $players.findOne({ socketId });
        if (!$player) {
            return;
        }
        const { gameId } = $player;
        const $game = await $games.findOne({ gameId });
        if (!$game) {
            return;
        }
        let opponentName;
        if ($game.playerA.username === $player.username) {
            opponentName = $game.playerB.username;
        }
        else {
            opponentName = $game.playerA.username;
        }
        const opponent = await $players.findOne({
            username: opponentName
        });
        if (!opponent || !opponent.socketId) {
            return;
        }
        io.to(opponent.socketId).emit("hoverCard", params);
    });
};

const playCard = (services) => {
    const { mongoService, socketService } = services;
    const { $games, $players } = mongoService;
    const { io, socket, socketId } = socketService;
    socket.on("playCard", async (params) => {
        const { field, gid, id } = params;
        const $player = await $players.findOne({ socketId });
        if (!$player) {
            return;
        }
        const { gameId } = $player;
        const $game = await $games.findOne({ gameId });
        if (!$game) {
            return;
        }
        let opponentUsername = "";
        let card;
        if ($player.username === $game.playerA.username) {
            opponentUsername = $game.playerB.username;
            const { playerA } = $game;
            const { hand, fields, hero } = playerA;
            const handCard = hand.find((card) => card.gid === gid);
            if (!handCard) {
                return;
            }
            if (fields[field]) {
                return;
            }
            if (!handCard.manaCost || handCard.manaCost > hero.mana) {
                return;
            }
            hero.mana -= handCard.manaCost;
            fields[field] = handCard;
            hand.splice(hand.indexOf(handCard), 1);
            card = handCard;
            await $games.updateOne({ gameId }, { $set: { playerA } });
        }
        else {
            opponentUsername = $game.playerA.username;
            const { playerB } = $game;
            const { hand, fields, hero } = playerB;
            const handCard = hand.find((card) => card.gid === gid);
            if (!handCard) {
                return;
            }
            if (fields[field]) {
                return;
            }
            if (!handCard.manaCost || handCard.manaCost > hero.mana) {
                return;
            }
            hero.mana -= handCard.manaCost;
            fields[field] = handCard;
            hand.splice(hand.indexOf(handCard), 1);
            card = handCard;
            await $games.updateOne({ gameId }, { $set: { playerB } });
        }
        socket.emit("playCardPlayer", { field, gid });
        const opponent = await $players.findOne({
            username: opponentUsername
        });
        if (!opponent || !opponent.socketId) {
            return;
        }
        io.to(opponent.socketId).emit("playCardOpponent", { field, card });
    });
};

const unhoverCard = (services) => {
    const { mongoService, socketService } = services;
    const { $games, $players } = mongoService;
    const { io, socket, socketId } = socketService;
    socket.on("unhoverCard", async () => {
        const $player = await $players.findOne({ socketId });
        if (!$player) {
            return;
        }
        const { gameId } = $player;
        const $game = await $games.findOne({ gameId });
        if (!$game) {
            return;
        }
        let opponentName;
        if ($game.playerA.username === $player.username) {
            opponentName = $game.playerB.username;
        }
        else {
            opponentName = $game.playerA.username;
        }
        const opponent = await $players.findOne({
            username: opponentName
        });
        if (!opponent || !opponent.socketId) {
            return;
        }
        io.to(opponent.socketId).emit("unhoverCard");
    });
};

const acceptFriend = (services) => {
    const { mongoService, socketService } = services;
    const { $chats, $players } = mongoService;
    const { io, socket, socketId } = socketService;
    socket.on("acceptFriend", async (params) => {
        const { username } = params;
        const $sender = await $players.findOneAndUpdate({ socketId }, {
            $pull: {
                "social.requests": username
            },
            $push: {
                "social.friends": username
            }
        }, {
            returnDocument: "after"
        });
        if (!$sender.value) {
            return;
        }
        const receiver = await $players.findOneAndUpdate({ username }, {
            $push: {
                "social.friends": $sender.value.username
            }
        }, {
            returnDocument: "after"
        });
        if (!receiver.value) {
            return;
        }
        const insertChat = await $chats.insertOne({
            players: [$sender.value.username, receiver.value.username],
            messages: []
        });
        if (!insertChat.insertedId) {
            return;
        }
        socket.emit("acceptFriendSender", {
            username: receiver.value.username,
            avatarId: receiver.value.avatarId,
            status: receiver.value.status
        });
        io.to(receiver.value.socketId).emit("acceptFriendReceiver", {
            username: $sender.value.username,
            avatarId: $sender.value.avatarId,
            status: $sender.value.status
        });
    });
};

const addFriend = (services) => {
    const { mongoService, socketService } = services;
    const { $players } = mongoService;
    const { io, socket, socketId } = socketService;
    socket.on("addFriend", async (params) => {
        const { username } = params;
        const [sender, receiver] = await Promise.all([
            $players.findOne({ socketId }),
            $players.findOne({ username })
        ]);
        if (!sender || !receiver) {
            return;
        }
        if (sender.username === username) {
            socket.emit("notification", "You can't add yourself as a friend.");
            return;
        }
        if (receiver.social.blocked.includes(sender.username)) {
            socket.emit("notification", "This player has blocked you.");
            return;
        }
        if (sender.social.blocked.includes(username)) {
            socket.emit("notification", "You have blocked this player.");
            return;
        }
        if (receiver.social.requests.includes(sender.username)) {
            socket.emit("notification", "You have already sent the request to this player.");
            return;
        }
        if (sender.social.requests.includes(username)) {
            socket.emit("notification", "This player has already sent you the request.");
            return;
        }
        if (sender.social.friends.includes(username)) {
            socket.emit("notification", "This player is already your friend.");
            return;
        }
        const updatePlayer = await $players.updateOne({ username }, {
            $push: {
                "social.requests": sender.username
            }
        });
        if (!updatePlayer.modifiedCount) {
            return;
        }
        socket.emit("notification", "Friend request sent.");
        io.to(receiver.socketId).emit("addFriend", {
            username: sender.username
        });
    });
};

const block = (services) => {
    const { mongoService, socketService } = services;
    const { $chats, $players } = mongoService;
    const { io, socket, socketId } = socketService;
    socket.on("block", async (params) => {
        const { username } = params;
        const [sender, receiver] = await Promise.all([
            $players.findOne({ socketId }),
            $players.findOne({ username })
        ]);
        if (!sender || !receiver) {
            return;
        }
        const [isUpdatedSender, isUpdatedReceiver, isDeletedChat] = await Promise.all([
            $players.updateOne({ socketId }, {
                $pull: {
                    "social.friends": username
                },
                $push: {
                    "social.blocked": username
                }
            }),
            $players.updateOne({ username }, {
                $pull: {
                    "social.friends": sender.username
                }
            }),
            $chats.deleteOne({
                players: {
                    $all: [receiver.username, sender.username]
                }
            })
        ]);
        if (!isUpdatedSender.modifiedCount ||
            !isUpdatedReceiver.modifiedCount ||
            !isDeletedChat.deletedCount) {
            return;
        }
        socket.emit("blockSender", { username });
        io.to(receiver.socketId).emit("blockReceiver", {
            username: sender.username
        });
    });
};

const declineFriend = (services) => {
    const { mongoService, socketService } = services;
    const { $players } = mongoService;
    const { socket, socketId } = socketService;
    socket.on("declineFriend", async (params) => {
        const { username } = params;
        const updatedPlayer = await $players.updateOne({ socketId }, {
            $pull: {
                "social.requests": username
            }
        });
        if (!updatedPlayer.modifiedCount) {
            return;
        }
        socket.emit("declineFriend", { username });
    });
};

const setAvatar = (services) => {
    const { mongoService, socketService } = services;
    const { $players } = mongoService;
    const { io, socket, socketId } = socketService;
    socket.on("setAvatar", async (params) => {
        const { avatarId } = params;
        const player = await $players.findOneAndUpdate({ socketId }, {
            $set: { avatarId }
        }, {
            returnDocument: "after"
        });
        if (!player.value) {
            return;
        }
        const { username, social: { friends } } = player.value;
        const socketIds = await mongoService.getSocketIds(friends);
        socket.emit("setAvatarSender", { avatarId });
        io.to(socketIds).emit("setAvatarReceiver", { username, avatarId });
    });
};

const signout = (services) => { };

const unblock = (services) => {
    const { mongoService, socketService } = services;
    const { $players } = mongoService;
    const { socket, socketId } = socketService;
    socket.on("unblock", async (params) => {
        const { username } = params;
        const updatePlayer = await $players.updateOne({ socketId }, {
            $pull: {
                "social.blocked": username
            }
        });
        if (!updatePlayer.modifiedCount) {
            return;
        }
        socket.emit("unblock", {
            friendname: username
        });
    });
};

const unfriend = (services) => {
    const { mongoService, socketService } = services;
    const { $chats, $players } = mongoService;
    const { io, socket, socketId } = socketService;
    socket.on("unfriend", async (params) => {
        const { username } = params;
        const sender = await $players.findOneAndUpdate({ socketId }, {
            $pull: {
                "social.friends": username
            }
        }, {
            returnDocument: "after"
        });
        if (!sender.value) {
            return;
        }
        const receiver = await $players.findOneAndUpdate({ username }, [{
                $pull: {
                    "social.friends": sender.value.username
                }
            }], {
            returnDocument: "after"
        });
        if (!receiver.value) {
            return;
        }
        const deleteChat = await $chats.deleteOne({
            players: {
                $all: [username, sender.value.username]
            }
        });
        if (!deleteChat.deletedCount) {
            return;
        }
        socket.emit("unfriendSender", { username });
        io.to(receiver.value.socketId).emit("unfriendReceiver", {
            username: sender.value.username
        });
    });
};

const requests = [
    sendChatMsg,
    updateFriend,
    disconnect,
    getPrivateKeyHash,
    signin,
    signup,
    destroyLobby,
    joinLobby,
    leaveLobby,
    makeLobby,
    saveDeck,
    selectDeck,
    sendToken,
    setDeckKlass,
    setDeckName,
    startGame,
    attackCard,
    endTurn,
    hoverCard,
    playCard,
    unhoverCard,
    acceptFriend,
    addFriend,
    block,
    declineFriend,
    setAvatar,
    signout,
    unblock,
    unfriend
];

// import type {Game, Lobby, Player} from "models"
class EosService {
    _api;
    constructor(api) {
        this._api = api;
    }
    async findPlayer(username) {
        const { contractAccount } = settings.eos;
        let table;
        try {
            table = await this._api.rpc.get_table_rows({
                code: contractAccount,
                scope: contractAccount,
                table: "players",
                lower_bound: username,
                upper_bound: username,
                limit: 1
            });
        }
        catch (error) {
            console.error(error);
        }
        return table.rows[0];
    }
    // public async findLobby (lobby_id: number): Promise<Lobby | undefined> {
    //   const {contractAccount} = settings.eos;
    //   let table!: GetTableRowsResult;
    //   try {
    //     table = await this._apis.eos.rpc.get_table_rows({
    //       code: contractAccount,
    //       scope: contractAccount,
    //       table: "lobbies",
    //       lower_bound: lobby_id,
    //       upper_bound: lobby_id
    //     });
    //   } catch (error) {
    //     this._handleError(error);
    //   }
    //   return table.rows[0];
    // }
    // public async findGame (game_id: number): Promise<Game | undefined> {
    //   const {contractAccount} = settings.eos;
    //   let table!: GetTableRowsResult;
    //   try {
    //     table = await this._apis.eos.rpc.get_table_rows({
    //       code: contractAccount,
    //       scope: contractAccount,
    //       table: "games",
    //       lower_bound: game_id,
    //       upper_bound: game_id
    //     });
    //   } catch (error) {
    //     this._handleError(error);
    //   }
    //   return table.rows[0];
    // }
    async transact(action, data) {
        const { contractAccount } = settings.eos;
        let transaction;
        try {
            transaction = await this._api.transact({
                actions: [{
                        account: contractAccount,
                        name: action,
                        authorization: [{
                                actor: contractAccount,
                                permission: "active"
                            }],
                        data
                    }]
            }, {
                blocksBehind: 3,
                expireSeconds: 30
            });
        }
        catch (error) {
            console.error(error);
        }
        return transaction;
    }
}

class MongoService {
    $chats;
    $games;
    $lobbies;
    $players;
    constructor(mongoDb) {
        this.$chats = mongoDb.collection("chats");
        this.$games = mongoDb.collection("games");
        this.$lobbies = mongoDb.collection("lobbies");
        this.$players = mongoDb.collection("players");
    }
    async getSocketIds(usernames) {
        return await this
            .$players
            .find({ username: { $in: usernames } })
            .project({ _id: 0, socketId: 1 })
            .map(({ socketId }) => socketId)
            .toArray();
    }
}

class SocketService {
    io;
    socket;
    socketId;
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
        this.socketId = socket.id;
    }
}

const { mongo: { uri }, eos: { endpoint, contractKey }, socket: { opts }, server: { port } } = settings;
const httpServer = createServer();
const ioServer = new Server(httpServer, opts);
const mongoClient = await MongoClient.connect(uri);
const mongoDb = mongoClient.db("som");
const eosApi = new Api({
    rpc: new JsonRpc(endpoint, { fetch }),
    signatureProvider: new JsSignatureProvider([contractKey]),
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder()
});
const eosService = new EosService(eosApi);
const mongoService = new MongoService(mongoDb);
ioServer.on("connection", (socket) => {
    const socketService = new SocketService(ioServer, socket);
    const services = { eosService, mongoService, socketService };
    requests.forEach((request) => { request(services); });
});
process$1.on("unhandledRejection", async (reason, promise) => {
    const occuredAt = Date.now();
    await mongoDb.collection("errors").insertOne({ occuredAt, promise, reason });
    console.log("Error!\n", { reason, promise });
});
httpServer.listen(port);
//# sourceMappingURL=index.js.map
