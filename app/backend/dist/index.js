import { createServer } from 'http';
import { JsonRpc, Api } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig.js';
import { MongoClient } from 'mongodb';
import fetch from 'node-fetch';
import { Server } from 'socket.io';
import { PlayerStatus, SocketEvent } from '@som/shared/enums';
import { randomInt } from 'crypto';
import { cards } from '@som/shared/data';

const settings = {
    mongo: {
        uri: "mongodb://localhost:27017"
    },
    eos: {
        endpoint: process.env.EOS_ENDPOINT || "https://testnet.telos.net",
        contractAccount: process.env.EOS_CONTRACT_ACCOUNT || "telosgamesbp",
        contractKey: process.env.EOS_CONTRACT_KEY || "5K2rKojEWKC1UmmiyWKvvXcVeS1Devq2LQEgDyKejyFNJAX2AX2"
    },
    socket: {
        opts: {
            cors: { origin: "*" }
        }
    },
    server: {
        port: process.env.PORT || 4200
    }
};

const sendChatMsg = async (services, params) => {
    const { chatService, playerService, socketService } = services;
    const { sender, receiver, text, date } = params;
    const msg = await chatService.pushChatMsg([sender, receiver], { sender, text, date });
    if (!msg) {
        return;
    }
    socketService.emit().sendChatMsgSender({ sender, receiver, text, date });
    const player = await playerService.find({
        username: receiver
    });
    if (!player || !player.socketId) {
        return;
    }
    socketService.emit(player.socketId).sendChatMsgReceiver({ sender, text, date });
};

const updateFriend = async (services) => {
    const { playerService, socketService } = services;
    const { socketId } = socketService;
    const player = await playerService.find({ socketId });
    if (!player) {
        return;
    }
    const { username, status, social: { friends } } = player;
    const socketIds = await socketService.getSocketIds(friends);
    socketService.emit(socketIds).updateFriend({ username, status });
};

const disconnect = async (services) => {
    const { playerService, socketService } = services;
    const { socketId } = socketService;
    const player = await playerService.findAndUpdate({ socketId }, {
        $set: {
            socketId: "",
            status: PlayerStatus.OFFLINE
        }
    }, {
        returnDocument: "after"
    });
    if (!player) {
        return;
    }
    const { username, status, social: { friends } } = player;
    const socketIds = await socketService.getSocketIds(friends);
    socketService.emit(socketIds).updateFriend({ username, status });
};

const getPrivateKeyHash = async (services, params) => {
    const { playerService, socketService } = services;
    const { username } = params;
    const player = await playerService.find({ username });
    if (!player) {
        const msg = "Player not found.";
        socketService.emit().notification({ msg });
        return;
    }
    const { privateKeyHash } = player;
    socketService.emit().getPrivateKeyHash({ privateKeyHash });
};

const signin = async (services, params) => {
    const { blockchainService, chatService, gameService, lobbyService, playerService, socketService } = services;
    const { username, publicKey, signature } = params;
    let lobby;
    let game;
    // const transaction = await blockchainService.transact("signin", {publicKey, signature});
    // if (!transaction) { return; }
    const { socketId } = socketService;
    const player = await playerService.findAndUpdate({ username }, [{
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
    const playerOnchain = await blockchainService.findPlayer(username);
    if (!player || !playerOnchain) {
        return;
    }
    const { wallet, last_nonce } = playerOnchain;
    const { friends } = player.social;
    const friendsView = [];
    for (const friendname of friends) {
        const [friend, chat] = await Promise.all([
            playerService.find({
                username: friendname
            }),
            chatService.find({
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
    const { lobbyId, gameId } = player;
    let gameView;
    if (lobbyId) {
        lobby = await lobbyService.find({ lobbyId });
        if (!lobby) {
            return;
        }
    }
    else if (gameId) {
        game = await gameService.find({ gameId });
        if (!game) {
            return;
        }
        if (player.username === game.playerA.username) {
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
    socketService.emit().signin({
        player: { ...player, wallet, last_nonce },
        friends: friendsView,
        lobby,
        game: gameView
    });
};

const signup = async (services, params) => {
    const { blockchainService, playerService, socketService } = services;
    const { username, publicKey, privateKeyHash } = params;
    const player = await playerService.find({ username });
    if (player) {
        const msg = "Username taken.";
        socketService.emit().notification({ msg });
        return;
    }
    const [transaction, isInserted] = await Promise.all([
        blockchainService.transact("signup", { username, public_key: publicKey }),
        playerService.insert({
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
            social: { friends: [], requests: [], blocked: [] }
        })
    ]);
    if (!transaction || !isInserted) {
        return;
    }
    const msg = "Account created successfully, you can now sign in.";
    socketService.emit().notification({ msg });
};

const destroyLobby = async (services) => {
    const { lobbyService, playerService, socketService } = services;
    const { socketId } = socketService;
    const player = await playerService.find({ socketId });
    if (!player) {
        return;
    }
    const { username, lobbyId } = player;
    if (!lobbyId) {
        const msg = "You are not in a lobby.";
        socketService.emit().notification({ msg });
        return;
    }
    const lobby = await lobbyService.find({ lobbyId });
    if (!lobby) {
        return;
    }
    if (username !== lobby.host.username) {
        const msg = "You are not the lobby host.";
        socketService.emit().notification({ msg });
        return;
    }
    const [isDeletedLobby, isUpdatedPlayer] = await Promise.all([
        lobbyService.delete({ lobbyId }),
        playerService.update({ socketId }, {
            $set: {
                lobbyId: 0,
                status: PlayerStatus.ONLINE
            }
        })
    ]);
    if (!isDeletedLobby || !isUpdatedPlayer) {
        return;
    }
    if (lobby.challengee.username) {
        const challengee = await playerService.findAndUpdate({
            username: lobby.challengee.username
        }, {
            $set: {
                lobbyId: 0,
                status: PlayerStatus.ONLINE
            }
        }, {
            returnDocument: "after"
        });
        if (!challengee) {
            return;
        }
        socketService.emit(challengee.socketId).destroyLobby();
    }
    socketService.emit().destroyLobby();
};

const joinLobby = async (services, params) => {
    console.log("joinLobby");
    const { lobbyService, playerService, socketService } = services;
    const { lobbyId } = params;
    const { socketId } = socketService;
    const [player, lobby] = await Promise.all([
        playerService.find({ socketId }),
        lobbyService.find({ lobbyId })
    ]);
    if (!player) {
        return;
    }
    if (!lobby) {
        const msg = "Lobby not found.";
        socketService.emit().notification({ msg });
        return;
    }
    if (player.lobbyId > 0) {
        const msg = "You are already in a lobby.";
        socketService.emit().notification({ msg });
        return;
    }
    if (player.gameId > 0) {
        const msg = "You can't join a lobby while in game.";
        socketService.emit().notification({ msg });
        return;
    }
    if (lobby.challengee.username) {
        const msg = "Lobby is full.";
        socketService.emit().notification({ msg });
        return;
    }
    const { username, avatarId } = player;
    const updated = await lobbyService.findAndUpdate({ lobbyId }, {
        $set: {
            challengee: { username, avatarId }
        }
    }, { returnDocument: "after" });
    const isPlayerUpdated = await playerService.update({ socketId }, {
        $set: {
            lobbyId,
            status: PlayerStatus.INLOBBY
        }
    });
    if (!updated || !isPlayerUpdated) {
        return;
    }
    socketService.emit().joinLobbySender({ lobby: updated });
    const host = await playerService.find({ username: updated.host.username });
    if (!host || !host.socketId) {
        return;
    }
    const { challengee } = updated;
    socketService.emit(host.socketId).joinLobbyReceiver({ challengee });
};

const leaveLobby = async (services) => {
    const { lobbyService, playerService, socketService } = services;
    const { socketId } = socketService;
    const player = await playerService.find({ socketId });
    if (!player) {
        return;
    }
    const { lobbyId } = player;
    if (lobbyId <= 0) {
        const msg = "You are not in a lobby.";
        socketService.emit().notification({ msg });
        return;
    }
    const lobby = await lobbyService.find({ lobbyId });
    if (!lobby) {
        return;
    }
    const [updatedLobby, isUpdatedPlayer] = await Promise.all([
        lobbyService.findAndUpdate({ lobbyId }, {
            $set: {
                challengee: {
                    username: "",
                    avatarId: 0
                }
            }
        }, {
            returnDocument: "after"
        }),
        playerService.update({ socketId }, {
            $set: {
                lobbyId: 0,
                status: PlayerStatus.ONLINE
            }
        })
    ]);
    if (!updatedLobby || !isUpdatedPlayer) {
        return;
    }
    socketService.emit().leaveLobbySender();
    const host = await playerService.find({
        username: updatedLobby.host.username
    });
    if (!host || !host.socketId) {
        return;
    }
    socketService.emit(host.socketId).leaveLobbyReceiver();
};

const makeLobby = async (services) => {
    const { lobbyService, playerService, socketService } = services;
    const { socketId } = socketService;
    const player = await playerService.find({ socketId });
    if (!player) {
        return;
    }
    if (player.lobbyId) {
        const msg = "You are already in a lobby.";
        socketService.emit().notification({ msg });
        return;
    }
    if (player.gameId) {
        const msg = "You can't make a lobby while in game.";
        socketService.emit().notification({ msg });
    }
    const { username, avatarId } = player;
    const lobbyId = randomInt(1, 1000000);
    const [isInsertedLobby, isUpdatedPlayer] = await Promise.all([
        lobbyService.insert({
            lobbyId,
            host: { username, avatarId },
            challengee: {
                username: "",
                avatarId: 0
            }
        }),
        playerService.update({ socketId }, {
            $set: {
                lobbyId,
                status: PlayerStatus.INLOBBY
            }
        })
    ]);
    if (!isInsertedLobby || !isUpdatedPlayer) {
        return;
    }
    const lobby = await lobbyService.find({ lobbyId });
    if (!lobby) {
        return;
    }
    socketService.emit().makeLobby({ lobby });
};

const saveDeck = async (services, params) => {
    const { playerService, socketService } = services;
    const { cards } = params;
    const { socketId } = socketService;
    const player = await playerService.find({ socketId });
    if (!player) {
        return;
    }
    const { deckId } = player;
    const isUpdated = await playerService.update({
        socketId,
        "decks.id": deckId
    }, {
        $set: {
            "decks.$.cards": cards
        }
    });
    if (!isUpdated) {
        return;
    }
    socketService.emit().saveDeck({ cards });
};

const selectDeck = async (services, params) => {
    const { playerService, socketService } = services;
    const { deckId } = params;
    const { socketId } = socketService;
    const isUpdated = await playerService.update({ socketId }, {
        $set: { deckId }
    });
    if (!isUpdated) {
        return;
    }
    socketService.emit().selectDeck({ deckId });
};

const sendToken = async (services, params) => {
    const { blockchainService } = services;
    const transaction = await blockchainService.transact("transfer", params);
    if (!transaction) {
        return;
    }
};

const setDeckKlass = async (services, params) => {
    const { playerService, socketService } = services;
    const { deckId, klass } = params;
    const { socketId } = socketService;
    const isUpdated = await playerService.update({
        socketId,
        "decks.id": deckId
    }, {
        $set: {
            "decks.$.klass": klass
        }
    });
    if (!isUpdated) {
        return;
    }
    socketService.emit().setDeckKlass({ deckId, klass });
};

const setDeckName = async (services, params) => {
    const { playerService, socketService } = services;
    const { id, name } = params;
    const { socketId } = socketService;
    const isUpdated = await playerService.update({
        socketId,
        "decks.id": id
    }, {
        $set: {
            "decks.$.name": name
        }
    });
    if (!isUpdated) {
        return;
    }
    socketService.emit().setDeckName({ id, name });
};

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = randomInt(0, i + 1);
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
const startGame = async (services, params) => {
    const { gameService, lobbyService, playerService, socketService } = services;
    const { lobbyId } = params;
    const lobby = await lobbyService.find({ lobbyId });
    const isDeleted = await lobbyService.delete({ lobbyId });
    if (!lobby || !isDeleted) {
        return;
    }
    const [playerA, playerB] = await Promise.all([
        playerService.findAndUpdate({ username: lobby.host.username }, {
            $set: {
                lobbyId: 0,
                gameId: lobbyId,
                status: PlayerStatus.INGAME
            }
        }, { returnDocument: "after" }),
        playerService.findAndUpdate({ username: lobby.challengee.username }, {
            $set: {
                lobbyId: 0,
                gameId: lobbyId,
                status: PlayerStatus.INGAME
            }
        }, { returnDocument: "after" })
    ]);
    if (!playerA || !playerB)
        return;
    let gid = 1;
    let playerADeck = [];
    const playerAHand = [];
    let playerBDeck = [];
    const playerBHand = [];
    for (let i = 0; i < playerA.decks[playerA.deckId].cards.length; i += 1) {
        let id = playerA.decks[playerA.deckId].cards[i].id;
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
        if (playerA.decks[playerA.deckId].cards[i].amount > 1) {
            if (card.health) {
                playerADeck.push({ gid, ...card, maxHealth: card.health });
            }
            else {
                playerADeck.push({ gid, ...card });
            }
            gid += 1;
        }
    }
    for (let i = 0; i < playerB.decks[playerB.deckId].cards.length; i += 1) {
        let id = playerB.decks[playerB.deckId].cards[i].id;
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
        if (playerB.decks[playerB.deckId].cards[i].amount > 1) {
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
        gameId: lobby.lobbyId,
        currentPlayer: lobby.host.username,
        playerA: {
            username: lobby.host.username,
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
            username: lobby.challengee.username,
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
    const isInserted = await gameService.insert(game);
    if (!isInserted) {
        return;
    }
    const gameSender = {
        gameId: lobby.lobbyId,
        currentPlayer: lobby.host.username,
        player: {
            username: lobby.host.username,
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
            username: lobby.challengee.username,
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
        gameId: lobby.lobbyId,
        currentPlayer: lobby.host.username,
        player: {
            username: lobby.challengee.username,
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
            username: lobby.host.username,
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
    socketService.emit().startGame({ game: gameSender });
    const { username } = lobby.challengee;
    const challengee = await playerService.find({ username });
    if (!challengee || !challengee.socketId) {
        return;
    }
    socketService.emit(challengee.socketId).startGame({ game: gameReceiver });
};

const withdrawToken = async (services, params) => {
    console.log("withdrawing...");
    const { blockchainService } = services;
    const transaction = await blockchainService.transact("withdraw", params);
    if (!transaction) {
        return;
    }
};

const attackCard = async (services, params) => {
    const { gameService, playerService, socketService } = services;
    const { attacked, attacker } = params;
    const { socketId } = socketService;
    const player = await playerService.find({ socketId });
    if (!player) {
        return;
    }
    const { gameId } = player;
    const game = await gameService.find({ gameId });
    if (!game) {
        return;
    }
    let opponentUsername;
    const endGame = async (winner) => {
        const { playerA, playerB } = game;
        const [A, B] = await Promise.all([
            playerService.findAndUpdate({
                username: playerA.username
            }, {
                $set: {
                    gameId: 0,
                    status: PlayerStatus.ONLINE
                }
            }, {
                returnDocument: "after"
            }),
            playerService.findAndUpdate({
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
        if (!A || !B) {
            return;
        }
        const isDeletedGame = await gameService.delete({ gameId });
        if (!isDeletedGame) {
            return;
        }
        if (winner === "A") {
            socketService.emit(A.socketId).notification({ msg: "You won!" });
            socketService.emit(B.socketId).notification({ msg: "You lost..." });
        }
        else if (winner === "B") {
            socketService.emit(B.socketId).notification({ msg: "You won!" });
            socketService.emit(A.socketId).notification({ msg: "You lost..." });
        }
        socketService.emit(A.socketId).endGame();
        socketService.emit(B.socketId).endGame();
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
        await gameService.update({ gameId }, { $set: { playerA, playerB } });
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
                    await endGame("A");
                    return;
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
        await gameService.update({ gameId }, { $set: { playerA, playerB } });
    }
    socketService.emit().attackCardSender(params);
    const opponent = await playerService.find({
        username: opponentUsername
    });
    if (!opponent || !opponent.socketId) {
        return;
    }
    socketService.emit(opponent.socketId).attackCardReceiver(params);
};

const endTurn = async (services) => {
    const { gameService, playerService, socketService } = services;
    const { socketId } = socketService;
    const player = await playerService.find({ socketId });
    if (!player) {
        return;
    }
    const { gameId } = player;
    const game = await gameService.find({ gameId });
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
                playerService.findAndUpdate({
                    username: playerA.username
                }, {
                    $set: {
                        gameId: 0,
                        status: PlayerStatus.ONLINE
                    }
                }, {
                    returnDocument: "after"
                }),
                playerService.findAndUpdate({
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
            if (!A || !B) {
                return;
            }
            socketService.emit(A.socketId).notification({ msg: "You won!" });
            socketService.emit(A.socketId).endGame();
            socketService.emit(B.socketId).notification({ msg: "You lost..." });
            socketService.emit(B.socketId).endGame();
            const isDeletedGame = await gameService.delete({ gameId });
            if (!isDeletedGame) {
                return;
            }
            return;
        }
        hand.push(card);
        hero.mana = 100;
        const currentPlayer = username;
        await gameService.update({ gameId }, { $set: { currentPlayer, playerB } });
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
                playerService.findAndUpdate({
                    username: playerA.username
                }, {
                    $set: {
                        gameId: 0,
                        status: PlayerStatus.ONLINE
                    }
                }, {
                    returnDocument: "after"
                }),
                playerService.findAndUpdate({
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
            if (!A || !B) {
                return;
            }
            socketService.emit(A.socketId).notification({ msg: "You lost..." });
            socketService.emit(A.socketId).endGame();
            socketService.emit(B.socketId).notification({ msg: "You won!" });
            socketService.emit(B.socketId).endGame();
            const isDeletedGame = await gameService.delete({ gameId });
            if (!isDeletedGame) {
                return;
            }
            return;
        }
        hand.push(card);
        hero.mana = 100;
        const currentPlayer = username;
        await gameService.update({ gameId }, { $set: { currentPlayer, playerA } });
    }
    socketService.emit().endTurnPlayer();
    const opponent = await playerService.find({
        username: opponentUsername
    });
    if (!opponent || !opponent.socketId) {
        return;
    }
    socketService.emit(opponent.socketId).endTurnOpponent();
};

const hoverCard = async (services, params) => {
    const { gameService, playerService, socketService } = services;
    const { socketId } = socketService;
    const player = await playerService.find({ socketId });
    if (!player) {
        return;
    }
    const { gameId } = player;
    const game = await gameService.find({ gameId });
    if (!game) {
        return;
    }
    let opponentName;
    if (game.playerA.username === player.username) {
        opponentName = game.playerB.username;
    }
    else {
        opponentName = game.playerA.username;
    }
    const opponent = await playerService.find({
        username: opponentName
    });
    if (!opponent || !opponent.socketId) {
        return;
    }
    socketService.emit(opponent.socketId).hoverCard(params);
};

const playCard = async (services, params) => {
    const { gameService, playerService, socketService } = services;
    const { field, gid, id } = params;
    const { socketId } = socketService;
    const player = await playerService.find({ socketId });
    if (!player) {
        return;
    }
    const { gameId } = player;
    const game = await gameService.find({ gameId });
    if (!game) {
        return;
    }
    let opponentUsername = "";
    let card;
    if (player.username === game.playerA.username) {
        opponentUsername = game.playerB.username;
        const { playerA } = game;
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
        await gameService.update({ gameId }, { $set: { playerA } });
    }
    else {
        opponentUsername = game.playerA.username;
        const { playerB } = game;
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
        await gameService.update({ gameId }, { $set: { playerB } });
    }
    socketService.emit().playCardSender({ field, gid });
    const opponent = await playerService.find({
        username: opponentUsername
    });
    if (!opponent || !opponent.socketId) {
        return;
    }
    socketService.emit(opponent.socketId).playCardReceiver({ field, card });
};

const unhoverCard = async (services) => {
    const { gameService, playerService, socketService } = services;
    const { socketId } = socketService;
    const player = await playerService.find({ socketId });
    if (!player) {
        return;
    }
    const { gameId } = player;
    const game = await gameService.find({ gameId });
    if (!game) {
        return;
    }
    let opponentName;
    if (game.playerA.username === player.username) {
        opponentName = game.playerB.username;
    }
    else {
        opponentName = game.playerA.username;
    }
    const opponent = await playerService.find({
        username: opponentName
    });
    if (!opponent || !opponent.socketId) {
        return;
    }
    socketService.emit(opponent.socketId).unhoverCard();
};

const acceptFriend = async (services, params) => {
    const { chatService, playerService, socketService } = services;
    const { username } = params;
    const { socketId } = socketService;
    const sender = await playerService.findAndUpdate({ socketId }, {
        $pull: {
            "social.requests": username
        },
        $push: {
            "social.friends": username
        }
    }, {
        returnDocument: "after"
    });
    if (!sender) {
        return;
    }
    const receiver = await playerService.findAndUpdate({ username }, {
        $push: {
            "social.friends": sender.username
        }
    }, {
        returnDocument: "after"
    });
    if (!receiver) {
        return;
    }
    const isInsertedChat = await chatService.insert({
        players: [sender.username, receiver.username],
        messages: []
    });
    if (!isInsertedChat) {
        return;
    }
    socketService.emit().acceptFriendSender({
        username: receiver.username,
        avatarId: receiver.avatarId,
        status: receiver.status
    });
    socketService.emit(receiver.socketId).acceptFriendReceiver({
        username: sender.username,
        avatarId: sender.avatarId,
        status: sender.status
    });
};

const addFriend = async (services, params) => {
    const { playerService, socketService } = services;
    const { username } = params;
    const { socketId } = socketService;
    const [sender, receiver] = await Promise.all([
        playerService.find({ socketId }),
        playerService.find({ username })
    ]);
    if (!sender || !receiver) {
        return;
    }
    if (sender.username === username) {
        socketService.emit().notification({ msg: "You can't add yourself as a friend." });
        return;
    }
    if (receiver.social.blocked.includes(sender.username)) {
        socketService.emit().notification({ msg: "This player has blocked you." });
        return;
    }
    if (sender.social.blocked.includes(username)) {
        socketService.emit().notification({ msg: "You have blocked this player." });
        return;
    }
    if (receiver.social.requests.includes(sender.username)) {
        socketService.emit().notification({ msg: "You have already sent the request to this player." });
        return;
    }
    if (sender.social.requests.includes(username)) {
        socketService.emit().notification({ msg: "This player has already sent you the request." });
        return;
    }
    if (sender.social.friends.includes(username)) {
        socketService.emit().notification({ msg: "This player is already your friend." });
        return;
    }
    const isUpdated = await playerService.update({ username }, {
        $push: {
            "social.requests": sender.username
        }
    });
    if (!isUpdated) {
        return;
    }
    socketService.emit().notification({ msg: "Friend request sent." });
    socketService.emit(receiver.socketId).addFriend({ username: sender.username });
};

const block = async (services, params) => {
    const { chatService, playerService, socketService } = services;
    const { username } = params;
    const { socketId } = socketService;
    const [sender, receiver] = await Promise.all([
        playerService.find({ socketId }),
        playerService.find({ username })
    ]);
    if (!sender || !receiver) {
        return;
    }
    const [isUpdatedSender, isUpdatedReceiver, isDeletedChat] = await Promise.all([
        playerService.update({ socketId }, {
            $pull: {
                "social.friends": username
            },
            $push: {
                "social.blocked": username
            }
        }),
        playerService.update({ username }, {
            $pull: {
                "social.friends": sender.username
            }
        }),
        chatService.delete({
            players: {
                $all: [username, sender.username]
            }
        })
    ]);
    if (!isUpdatedSender || !isUpdatedReceiver || !isDeletedChat) {
        return;
    }
    socketService.emit().blockFriendSender({ username });
    if (!receiver.socketId) {
        return;
    }
    socketService.emit(receiver.socketId).blockFriendReceiver({
        username: sender.username
    });
};

const declineFriend = async (services, params) => {
    const { playerService, socketService } = services;
    const { username } = params;
    const { socketId } = socketService;
    const isUpdated = await playerService.update({ socketId }, {
        $pull: {
            "social.requests": username
        }
    });
    if (!isUpdated) {
        return;
    }
    socketService.emit().declineFriend({ username });
};

const setAvatar = async (services, params) => {
    const { playerService, socketService } = services;
    const { avatarId } = params;
    const { socketId } = socketService;
    const player = await playerService.findAndUpdate({ socketId }, {
        $set: { avatarId }
    }, {
        returnDocument: "after"
    });
    if (!player) {
        return;
    }
    const { username, social: { friends } } = player;
    socketService.emit().setAvatarSender({ avatarId });
    const socketIds = await socketService.getSocketIds(friends);
    if (!socketIds.length) {
        return;
    }
    socketService.emit(socketIds).setAvatarReceiver({ username, avatarId });
};

const signout = async (services) => { };

const unblock = async (services, params) => {
    const { playerService, socketService } = services;
    const { username } = params;
    const { socketId } = socketService;
    const isUpdated = playerService.update({ socketId }, {
        $pull: {
            "social.blocked": username
        }
    });
    if (!isUpdated) {
        return;
    }
    socketService.emit().unblockFriend({ username }); // ;w;
};

const unfriend = async (services, params) => {
    const { chatService, playerService, socketService } = services;
    const { username } = params;
    const { socketId } = socketService;
    const sender = await playerService.findAndUpdate({ socketId }, {
        $pull: {
            "social.friends": username
        }
    }, {
        returnDocument: "after"
    });
    if (!sender) {
        return;
    }
    const receiver = await playerService.findAndUpdate({ username }, {
        $pull: {
            "social.friends": sender.username
        }
    }, {
        returnDocument: "after"
    });
    if (!receiver) {
        return;
    }
    const isDeletedChat = await chatService.delete({
        players: {
            $all: [username, sender.username]
        }
    });
    if (!isDeletedChat) {
        return;
    }
    socketService.emit().unfriendSender({ username });
    socketService.emit(receiver.socketId).unfriendReceiver({
        username: sender.username
    });
};

// Global

var requests = /*#__PURE__*/Object.freeze({
    __proto__: null,
    sendChatMsg: sendChatMsg,
    updateFriend: updateFriend,
    disconnect: disconnect,
    getPrivateKeyHash: getPrivateKeyHash,
    signin: signin,
    signup: signup,
    destroyLobby: destroyLobby,
    joinLobby: joinLobby,
    leaveLobby: leaveLobby,
    makeLobby: makeLobby,
    saveDeck: saveDeck,
    selectDeck: selectDeck,
    sendToken: sendToken,
    setDeckKlass: setDeckKlass,
    setDeckName: setDeckName,
    startGame: startGame,
    withdrawToken: withdrawToken,
    attackCard: attackCard,
    endTurn: endTurn,
    hoverCard: hoverCard,
    playCard: playCard,
    unhoverCard: unhoverCard,
    acceptFriend: acceptFriend,
    addFriend: addFriend,
    block: block,
    declineFriend: declineFriend,
    setAvatar: setAvatar,
    signout: signout,
    unblock: unblock,
    unfriend: unfriend
});

class Service {
    _apis;
    constructor(apis) { this._apis = apis; }
    get _socket() { return this._apis.socket; }
    _handleError(error) {
        console.error(error);
        this._apis.socket.emit("notification", { msg: JSON.stringify(error) });
    }
}

// import type {Game, Lobby, Player} from "models"
class BlockchainService extends Service {
    async findPlayer(username) {
        const { contractAccount } = settings.eos;
        let table;
        try {
            table = await this._apis.eos.rpc.get_table_rows({
                code: contractAccount,
                scope: contractAccount,
                table: "players",
                lower_bound: username,
                upper_bound: username,
                limit: 1
            });
        }
        catch (error) {
            this._handleError(error);
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
            transaction = await this._apis.eos.transact({
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
            this._handleError(error);
        }
        return transaction;
    }
}

class MongoService extends Service {
    _collectionName;
    constructor(apis, collectionName) {
        super(apis);
        this._collectionName = collectionName;
    }
    get _collection() {
        return this._apis.mongo.collection(this._collectionName);
    }
    async find(query) {
        let document;
        try {
            document = await this._collection.findOne(query);
        }
        catch (error) {
            this._handleError(error);
        }
        return document ? document : undefined;
    }
    async insert(doc) {
        let inserted;
        try {
            inserted = await this._collection.insertOne(doc);
        }
        catch (error) {
            this._handleError(error);
        }
        return inserted.acknowledged;
    }
    async update(filter, update) {
        let updated;
        try {
            updated = await this._collection.updateOne(filter, update);
        }
        catch (error) {
            this._handleError(error);
        }
        return updated.acknowledged;
    }
    async delete(filter) {
        let deleteResult;
        try {
            deleteResult = await this._collection.deleteOne(filter);
        }
        catch (error) {
            this._handleError(error);
        }
        return deleteResult.acknowledged;
    }
    async findAndUpdate(filter, update, options) {
        let result;
        try {
            result = await this._collection.findOneAndUpdate(filter, update, options);
        }
        catch (error) {
            this._handleError(error);
        }
        return result.value ? result.value : undefined;
    }
}

class ChatService extends MongoService {
    async pushChatMsg(players, msg) {
        const { sender, text, date } = msg;
        let updated;
        try {
            updated = await this._apis.mongo.collection("chats").updateOne({
                players: { $all: players }
            }, {
                $push: {
                    messages: { sender, text, date }
                }
            });
        }
        catch (error) {
            this._handleError(error);
        }
        return updated.modifiedCount > 0 ? true : false;
    }
}

class GameService extends MongoService {
}

class LobbyService extends MongoService {
}

class PlayerService extends MongoService {
}

class SocketService extends Service {
    get socketId() { return this._apis.socket.id; }
    async getSocketIds(players) {
        let socketIds;
        try {
            socketIds = await this._apis.mongo.collection("players")
                .find({ username: { $in: players } })
                .project({ _id: 0, socketId: 1 })
                .map(({ socketId }) => socketId)
                .toArray();
        }
        catch (error) {
            this._handleError(error);
        }
        return socketIds;
    }
    emit(room) {
        const { socket, io } = this._apis;
        let emitter;
        if (room === undefined) {
            emitter = socket;
        }
        else {
            emitter = io.to(room);
        }
        return {
            // ------------------------------ GLOBAL ------------------------------
            notification(params) { emitter.emit(SocketEvent.NOTIFICATION, params); },
            sendChatMsgReceiver(params) { emitter.emit(SocketEvent.SEND_CHAT_MSG_RECEIVER, params); },
            sendChatMsgSender(params) { emitter.emit(SocketEvent.SEND_CHAT_MSG_SENDER, params); },
            updateFriend(params) { emitter.emit(SocketEvent.UPDATE_FRIEND, params); },
            // ------------------------------ AUTH ------------------------------
            getPrivateKeyHash(params) { emitter.emit(SocketEvent.GET_PRIVATE_KEY_HASH, params); },
            signin(params) { emitter.emit(SocketEvent.SIGNIN, params); },
            // ------------------------------ CLIENT ------------------------------
            destroyLobby() { emitter.emit(SocketEvent.DESTROY_LOBBY); },
            joinLobbyReceiver(params) { emitter.emit(SocketEvent.JOIN_LOBBY_RECEIVER, params); },
            joinLobbySender(params) { emitter.emit(SocketEvent.JOIN_LOBBY_SENDER, params); },
            leaveLobbyReceiver() { emitter.emit(SocketEvent.LEAVE_LOBBY_RECEIVER); },
            leaveLobbySender() { emitter.emit(SocketEvent.LEAVE_LOBBY_SENDER); },
            makeLobby(params) { emitter.emit(SocketEvent.MAKE_LOBBY, params); },
            saveDeck(params) { emitter.emit(SocketEvent.SAVE_DECK, params); },
            selectDeck(params) { emitter.emit(SocketEvent.SELECT_DECK, params); },
            setDeckKlass(params) { emitter.emit(SocketEvent.SET_DECK_KLASS, params); },
            setDeckName(params) { emitter.emit(SocketEvent.SET_DECK_NAME, params); },
            startGame(params) { emitter.emit(SocketEvent.START_GAME, params); },
            // ------------------------------ GAME ------------------------------
            attackCardReceiver(params) { emitter.emit(SocketEvent.ATTACK_CARD_RECEIVER, params); },
            attackCardSender(params) { emitter.emit(SocketEvent.ATTACK_CARD_SENDER, params); },
            endTurnOpponent() { emitter.emit(SocketEvent.END_TURN_OPPONENT); },
            endTurnPlayer() { emitter.emit(SocketEvent.END_TURN_PLAYER); },
            hoverCard(params) { emitter.emit(SocketEvent.HOVER_CARD, params); },
            unhoverCard() { emitter.emit(SocketEvent.UNHOVER_CARD); },
            playCardReceiver(params) { emitter.emit(SocketEvent.PLAY_CARD_RECEIVER, params); },
            playCardSender(params) { emitter.emit(SocketEvent.PLAY_CARD_SENDER, params); },
            endGame() { emitter.emit(SocketEvent.END_GAME); },
            // ------------------------------ SIDENAV ------------------------------
            acceptFriendReceiver(params) { emitter.emit(SocketEvent.ACCEPT_FRIEND_RECEIVER, params); },
            acceptFriendSender(params) { emitter.emit(SocketEvent.ACCEPT_FRIEND_SENDER, params); },
            addFriend(params) { emitter.emit(SocketEvent.ADD_FRIEND, params); },
            blockFriendReceiver(params) { emitter.emit(SocketEvent.BLOCK_FRIEND_RECEIVER, params); },
            blockFriendSender(params) { emitter.emit(SocketEvent.BLOCK_FRIEND_SENDER, params); },
            declineFriend(params) { emitter.emit(SocketEvent.DECLINE_FRIEND, params); },
            setAvatarReceiver(params) { emitter.emit(SocketEvent.SET_AVATAR_RECEIVER, params); },
            setAvatarSender(params) { emitter.emit(SocketEvent.SET_AVATAR_SENDER, params); },
            unblockFriend(params) { emitter.emit(SocketEvent.UNBLOCK_FRIEND, params); },
            unfriendReceiver(params) { emitter.emit(SocketEvent.UNFRIEND_RECEIVER, params); },
            unfriendSender(params) { emitter.emit(SocketEvent.UNFRIEND_SENDER, params); },
        };
    }
}

const { mongo: { uri }, eos: { endpoint, contractKey }, socket: { opts }, server: { port } } = settings;
const httpServer = createServer();
const ioServer = new Server(httpServer, opts);
const mongoClient = await MongoClient.connect(uri);
const mongoDb = mongoClient.db("som");
const rpc = new JsonRpc(endpoint, { fetch });
const signatureProvider = new JsSignatureProvider([contractKey]);
const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();
const eosApi = new Api({ rpc, signatureProvider, textDecoder, textEncoder });
const requestKeys = Object.keys(requests);
ioServer.on("connection", (socket) => {
    const apis = {
        eos: eosApi,
        mongo: mongoDb,
        socket,
        io: ioServer
    };
    const services = {
        blockchainService: new BlockchainService(apis),
        chatService: new ChatService(apis, "chats"),
        gameService: new GameService(apis, "games"),
        lobbyService: new LobbyService(apis, "lobbies"),
        playerService: new PlayerService(apis, "players"),
        socketService: new SocketService(apis)
    };
    requestKeys.forEach((request) => {
        socket.on(request, (params) => {
            requests[request](services, params);
        });
    });
});
httpServer.listen(port, () => { console.log("Running."); });
//# sourceMappingURL=index.js.map
