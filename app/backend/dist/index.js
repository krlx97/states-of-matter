import { createServer } from 'http';
import { Server } from 'socket.io';
import { PlayerStatus, Effect, CardType } from '@som/shared/enums';
import { MongoClient } from 'mongodb';
import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig.js';
import fetch from 'node-fetch';
import { cards, heroes } from '@som/shared/data';
import { randomInt } from 'crypto';

const settings = {
    mongo: {
        uri: "mongodb://localhost:27017"
    },
    eos: {
        endpoint: "https://testnet.telos.net",
        contractAccount: "somgame11111",
        contractKey: "5K52s5CAKU6tEXE6Rnirsjz5SKtWfKBN4H5634MSqMH6huaUAkx"
    },
    socket: {
        opts: {
            cors: {
                origin: "*"
            }
        }
    },
    server: {
        port: 4200
    }
};

const { socket: { opts } } = settings;
const httpServer = createServer();
const ioServer = new Server(httpServer, opts);

const { mongo: { uri } } = settings;
const mongoClient = await MongoClient.connect(uri);
const mongoDb = mongoClient.db("som");
const casualQueuePlayersDb = mongoDb.collection("casualQueuePlayers");
const rankedQueuePlayersDb = mongoDb.collection("rankedQueuePlayers");
const chatsDb = mongoDb.collection("chats");
const gamesDb = mongoDb.collection("games");
const lobbiesDb = mongoDb.collection("lobbies");
const playersDb = mongoDb.collection("players");

const getXpRequired = (lv) => 1000 + (lv % 10) * 100;

const { eos: { endpoint, contractKey } } = settings;
const eosApi = new Api({
    rpc: new JsonRpc(endpoint, { fetch }),
    signatureProvider: new JsSignatureProvider([contractKey]),
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder()
});
const findPlayer = async (username) => {
    const { contractAccount } = settings.eos;
    let table;
    try {
        table = await eosApi.rpc.get_table_rows({
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
};
const transact = async (action, data) => {
    const { contractAccount } = settings.eos;
    return await eosApi.transact({
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
};

const checkLevelUp = async (player) => {
    const { username, socketId } = player;
    const xpRequired = getXpRequired(player.lv);
    if (player.xp <= xpRequired) {
        return;
    }
    const xp = player.xp - xpRequired;
    await playersDb.updateOne({ username }, {
        $inc: {
            lv: 1
        },
        $set: { xp }
    });
    await eosApi.transact({
        actions: [{
                account: "somgame11111",
                name: "flushtoken",
                authorization: [{
                        actor: "somgame11111",
                        permission: "active"
                    }],
                data: {
                    username, quantity: "1 DMTTEST"
                }
            }]
    }, {
        blocksBehind: 3,
        expireSeconds: 30
    });
    ioServer.to(socketId).emit("levelUp", { xp });
};

const getSocketIds = async (players) => {
    return await playersDb
        .find({ username: { $in: players } })
        .project({ _id: 0, socketId: 1 })
        .map(({ socketId }) => socketId)
        .toArray();
};

const isDeckValid = (playerDeck) => {
    const numberOfCards = playerDeck
        .cards
        .reduce((value, card) => value += card.amount, 0);
    if (numberOfCards !== 30) {
        return false;
    }
    return true;
};

const disconnect = (socket) => {
    socket.on("disconnect", async (reason) => {
        const socketId = socket.id;
        const player = await playersDb.findOneAndUpdate({ socketId }, {
            $set: {
                socketId: "",
                status: PlayerStatus.OFFLINE
            }
        }, {
            returnDocument: "after"
        });
        if (!player.value) {
            return;
        }
        const { username, status, social } = player.value;
        const socketIds = await getSocketIds(social.friends);
        ioServer.to(socketIds).emit("updateStatus", { username, status });
    });
};

const getPrivateKeyHash = (socket) => {
    socket.on("getPrivateKeyHash", async (params) => {
        const { username } = params;
        const player = await playersDb.findOne({ username });
        if (!player) {
            socket.emit("notification", "Player not found.");
            return;
        }
        const { privateKeyHash } = player;
        socket.emit("getPrivateKeyHash", { privateKeyHash });
    });
};

// this needs refactoring...
const signin = (socket) => {
    const socketId = socket.id;
    socket.on("signin", async (params) => {
        const { username, publicKey, signature } = params;
        let lobby, game;
        // const transaction = await blockchainService.transact("signin", {publicKey, signature});
        // if (!transaction) { return; }
        const $player = await playersDb.findOneAndUpdate({ username }, [{
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
        const player$ = await findPlayer(username);
        if (!$player.value || !player$) {
            return;
        }
        const { wallet, nonce } = player$;
        console.log(wallet);
        const { friends } = $player.value.social;
        const friendsView = [];
        for (const friendname of friends) {
            const [friend, chat] = await Promise.all([
                playersDb.findOne({
                    username: friendname
                }),
                chatsDb.findOne({
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
            lobby = await lobbiesDb.findOne({ lobbyId });
            if (!lobby) {
                return;
            }
        }
        else if (gameId) {
            game = await gamesDb.findOne({ gameId });
            if (!game) {
                return;
            }
            if ($player.value.username === game.playerA.username) {
                gameView = {
                    gameId: game.gameId,
                    currentPlayer: game.currentPlayer,
                    player: {
                        ...game.playerA,
                        // deck should be number so players can't cheat
                        // deck: game.playerA.deck.length
                        // but endTurn event needs refactor first
                    },
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
            player: { ...$player.value, wallet, nonce },
            friends: friendsView,
            lobby,
            game: gameView
        });
    });
};

const signup = (socket) => {
    socket.on("signup", async (params) => {
        const { username, publicKey, privateKeyHash } = params;
        const player = await playersDb.findOne({ username });
        if (player) {
            socket.emit("notification", "Username taken.");
            return;
        }
        const [transaction, insertPlayer] = await Promise.all([
            transact("signup", {
                username,
                public_key: publicKey
            }),
            playersDb.insertOne({
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
                games: {
                    casual: { won: 0, lost: 0 },
                    ranked: { won: 0, lost: 0, elo: 1000 }
                },
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

const auth = [disconnect, getPrivateKeyHash, signin, signup];

const destroyLobby = (socket) => {
    const socketId = socket.id;
    socket.on("destroyLobby", async () => {
        const player = await playersDb.findOne({ socketId });
        if (!player) {
            return;
        }
        const { username, lobbyId } = player;
        if (!lobbyId) {
            socket.emit("notification", "You are not in a lobby.");
            return;
        }
        const lobby = await lobbiesDb.findOne({ lobbyId });
        if (!lobby) {
            return;
        }
        if (username !== lobby.host.username) {
            socket.emit("notification", "You are not the lobby host.");
            return;
        }
        const [deleteLobby, updatePlayer] = await Promise.all([
            lobbiesDb.deleteOne({ lobbyId }),
            playersDb.updateOne({ socketId }, {
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
            const challengee = await playersDb.findOneAndUpdate({
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
        ioServer.to(lobby.challengee.socketId).emit("destroyLobby");
    });
};

const getLeaderboardsByLevel = (socket) => {
    socket.on("getLeaderboardsByLevel", async () => {
        const byLevel = (await playersDb
            .find()
            .limit(100)
            .sort({
            lv: -1
        })
            .toArray()).map(({ username, lv, avatarId }) => ({ username, lv, avatarId }));
        const byElo = (await playersDb
            .find()
            .limit(100)
            .sort({
            "games.ranked.elo": -1
        })
            .toArray()).map(({ username, games: { ranked: { elo } }, avatarId }) => ({ username, elo, avatarId }));
        const byDMT = (await eosApi.rpc.get_table_rows({
            code: "somgame11111",
            scope: "somgame11111",
            table: "players",
            limit: 100
        })).rows.sort((a, b) => {
            const aDmt = a.wallet.find((token) => token.includes("DMT"));
            const bDmt = b.wallet.find((token) => token.includes("DMT"));
            return parseInt(bDmt) - parseInt(aDmt);
        }).map((player) => {
            const { username } = player;
            const dmt = player.wallet.find((token) => token.includes("DMT"));
            return { username, dmt };
        });
        socket.emit("getLeaderboardsByLevel", { byLevel, byElo, byDMT });
    });
};

const buildDeck = (player) => {
    let deck = [];
    let gid = 1;
    player.decks[player.deckId].cards.forEach((deckCard) => {
        const card = cards.find((card) => card.id === deckCard.id);
        if (!card) {
            return;
        }
        const { id, klass, name, type, manaCost, effects, damage, health } = card;
        let builtCard;
        if (health && damage) {
            builtCard = {
                gid,
                id,
                klass,
                name,
                type,
                manaCost,
                effects,
                damage,
                health,
                maxHealth: health,
                canAttack: false,
                hasTriggeredEffect: false
            };
        }
        else {
            builtCard = { gid, id, klass, name, type, manaCost, effects };
        }
        deck.push(builtCard);
        deckCard.amount > 1 && deck.push(builtCard);
        gid += 1;
    });
    for (let i = deck.length - 1; i > 0; i -= 1) {
        const j = randomInt(0, i + 1);
        const temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    return deck;
};

const endGame = async (game, winner) => {
    const { gameId } = game;
    const $game = await gamesDb.findOne({ gameId });
    if (!$game) {
        return;
    }
    const { playerA, playerB } = $game;
    const [A, B] = await Promise.all([
        playersDb.findOneAndUpdate({
            username: playerA.username
        }, {
            $set: {
                gameId: 0,
                status: PlayerStatus.ONLINE
            },
            $inc: {
                xp: winner === "A" ? 110 + game.currentTurn : 90 + game.currentTurn,
                "games.ranked.elo": $game.type === "ranked" ? winner === "A" ? 20 : -20 : 0
            }
        }, {
            returnDocument: "after"
        }),
        playersDb.findOneAndUpdate({
            username: playerB.username
        }, {
            $set: {
                gameId: 0,
                status: PlayerStatus.ONLINE
            },
            $inc: {
                xp: winner === "B" ? 110 + game.currentTurn : 90 + game.currentTurn,
                "games.ranked.elo": $game.type === "ranked" ? winner === "B" ? 20 : -20 : 0
            }
        }, {
            returnDocument: "after"
        })
    ]);
    if (!A.value || !B.value) {
        return;
    }
    await checkLevelUp(A.value);
    await checkLevelUp(B.value);
    const isDeletedGame = await gamesDb.deleteOne({ gameId });
    if (!isDeletedGame.deletedCount) {
        return;
    }
    if (winner === "A") {
        ioServer.to(A.value.socketId).emit("notification", "You won!");
        ioServer.to(B.value.socketId).emit("notification", "You lost...");
    }
    else if (winner === "B") {
        ioServer.to(B.value.socketId).emit("notification", "You won!");
        ioServer.to(A.value.socketId).emit("notification", "You lost...");
    }
    ioServer.to([A.value.socketId, B.value.socketId]).emit("endGame");
};

const drawCard = async (game, player) => {
    const { hand, deck } = player;
    const card = deck.pop();
    if (!card) {
        return await endGame(game, "A");
    }
    hand.push(card);
};

const generateGame = (type, gameId, playerA, playerB) => {
    const playerAHand = [];
    const playerBHand = [];
    let playerADeck = buildDeck(playerA);
    let playerBDeck = buildDeck(playerB);
    playerAHand.push(...playerADeck.slice(-5));
    playerBHand.push(...playerBDeck.slice(-5));
    playerADeck = playerADeck.slice(0, -5);
    playerBDeck = playerBDeck.slice(0, -5);
    const playerASelectedDeck = playerA.decks.find(({ id }) => id === playerA.deckId);
    const playerBSelectedDeck = playerB.decks.find(({ id }) => id === playerB.deckId);
    if (!playerASelectedDeck || !playerBSelectedDeck) {
        return {};
    }
    const playerAHero = heroes.find(({ klass }) => klass === playerASelectedDeck.klass);
    const playerBHero = heroes.find(({ klass }) => klass === playerBSelectedDeck.klass);
    if (!playerAHero || !playerBHero) {
        return {};
    }
    return {
        gameId,
        type,
        currentPlayer: playerA.username,
        currentTurn: 0,
        playerA: {
            username: playerA.username,
            hero: { ...playerAHero, maxHealth: 100, maxMana: 20 },
            minion: { a: undefined, b: undefined, c: undefined, d: undefined },
            trap: undefined,
            hand: playerAHand,
            deck: playerADeck,
            graveyard: []
        },
        playerB: {
            username: playerB.username,
            hero: { ...playerBHero, maxHealth: 100, maxMana: 20 },
            minion: { a: undefined, b: undefined, c: undefined, d: undefined },
            trap: undefined,
            hand: playerBHand,
            deck: playerBDeck,
            graveyard: []
        },
    };
};

const generateGameFrontend = (game, username) => {
    const { gameId, currentPlayer, currentTurn, playerA, playerB } = game;
    return {
        gameId,
        currentPlayer,
        currentTurn,
        player: playerA.username === username ? {
            username: playerA.username,
            hero: playerA.hero,
            minion: playerA.minion,
            trap: playerA.trap,
            deck: playerA.deck,
            hand: playerA.hand,
            graveyard: playerA.graveyard
        } : {
            username: playerB.username,
            hero: playerB.hero,
            minion: playerB.minion,
            trap: playerB.trap,
            deck: playerB.deck,
            hand: playerB.hand,
            graveyard: playerB.graveyard
        },
        opponent: playerA.username === username ? {
            username: playerB.username,
            hero: playerB.hero,
            minion: playerB.minion,
            trap: playerB.trap,
            deck: playerB.deck.length,
            hand: playerB.hand.length,
            graveyard: playerB.graveyard
        } : {
            username: playerA.username,
            hero: playerA.hero,
            minion: playerA.minion,
            trap: playerA.trap,
            deck: playerA.deck.length,
            hand: playerA.hand.length,
            graveyard: playerA.graveyard
        }
    };
};

const getGame = async (socketId) => {
    const player = await playersDb.findOne({ socketId });
    if (!player) {
        return;
    }
    const { gameId } = player;
    const game = await gamesDb.findOne({ gameId });
    if (!game) {
        return;
    }
    return { player, game };
};

const getPlayers = (game, username) => {
    const { playerA, playerB } = game;
    const player = playerA.username === username ? playerA : playerB;
    const opponent = playerA.username === username ? playerB : playerA;
    return { player, opponent };
};

const isGameOver = async (game) => {
    if (game.playerA.hero.health <= 0) {
        await endGame(game, "B");
        return true;
    }
    else if (game.playerB.hero.health <= 0) {
        await endGame(game, "A");
        return true;
    }
    return false;
};

const saveGame = async (game) => {
    const { gameId, playerA, playerB } = game;
    const [$updateGame, $playerA, $playerB] = await Promise.all([
        gamesDb.replaceOne({ gameId }, game),
        playersDb.findOne({
            username: playerA.username
        }),
        playersDb.findOne({
            username: playerB.username
        })
    ]);
    if (!$updateGame.modifiedCount || !$playerA || !$playerB) {
        return;
    }
    ioServer.to($playerA.socketId).emit("reloadGameState", {
        game: generateGameFrontend(game, playerA.username)
    });
    ioServer.to($playerB.socketId).emit("reloadGameState", {
        game: generateGameFrontend(game, playerB.username)
    });
};

const startGame = async (type, playerA, playerB) => {
    const gameId = randomInt(0, 1000000);
    const [upd1, upd2] = await Promise.all([
        playersDb.findOneAndUpdate({
            username: playerA
        }, {
            $set: {
                status: PlayerStatus.INGAME,
                gameId
            }
        }),
        playersDb.findOneAndUpdate({
            username: playerB
        }, {
            $set: {
                status: PlayerStatus.INGAME,
                gameId
            }
        })
    ]);
    if (!upd1.value || !upd2.value) {
        return;
    }
    const game = generateGame(type, gameId, upd1.value, upd2.value);
    const isInserted = await gamesDb.insertOne(game);
    if (!isInserted.insertedId) {
        return;
    }
    ioServer.to(upd1.value.socketId).emit("startGame", {
        game: generateGameFrontend(game, upd1.value.username)
    });
    ioServer.to(upd2.value.socketId).emit("startGame", {
        game: generateGameFrontend(game, upd2.value.username)
    });
};

const charge = (minion) => {
    if (!minion.hasTriggeredEffect && minion.effects.includes(Effect.CHARGE)) {
        minion.canAttack = true;
        minion.hasTriggeredEffect = true;
    }
};

const multiStrike = (minion) => {
    if (minion.effects.includes(Effect.MULTI_STRIKE) && !minion.hasTriggeredEffect) {
        minion.canAttack = true;
        minion.hasTriggeredEffect = true;
    }
};

const necro = (minion) => {
    if (minion.effects.includes(Effect.NECRO) && !minion.hasTriggeredEffect) {
        minion.health -= 2;
        minion.damage -= 2;
        minion.hasTriggeredEffect = true;
    }
};

const quickShot = (minion, opponent) => {
    if (minion.effects.includes(Effect.QUICK_SHOT) && !minion.hasTriggeredEffect) {
        const possibleMinions = [];
        const minionKeys = Object.keys(opponent.minion);
        minionKeys.forEach((key) => {
            const minion = opponent.minion[key];
            if (!minion) {
                return;
            }
            possibleMinions.push(minion);
        });
        if (possibleMinions.length < 1) {
            return;
        }
        let randomMinion = 0;
        if (possibleMinions.length > 1) {
            randomMinion = randomInt(possibleMinions.length);
        }
        possibleMinions[randomMinion].health -= 2;
        minion.hasTriggeredEffect = true;
    }
};

const smite = (opponent, minion) => {
    if (opponent.trap && opponent.trap.effects.includes(Effect.SMITE)) ;
};

const spellweave = (minion, player) => {
    if (minion.effects.includes(Effect.SPELLWEAVE) && !minion.hasTriggeredEffect) {
        const bonus = player.graveyard.reduce((sum, card) => {
            if (card.type === CardType.MAGIC || card.type === CardType.TRAP) {
                return sum += 1;
            }
            return sum;
        }, 0);
        minion.damage += bonus;
        minion.hasTriggeredEffect = true;
    }
};

const triggerEffect = {
    charge,
    multiStrike,
    necro,
    quickShot,
    smite,
    spellweave
};

const gameEngine = {
    buildDeck,
    drawCard,
    endGame,
    generateGame,
    generateGameFrontend,
    getGame,
    getPlayers,
    isGameOver,
    saveGame,
    startGame,
    triggerEffect
};

const joinCasualQueue = (socket) => {
    const socketId = socket.id;
    socket.on("joinCasualQueue", async () => {
        const player = await playersDb.findOne({ socketId });
        if (!player) {
            return;
        }
        const { username, lv } = player;
        const casualQueuePlayers = await casualQueuePlayersDb.find().toArray();
        for (const opponent of casualQueuePlayers) {
            if (opponent.lv < lv - 100 || opponent.lv < lv + 100) {
                const deleteCasualQueuePlayer = await casualQueuePlayersDb.deleteOne({
                    username: opponent.username
                });
                if (!deleteCasualQueuePlayer.deletedCount) {
                    return;
                }
                await gameEngine.startGame("casual", opponent.username, username);
                return;
            }
        }
        const insertCasualQueuePlayer = await casualQueuePlayersDb.insertOne({ username, lv });
        const updatedPlayer = await playersDb.findOneAndUpdate({ socketId }, {
            $set: {
                status: PlayerStatus.IN_CASUAL_QUEUE
            }
        }, {
            returnDocument: "after"
        });
        if (!insertCasualQueuePlayer.insertedId || !updatedPlayer.value) {
            return;
        }
        socket.emit("joinCasualQueue");
    });
};

const joinLobby = (socket) => {
    const socketId = socket.id;
    socket.on("joinLobby", async (params) => {
        const { lobbyId } = params;
        const [player, lobby] = await Promise.all([
            playersDb.findOne({ socketId }),
            lobbiesDb.findOne({ lobbyId })
        ]);
        if (!player) {
            socket.emit("notification", "Player not found.");
            return;
        }
        if (!lobby) {
            socket.emit("notification", "Lobby not found.");
            return;
        }
        if (player.lobbyId) {
            socket.emit("notification", "You are already in a lobby.");
            return;
        }
        if (player.gameId) {
            socket.emit("notification", "You can't join a lobby while in game.");
            return;
        }
        if (lobby.challengee.username) {
            socket.emit("notification", "Lobby is full.");
            return;
        }
        if (!isDeckValid(player.decks[player.deckId])) {
            socket.emit("notification", "Invalid deck.");
            return;
        }
        const { username, avatarId } = player;
        const [modifiedLobby, updatedPlayer] = await Promise.all([
            lobbiesDb.findOneAndUpdate({ lobbyId }, {
                $set: {
                    challengee: { username, socketId, avatarId }
                }
            }, {
                returnDocument: "after"
            }),
            playersDb.updateOne({ socketId }, {
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
        const { challengee } = modifiedLobby.value;
        socket.emit("joinLobbySender", { lobby });
        ioServer
            .to(modifiedLobby.value.host.socketId)
            .emit("joinLobbyReceiver", { challengee });
    });
};

const joinRankedQueue = (socket) => {
    const socketId = socket.id;
    socket.on("joinRankedQueue", async () => {
        const player = await playersDb.findOne({ socketId });
        if (!player) {
            return;
        }
        const { username, games } = player;
        const { elo } = games.ranked;
        const rankedQueuePlayers = await rankedQueuePlayersDb.find().toArray();
        for (const opponent of rankedQueuePlayers) {
            if (opponent.elo < elo - 1000 || opponent.elo < elo + 1000) {
                const deleteRankedQueuePlayer = await rankedQueuePlayersDb.deleteOne({
                    username: opponent.username
                });
                if (!deleteRankedQueuePlayer.deletedCount) {
                    return;
                }
                await gameEngine.startGame("ranked", opponent.username, username);
                return;
            }
        }
        const insertRankedQueuePlayer = await rankedQueuePlayersDb
            .insertOne({ username, elo });
        const updatedPlayer = await playersDb.findOneAndUpdate({ socketId }, {
            $set: {
                status: PlayerStatus.IN_RANKED_QUEUE
            }
        }, {
            returnDocument: "after"
        });
        if (!insertRankedQueuePlayer.insertedId || !updatedPlayer.value) {
            return;
        }
        socket.emit("joinRankedQueue");
    });
};

const leaveCasualQueue = (socket) => {
    const socketId = socket.id;
    socket.on("leaveCasualQueue", async () => {
        const player = await playersDb.findOne({ socketId });
        if (!player) {
            return;
        }
        const { username } = player;
        const [deleteCasualQueuePlayer, updatePlayer] = await Promise.all([
            casualQueuePlayersDb.deleteOne({ username }),
            playersDb.updateOne({ username }, {
                $set: {
                    status: PlayerStatus.ONLINE
                }
            })
        ]);
        if (!deleteCasualQueuePlayer.deletedCount || !updatePlayer.modifiedCount) {
            return;
        }
        socket.emit("leaveCasualQueue");
    });
};

const leaveLobby = (socket) => {
    const socketId = socket.id;
    socket.on("leaveLobby", async () => {
        const $player = await playersDb.findOne({ socketId });
        if (!$player) {
            socket.emit("notification", "Player not found.");
            return;
        }
        if (!$player.lobbyId) {
            socket.emit("notification", "You are not in a lobby.");
            return;
        }
        const { lobbyId } = $player;
        const $lobby = await lobbiesDb.findOne({ lobbyId });
        if (!$lobby) {
            socket.emit("notification", "Lobby not found.");
            return;
        }
        const [$updateLobby, $updatePlayer] = await Promise.all([
            lobbiesDb.updateOne({ lobbyId }, {
                $set: {
                    challengee: {
                        username: "",
                        socketId: "",
                        avatarId: 0
                    }
                }
            }),
            playersDb.updateOne({ socketId }, {
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
        ioServer.to($lobby.host.socketId).emit("leaveLobbyReceiver");
    });
};

const leaveRankedQueue = (socket) => {
    socket.on("leaveRankedQueue", async () => {
        const socketId = socket.id;
        const player = await playersDb.findOne({ socketId });
        if (!player) {
            return;
        }
        const { username } = player;
        const [deleteRankedQueuePlayer, updatePlayer] = await Promise.all([
            rankedQueuePlayersDb.deleteOne({ username }),
            playersDb.updateOne({ username }, {
                $set: {
                    status: PlayerStatus.ONLINE
                }
            })
        ]);
        if (!deleteRankedQueuePlayer.deletedCount ||
            !updatePlayer.modifiedCount) {
            return;
        }
        socket.emit("leaveRankedQueue");
    });
};

const makeLobby = (socket) => {
    const socketId = socket.id;
    socket.on("makeLobby", async () => {
        const player = await playersDb.findOne({ socketId });
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
        if (!isDeckValid(player.decks[player.deckId])) {
            socket.emit("notification", "Invalid deck.");
            return;
        }
        const { username, avatarId } = player;
        const lobbyId = randomInt(1, 1000000);
        const [insertLobby, updatePlayer] = await Promise.all([
            lobbiesDb.insertOne({
                lobbyId,
                host: { username, socketId, avatarId },
                challengee: {
                    username: "",
                    socketId: "",
                    avatarId: 0
                }
            }),
            playersDb.updateOne({ socketId }, {
                $set: {
                    lobbyId,
                    status: PlayerStatus.INLOBBY
                }
            })
        ]);
        if (!insertLobby.insertedId || !updatePlayer.modifiedCount) {
            return;
        }
        const lobby = await lobbiesDb.findOne({ lobbyId });
        if (!lobby) {
            return;
        }
        socket.emit("makeLobby", { lobby });
    });
};

const saveDeck = (socket) => {
    const socketId = socket.id;
    socket.on("saveDeck", async (params) => {
        const { cards } = params;
        const player = await playersDb.findOne({ socketId });
        if (!player) {
            return;
        }
        const { deckId } = player;
        const $updatePlayer = await playersDb.updateOne({
            socketId,
            "decks.id": deckId
        }, {
            $set: {
                "decks.$.cards": cards
            }
        });
        if (!$updatePlayer.modifiedCount) {
            return;
        }
        socket.emit("saveDeck", { cards });
    });
};

const selectDeck = (socket) => {
    const socketId = socket.id;
    socket.on("selectDeck", async (params) => {
        const { deckId } = params;
        const $updatePlayer = await playersDb.updateOne({ socketId }, {
            $set: { deckId }
        });
        if (!$updatePlayer.modifiedCount) {
            return;
        }
        socket.emit("selectDeck", { deckId });
    });
};

const sendToken = (socket) => {
    socket.on("sendToken", async (params) => {
        console.log(params);
        const transaction = await transact("transfer", params);
        if (!transaction) {
            socket.emit("notification", "Error sending token.");
            return;
        }
    });
};

const setDeckKlass = (socket) => {
    const socketId = socket.id;
    socket.on("setDeckKlass", async (params) => {
        const { deckId, klass } = params;
        const $updatePlayer = await playersDb.updateOne({
            socketId,
            "decks.id": deckId
        }, {
            $set: {
                "decks.$.klass": klass
            }
        });
        if (!$updatePlayer.modifiedCount) {
            return;
        }
        socket.emit("setDeckKlass", { deckId, klass });
    });
};

const setDeckName = (socket) => {
    const socketId = socket;
    socket.on("setDeckName", async (params) => {
        const { id, name } = params;
        const $updatePlayer = await playersDb.updateOne({
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

const startCustomGame = (socket) => {
    socket.on("startGame", async (params) => {
        const { lobbyId } = params;
        const lobby = await lobbiesDb.findOne({ lobbyId });
        const deleteLobby = await lobbiesDb.deleteOne({ lobbyId });
        if (!lobby || !deleteLobby.deletedCount) {
            return;
        }
        const { host, challengee } = lobby;
        await gameEngine.startGame("custom", host.username, challengee.username);
    });
};

const client = [
    destroyLobby,
    getLeaderboardsByLevel,
    joinCasualQueue,
    joinLobby,
    joinRankedQueue,
    leaveCasualQueue,
    leaveLobby,
    leaveRankedQueue,
    makeLobby,
    saveDeck,
    selectDeck,
    sendToken,
    setDeckKlass,
    setDeckName,
    startCustomGame
];

const attackHero = (socket) => {
    const socketId = socket.id;
    const { triggerEffect } = gameEngine;
    socket.on("attackHero", async (params) => {
        const $player = await playersDb.findOne({ socketId });
        const { attacker } = params;
        if (!$player) {
            return;
        }
        const { username, gameId } = $player;
        const game = await gamesDb.findOne({ gameId });
        if (!game) {
            return;
        }
        if (game.currentPlayer !== username) {
            return;
        }
        const { player, opponent } = gameEngine.getPlayers(game, username);
        const playerMinion = player.minion[attacker];
        const opponentHero = opponent.hero;
        if (!playerMinion) {
            return;
        }
        if (!playerMinion.canAttack) {
            return;
        }
        playerMinion.canAttack = false;
        triggerEffect.multiStrike(playerMinion);
        if (opponent.trap && opponent.trap.effects.includes(Effect.MIRRORS_EDGE)) {
            player.hero.health -= playerMinion.damage;
            if (await gameEngine.isGameOver(game)) {
                return;
            }
            opponent.graveyard.push(opponent.trap);
            opponent.trap = undefined;
            return await gameEngine.saveGame(game);
        }
        opponentHero.health -= playerMinion.damage;
        if (await gameEngine.isGameOver(game)) {
            return;
        }
        await gameEngine.saveGame(game);
    });
};

const attackMinion = (socket) => {
    const socketId = socket.id;
    const { triggerEffect } = gameEngine;
    socket.on("attackMinion", async (params) => {
        const { attacked, attacker } = params;
        const $player = await playersDb.findOne({ socketId });
        if (!$player) {
            return;
        }
        const { username, gameId } = $player;
        const $game = await gamesDb.findOne({ gameId });
        if (!$game) {
            return;
        }
        if ($game.currentPlayer !== username) {
            return;
        }
        const { player, opponent } = gameEngine.getPlayers($game, username);
        const playerMinion = player.minion[attacker];
        const opponentMinion = opponent.minion[attacked];
        if (!playerMinion || !opponentMinion) {
            return;
        }
        if (!playerMinion.canAttack) {
            return;
        }
        playerMinion.canAttack = false;
        triggerEffect.multiStrike(playerMinion);
        if (opponent.trap && opponent.trap.effects.includes(Effect.MIRRORS_EDGE)) {
            player.hero.health -= playerMinion.damage;
            if (await gameEngine.isGameOver($game)) {
                return;
            }
            opponent.graveyard.push(opponent.trap);
            opponent.trap = undefined;
            return await gameEngine.saveGame($game);
        }
        playerMinion.health -= opponentMinion.damage;
        opponentMinion.health -= playerMinion.damage;
        if (playerMinion.health <= 0) {
            playerMinion.health = playerMinion.maxHealth;
            player.graveyard.push(playerMinion);
            player.minion[attacker] = undefined;
        }
        if (opponentMinion.health <= 0) {
            opponentMinion.health = opponentMinion.maxHealth;
            opponent.graveyard.push(opponentMinion);
            opponent.minion[attacked] = undefined;
        }
        await gameEngine.saveGame($game);
    });
};

const endTurn = (socket) => {
    const socketId = socket.id;
    socket.on("endTurn", async () => {
        const $player = await playersDb.findOne({ socketId });
        if (!$player) {
            return;
        }
        const { username, gameId } = $player;
        const $game = await gamesDb.findOne({ gameId });
        if (!$game) {
            return;
        }
        if ($game.currentPlayer !== username) {
            return;
        }
        const { opponent } = gameEngine.getPlayers($game, username);
        const { hero, minion } = opponent;
        await gameEngine.drawCard($game, opponent);
        hero.mana = 20;
        const minionKeys = Object.keys(minion);
        minionKeys.forEach((key) => {
            const Minion = minion[key];
            if (!Minion) {
                return;
            }
            Minion.canAttack = true;
            Minion.hasTriggeredEffect = false;
        });
        $game.currentPlayer = opponent.username;
        $game.currentTurn += 1;
        await gameEngine.saveGame($game);
    });
};

const hoverCard = (socket) => {
    const socketId = socket.id;
    socket.on("hoverCard", async (params) => {
        const $player = await playersDb.findOne({ socketId });
        if (!$player) {
            return;
        }
        const { username, gameId } = $player;
        const $game = await gamesDb.findOne({ gameId });
        if (!$game) {
            return;
        }
        if ($game.currentPlayer !== username) {
            return;
        }
        const { opponent } = gameEngine.getPlayers($game, username);
        const $opponent = await playersDb.findOne({
            username: opponent.username
        });
        if (!$opponent || !$opponent.socketId) {
            return;
        }
        ioServer.to($opponent.socketId).emit("hoverCard", params);
    });
};

const hoverHandCard = (socket) => {
    const socketId = socket.id;
    socket.on("hoverHandCard", async (params) => {
        const $player = await playersDb.findOne({ socketId });
        if (!$player) {
            return;
        }
        const { username, gameId } = $player;
        const $game = await gamesDb.findOne({ gameId });
        if (!$game) {
            return;
        }
        if ($game.currentPlayer !== username) {
            return;
        }
        const { opponent } = gameEngine.getPlayers($game, username);
        const $opponent = await playersDb.findOne({
            username: opponent.username
        });
        if (!$opponent || !$opponent.socketId) {
            return;
        }
        ioServer.to($opponent.socketId).emit("hoverHandCard", params);
    });
};

const playMagic = (socket) => {
    const socketId = socket.id;
    socket.on("playMagic", async (params) => {
        const { gid } = params;
        const $player = await playersDb.findOne({ socketId });
        if (!$player) {
            return;
        }
        const { username, gameId } = $player;
        const $game = await gamesDb.findOne({ gameId });
        if (!$game) {
            return;
        }
        if ($game.currentPlayer !== username) {
            return;
        }
        const { player } = gameEngine.getPlayers($game, username);
        const { hand, hero } = player;
        const handCard = hand.find((card) => card.gid === gid);
        if (!handCard) {
            return;
        }
        if (handCard.type !== CardType.MAGIC) {
            return;
        }
        if (handCard.manaCost > hero.mana) {
            return;
        }
        if (handCard.effects.includes(Effect.RELOAD)) {
            hero.mana -= handCard.manaCost;
            await gameEngine.drawCard($game, player);
            hand.splice(hand.indexOf(handCard), 1);
            player.graveyard.push(handCard);
        }
        await gameEngine.saveGame($game);
    });
};

const playMinion = (socket) => {
    const socketId = socket.id;
    const { triggerEffect } = gameEngine;
    socket.on("playMinion", async (params) => {
        const { field, gid } = params;
        const $player = await playersDb.findOne({ socketId });
        if (!$player) {
            return;
        }
        const { username, gameId } = $player;
        const game = await gamesDb.findOne({ gameId });
        if (!game) {
            return;
        }
        if (game.currentPlayer !== username) {
            return;
        }
        const { player, opponent } = gameEngine.getPlayers(game, username);
        const { hand, minion, hero, graveyard } = player;
        const handCard = hand.find((card) => card.gid === gid);
        if (!handCard) {
            return;
        }
        if (handCard.type !== CardType.MINION) {
            return;
        }
        if (minion[field]) {
            return;
        }
        if (handCard.manaCost > hero.mana) {
            return;
        }
        hero.mana -= handCard.manaCost;
        minion[field] = handCard;
        hand.splice(hand.indexOf(handCard), 1);
        const summonedMinion = minion[field];
        if (!summonedMinion) {
            return;
        }
        if (opponent.trap && opponent.trap.effects.includes(Effect.SMITE)) {
            summonedMinion.health = summonedMinion.maxHealth;
            graveyard.push(summonedMinion);
            minion[field] = undefined;
            opponent.graveyard.push(opponent.trap);
            opponent.trap = undefined;
        }
        triggerEffect.charge(summonedMinion);
        triggerEffect.quickShot(summonedMinion, opponent);
        triggerEffect.necro(summonedMinion);
        triggerEffect.spellweave(summonedMinion, player);
        await gameEngine.saveGame(game);
    });
};

const playTrap = (socket) => {
    const socketId = socket.id;
    socket.on("playTrap", async (params) => {
        const { gid } = params;
        const $player = await playersDb.findOne({ socketId });
        if (!$player) {
            return;
        }
        const { username, gameId } = $player;
        const $game = await gamesDb.findOne({ gameId });
        if (!$game) {
            return;
        }
        if ($game.currentPlayer !== username) {
            return;
        }
        const { player } = gameEngine.getPlayers($game, username);
        if (player.trap) {
            return;
        }
        const { hand, hero } = player;
        const handCard = hand.find((card) => card.gid === gid);
        if (!handCard) {
            return;
        }
        if (handCard.type !== CardType.TRAP) {
            return;
        }
        console.log("playtrap");
        if (handCard.manaCost > hero.mana) {
            return;
        }
        console.log(handCard);
        hero.mana -= handCard.manaCost;
        player.trap = handCard;
        hand.splice(hand.indexOf(handCard), 1);
        await gameEngine.saveGame($game);
    });
};

const unhoverCard = (socket) => {
    const socketId = socket.id;
    socket.on("unhoverCard", async () => {
        const $player = await playersDb.findOne({ socketId });
        if (!$player) {
            return;
        }
        const { username, gameId } = $player;
        const $game = await gamesDb.findOne({ gameId });
        if (!$game) {
            return;
        }
        if ($game.currentPlayer !== username) {
            return;
        }
        const { opponent } = gameEngine.getPlayers($game, username);
        const $opponent = await playersDb.findOne({
            username: opponent.username
        });
        if (!$opponent || !$opponent.socketId) {
            return;
        }
        ioServer.to($opponent.socketId).emit("unhoverCard");
    });
};

const unhoverHandCard = (socket) => {
    const socketId = socket.id;
    socket.on("unhoverHandCard", async () => {
        const $player = await playersDb.findOne({ socketId });
        if (!$player) {
            return;
        }
        const { username, gameId } = $player;
        const $game = await gamesDb.findOne({ gameId });
        if (!$game) {
            return;
        }
        if ($game.currentPlayer !== username) {
            return;
        }
        const { opponent } = gameEngine.getPlayers($game, username);
        const $opponent = await playersDb.findOne({
            username: opponent.username
        });
        if (!$opponent || !$opponent.socketId) {
            return;
        }
        ioServer.to($opponent.socketId).emit("unhoverHandCard");
    });
};

const game = [
    attackHero,
    attackMinion,
    endTurn,
    hoverCard,
    hoverHandCard,
    playMagic,
    playMinion,
    playTrap,
    unhoverCard,
    unhoverHandCard
];

const acceptFriend = (socket) => {
    const socketId = socket.id;
    socket.on("acceptFriend", async (params) => {
        const { username } = params;
        const $sender = await playersDb.findOneAndUpdate({ socketId }, {
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
        const receiver = await playersDb.findOneAndUpdate({ username }, {
            $push: {
                "social.friends": $sender.value.username
            }
        }, {
            returnDocument: "after"
        });
        if (!receiver.value) {
            return;
        }
        const insertChat = await chatsDb.insertOne({
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
        ioServer.to(receiver.value.socketId).emit("acceptFriendReceiver", {
            username: $sender.value.username,
            avatarId: $sender.value.avatarId,
            status: $sender.value.status
        });
    });
};

const addFriend = (socket) => {
    const socketId = socket.id;
    socket.on("addFriend", async (params) => {
        const { username } = params;
        const [sender, receiver] = await Promise.all([
            playersDb.findOne({ socketId }),
            playersDb.findOne({ username })
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
        const updatePlayer = await playersDb.updateOne({ username }, {
            $push: {
                "social.requests": sender.username
            }
        });
        if (!updatePlayer.modifiedCount) {
            return;
        }
        socket.emit("notification", "Friend request sent.");
        ioServer.to(receiver.socketId).emit("addFriend", {
            username: sender.username
        });
    });
};

const block = (socket) => {
    const socketId = socket.id;
    socket.on("block", async (params) => {
        const { username } = params;
        const [sender, receiver] = await Promise.all([
            playersDb.findOne({ socketId }),
            playersDb.findOne({ username })
        ]);
        if (!sender || !receiver) {
            return;
        }
        const [isUpdatedSender, isUpdatedReceiver, isDeletedChat] = await Promise.all([
            playersDb.updateOne({ socketId }, {
                $pull: {
                    "social.friends": username
                },
                $push: {
                    "social.blocked": username
                }
            }),
            playersDb.updateOne({ username }, {
                $pull: {
                    "social.friends": sender.username
                }
            }),
            chatsDb.deleteOne({
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
        ioServer.to(receiver.socketId).emit("blockReceiver", {
            username: sender.username
        });
    });
};

const declineFriend = (socket) => {
    const socketId = socket.id;
    socket.on("declineFriend", async (params) => {
        const { username } = params;
        const $updatedPlayer = await playersDb.updateOne({ socketId }, {
            $pull: {
                "social.requests": username
            }
        });
        if (!$updatedPlayer.modifiedCount) {
            return;
        }
        socket.emit("declineFriend", { username });
    });
};

const sendChatMsg = (socket) => {
    socket.on("sendChatMsg", async (params) => {
        const { sender, receiver, text, date } = params;
        const $updateChat = await chatsDb.updateOne({
            players: { $all: [sender, receiver] }
        }, {
            $push: {
                messages: { sender, text, date }
            }
        });
        if (!$updateChat.modifiedCount) {
            return;
        }
        socket.emit("sendChatMsgSender", { sender, receiver, text, date });
        const $receiver = await playersDb.findOne({
            username: receiver
        });
        if (!$receiver || !$receiver.socketId) {
            return;
        }
        ioServer.to($receiver.socketId).emit("sendChatMsgReceiver", { sender, text, date });
    });
};

const setAvatar = (socket) => {
    const socketId = socket.id;
    socket.on("setAvatar", async (params) => {
        const { avatarId } = params;
        const player = await playersDb.findOneAndUpdate({ socketId }, {
            $set: { avatarId }
        }, {
            returnDocument: "after"
        });
        if (!player.value) {
            return;
        }
        const { username, social: { friends } } = player.value;
        const socketIds = await getSocketIds(friends);
        socket.emit("setAvatarSender", { avatarId });
        ioServer.to(socketIds).emit("setAvatarReceiver", { username, avatarId });
    });
};

const signout = (socket) => { };

const unblock = (socket) => {
    const socketId = socket.id;
    socket.on("unblock", async (params) => {
        const { username } = params;
        const updatePlayer = await playersDb.updateOne({ socketId }, {
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

const unfriend = (socket) => {
    const socketId = socket.id;
    socket.on("unfriend", async (params) => {
        const { username } = params;
        const sender = await playersDb.findOneAndUpdate({ socketId }, {
            $pull: {
                "social.friends": username
            }
        }, {
            returnDocument: "after"
        });
        if (!sender.value) {
            return;
        }
        const receiver = await playersDb.findOneAndUpdate({ username }, [{
                $pull: {
                    "social.friends": sender.value.username
                }
            }], {
            returnDocument: "after"
        });
        if (!receiver.value) {
            return;
        }
        const deleteChat = await chatsDb.deleteOne({
            players: {
                $all: [username, sender.value.username]
            }
        });
        if (!deleteChat.deletedCount) {
            return;
        }
        socket.emit("unfriendSender", { username });
        ioServer.to(receiver.value.socketId).emit("unfriendReceiver", {
            username: sender.value.username
        });
    });
};

const updateStatus = (socket) => {
    const socketId = socket.id;
    socket.on("updateStatus", async () => {
        const $player = await playersDb.findOne({ socketId });
        if (!$player) {
            return;
        }
        const { username, status, social } = $player;
        const socketIds = await getSocketIds(social.friends);
        ioServer.to(socketIds).emit("updateStatus", { username, status });
    });
};

const sidenav = [
    acceptFriend,
    addFriend,
    block,
    declineFriend,
    sendChatMsg,
    setAvatar,
    signout,
    unblock,
    unfriend,
    updateStatus
];

const requests = [...auth, ...client, ...game, ...sidenav];

process.on("unhandledRejection", (reason, promise) => {
    console.log(`Unhandled rejection: ${reason}`);
});
process.on("uncaughtException", (error, origin) => {
    console.log(`Uncaught Exception: ${error}`);
});
ioServer.on("connection", (socket) => {
    requests.forEach((request) => request(socket));
});
httpServer.listen(settings.server.port);
//# sourceMappingURL=index.js.map
