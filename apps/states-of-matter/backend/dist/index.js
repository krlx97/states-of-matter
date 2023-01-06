import { createServer } from 'http';
import { Server } from 'socket.io';
import { PlayerStatus, CardType, EffectId } from '@som/shared/enums';
import { MongoClient } from 'mongodb';
import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig.js';
import fetch from 'node-fetch';
import { randomInt } from 'crypto';
import { cards } from '@som/shared/data';

const settings = {
    mongo: {
        uri: "mongodb://localhost:27017"
    },
    eos: {
        endpoint: "https://testnet.telos.net",
        contractAccount: "eternisvm131",
        contractKey: "5J9QDGDDjK7H4tUdChmfANqWGrXvKDRK1KXB5dXcjActcs5E9wD"
    },
    socket: {
        opts: {
            cors: {
                origin: "*"
            }
        }
    },
    server: {
        port: 4201
    }
};

const httpServer = createServer();
const ioServer = new Server(httpServer, {
    cors: {
        origin: "*"
    },
    serveClient: false,
    transports: ["websocket"],
    allowUpgrades: false
});

const { mongo: { uri } } = settings;
const mongoClient = await MongoClient.connect(uri);
const eternitasDb = mongoClient.db("eternitas");
const mongoDb = mongoClient.db("som");
const accountsDb = eternitasDb.collection("accounts");
const chatsDb = eternitasDb.collection("chats");
const casualQueuePlayersDb = mongoDb.collection("casualQueuePlayers");
const rankedQueuePlayersDb = mongoDb.collection("rankedQueuePlayers");
const gamesDb = mongoDb.collection("games");
const preGamesDb = mongoDb.collection("preGames");
const lobbiesDb = mongoDb.collection("lobbies");
const playersDb = mongoDb.collection("players");
({
    accounts: eternitasDb.collection("accounts")
});

const getXpRequired = (lv) => 1000 + (lv % 10) * 100;

const checkLevelUp = async (player) => {
    const { name, socketId } = player;
    const xpRequired = getXpRequired(player.lv);
    if (player.xp <= xpRequired) {
        return;
    }
    const xp = player.xp - xpRequired;
    await playersDb.updateOne({ name }, {
        $inc: {
            lv: 1
        },
        $set: { xp }
    });
    // await eosApi.transact({
    //   actions: [{
    //     account: "somgame11111",
    //     name: "flushtoken",
    //     authorization: [{
    //       actor: "somgame11111",
    //       permission: "active"
    //     }],
    //     data: {
    //       name, quantity: "1 DMTTEST"
    //     }
    //   }]
    // }, {
    //   blocksBehind: 3,
    //   expireSeconds: 30
    // })
    ioServer.to(socketId).emit("levelUp", { xp });
};

const generateFungible = (fungible) => {
    const symbols = ["TLOS", "VMT", "SPT"];
    const tokens = [];
    const getTotal = (token) => {
        const liquid = parseFloat(token.value.liquid);
        const staked = parseFloat(token.value.staked);
        const unstaking = parseFloat(token.value.unstaking);
        const total = liquid + staked + unstaking;
        return `${total} ${token.key.sym.slice(2)}`;
    };
    fungible.forEach((token) => {
        const { sym, contract } = token.key;
        const { liquid, staked, unstaking, claimable } = token.value;
        const symbol = sym.slice(2);
        const total = getTotal(token);
        tokens.push({ symbol, contract, total, liquid, staked, unstaking, claimable });
        symbols.splice(symbols.indexOf(symbol), 1);
    });
    symbols.forEach((symbol) => {
        tokens.push({
            symbol,
            contract: "",
            total: `0.0000 ${symbol}`,
            liquid: `0.0000 ${symbol}`,
            staked: `0.0000 ${symbol}`,
            unstaking: `0.0000 ${symbol}`,
            claimable: []
        });
    });
    return tokens.sort((a, b) => {
        if (a.symbol === "TLOS") {
            return -1;
        }
        else {
            return 1;
        }
    });
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
        .reduce((value, { amount }) => value += amount, 0);
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
        const { name, status } = player.value;
        const account = await accountsDb.findOne({ name });
        if (!account) {
            return;
        }
        const socketIds = await getSocketIds(account.socials.friends);
        ioServer.to(socketIds).emit("updateStatus", { username: name, status });
    });
};

const getPrivateKeyHash = (socket) => {
    socket.on("getPrivateKeyHash", async (params) => {
        const { name } = params;
        const account = await accountsDb.findOne({ name });
        if (!account) {
            socket.emit("notification", "Account not found.");
            return;
        }
        const { privateKeyHash } = account;
        socket.emit("getPrivateKeyHash", { privateKeyHash });
    });
};

const { eos: { endpoint, contractKey } } = settings;
const eosApi = new Api({
    rpc: new JsonRpc(endpoint, { fetch }),
    signatureProvider: new JsSignatureProvider([contractKey, "5JwPpzMAXT3PR1tZLMgXfNMVYdQ8EiwPsyseobU6VEY3Qp6djbE"]),
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder()
});
var Contract;
(function (Contract) {
    Contract["wallet"] = "eternisvm131";
    Contract["som"] = "eternisom141";
})(Contract || (Contract = {}));
class Leap {
    // async find () {
    //   let table!: GetTableRowsResult;
    //   try {
    //     table = await eosApi.rpc.get_table_rows({
    //       code: contractAccount,
    //       scope: contractAccount,
    //       table: "accounts",
    //       lower_bound: username,
    //       upper_bound: username,
    //       limit: 1
    //     });
    //   } catch (error) {
    //     console.error(error);
    //   }
    //   return table.rows[0];
    // }
    async transact(params) {
        const { contract, permission, action, data } = params;
        return await eosApi.transact({
            actions: [{
                    account: contract,
                    name: action,
                    authorization: [{
                            actor: contract,
                            permission
                        }],
                    data
                }]
        }, {
            blocksBehind: 3,
            expireSeconds: 30
        });
    }
}
const leap = new Leap();
const findNFT = async (serial) => {
    const nft = await eosApi.rpc.get_table_rows({
        code: "eterninft131",
        scope: "eterninft131",
        table: "items",
        lower_bound: serial,
        upper_bound: serial
    }).catch(console.log);
    if (!nft) {
        return;
    }
    const nfttags = await eosApi.rpc.get_table_rows({
        code: "eterninft131",
        scope: nft.rows[0].group,
        table: "sharedtags",
    }).catch(console.log);
    const nftattrs = await eosApi.rpc.get_table_rows({
        code: "eterninft131",
        scope: nft.rows[0].group,
        table: "sharedattrs",
    }).catch(console.log);
    if (!nfttags || !nftattrs) {
        return;
    }
    const tags = {};
    const attrs = [];
    nfttags.rows.forEach((row) => {
        tags[row.tag_name] = row.content;
    });
    nftattrs.rows.forEach((row) => attrs.push(row));
    return { serial, tags, attrs };
};
const findAccount = async (name) => {
    let table;
    try {
        table = await eosApi.rpc.get_table_rows({
            code: "eternisvm131",
            scope: "eternisvm131",
            table: "accounts",
            lower_bound: name,
            upper_bound: name,
            limit: 1
        });
    }
    catch (error) {
        console.error(error);
    }
    if (!table.rows.length) {
        return undefined;
    }
    return table.rows[0];
};
const findSOM = async (name) => {
    let table;
    try {
        table = await eosApi.rpc.get_table_rows({
            code: "eternisom141",
            scope: "eternisom141",
            table: "players",
            lower_bound: name,
            upper_bound: name,
            limit: 1
        });
    }
    catch (error) {
        console.error(error);
    }
    if (!table.rows.length) {
        return;
    }
    return table.rows[0];
};

const generateGameFrontend = (game, name) => {
    const { gameId, currentPlayer, currentTurn, battleLogs, selectedSkins, playerA, playerB } = game;
    return {
        gameId,
        currentPlayer,
        currentTurn,
        battleLogs,
        selectedSkins: {
            player: selectedSkins.playerA.name === name ? selectedSkins.playerA.list : selectedSkins.playerB.list,
            opponent: selectedSkins.playerA.name === name ? selectedSkins.playerB.list : selectedSkins.playerA.list
        },
        player: playerA.name === name ? {
            name: playerA.name,
            hero: playerA.hero,
            minion: playerA.minion,
            trap: playerA.trap,
            deck: playerA.deck,
            hand: playerA.hand,
            graveyard: playerA.graveyard
        } : {
            name: playerB.name,
            hero: playerB.hero,
            minion: playerB.minion,
            trap: playerB.trap,
            deck: playerB.deck,
            hand: playerB.hand,
            graveyard: playerB.graveyard
        },
        opponent: playerA.name === name ? {
            name: playerB.name,
            hero: playerB.hero,
            minion: playerB.minion,
            trap: playerB.trap ? true : false,
            deck: playerB.deck.length,
            hand: playerB.hand.length,
            graveyard: playerB.graveyard
        } : {
            name: playerA.name,
            hero: playerA.hero,
            minion: playerA.minion,
            trap: playerA.trap ? true : false,
            deck: playerA.deck.length,
            hand: playerA.hand.length,
            graveyard: playerA.graveyard
        }
    };
};

const signin = (socket) => {
    const socketId = socket.id;
    socket.on("signin", async (params) => {
        const { name } = params;
        let lobby, game;
        const $player = await playersDb.findOneAndUpdate({ name }, [{
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
        const playerChain = await findAccount(name);
        if (!$player.value || !playerChain) {
            return;
        }
        const acc = await accountsDb.findOne({ name });
        if (!acc) {
            return;
        }
        const { friends } = acc.social;
        const friendsView = [];
        for (const friendname of friends) {
            const [friend, chat] = await Promise.all([
                playersDb.findOne({
                    name: friendname
                }),
                chatsDb.findOne({
                    players: {
                        $all: [name, friendname]
                    }
                })
            ]);
            if (!friend || !chat) {
                return;
            }
            const { status } = friend;
            const { messages } = chat;
            friendsView.push({ username: friendname, status, avatarId: 1, messages });
        }
        const social = {
            friends: friendsView,
            requests: acc.social.requests,
            blocked: acc.social.blocked,
            chat: {
                username: "",
                avatarId: 0,
                status: 0,
                isOpen: false,
                messages: []
            }
        };
        const { lobbyId, gameId } = $player.value;
        let gameFrontend;
        if (lobbyId) {
            lobby = await lobbiesDb.findOne({ lobbyId });
            if (!lobby) {
                socket.emit("notification", "You are currently in a lobby that cannot be found. (Contact dev)");
                return;
            }
        }
        else if (gameId) {
            game = await gamesDb.findOne({ gameId });
            console.log(name);
            if (!game) {
                socket.emit("notification", "You are currently in a game that cannot be found. (Contact dev)");
                return;
            }
            gameFrontend = generateGameFrontend(game, name);
        }
        const nftss = [];
        for (const serial of playerChain.tokens.nonFungible.serials) {
            nftss.push(await findNFT(serial));
        }
        const table = await eosApi.rpc.get_table_rows({
            code: "eternisom141",
            scope: "eternisom141",
            table: "players",
            lower_bound: name,
            upper_bound: name,
            limit: 1
        });
        const accountFrontend = {
            profile: {
                name: playerChain.profile.name,
                publicKey: "",
                privateKey: "",
                privateKeyHash: acc.privateKeyHash,
                nonce: playerChain.profile.nonce,
                joinedAt: playerChain.profile.joinedAt,
                avatarId: playerChain.profile.avatarId,
                isActivated: playerChain.profile.isActivated ? true : false
            },
            social,
            wallet: {
                fungible: generateFungible(playerChain.tokens.fungible),
                nonFungible: nftss
            }
        };
        const playerFrontend = {
            name: $player.value.name,
            status: $player.value.status,
            xp: $player.value.xp,
            lv: $player.value.lv,
            deckId: $player.value.deckId,
            lobbyId: $player.value.lobbyId,
            gameId: $player.value.gameId,
            games: $player.value.games,
            decks: $player.value.decks,
            selectedSkins: table.rows[0].selectedSkins
        };
        socket.emit("signin", {
            accountFrontend,
            playerFrontend,
            lobbyFrontend: lobby,
            gameFrontend
        });
    });
};

const signup = (socket) => {
    socket.on("signup", async (params) => {
        const { name, publicKey, privateKeyHash } = params;
        const $account = await accountsDb.findOne({ name });
        if ($account) {
            socket.emit("notification", "Username taken.");
            return;
        }
        const promises = await Promise.all([
            leap.transact({
                contract: "eternisvm131",
                permission: "active",
                action: "signup",
                data: { name, publicKey }
            }),
            leap.transact({
                contract: "eternisom141",
                permission: "active",
                action: "signin",
                data: { name, signature: "SIG_K1_K3qcmTeUz4sGZjaKVEpHsniCoCmubWXUCUEYTpUkvV9XnoXpn2LA7v8PxsigK8U9oERcboFYQrwqcfseWpm5scuy9cKJyC" }
            }),
            accountsDb.insertOne({
                name,
                privateKeyHash,
                social: {
                    friends: [],
                    requests: [],
                    blocked: []
                }
            }),
            playersDb.insertOne({
                socketId: "",
                name,
                status: PlayerStatus.OFFLINE,
                xp: 0,
                lv: 1,
                deckId: 0,
                lobbyId: 0,
                gameId: 0,
                decks: [
                    { id: 0, klass: 1, name: "Deck 1", cards: [] },
                    { id: 1, klass: 2, name: "Deck 2", cards: [] },
                    { id: 2, klass: 3, name: "Deck 3", cards: [] },
                    { id: 3, klass: 4, name: "Deck 4", cards: [] }
                ],
                games: {
                    casual: { won: 0, lost: 0 },
                    ranked: { won: 0, lost: 0, elo: 1000 }
                }
            })
        ]);
        const [transaction, transaction2, insertAccount, insertPlayer] = promises;
        if (!transaction || !transaction2 || !insertAccount.insertedId || !insertPlayer.insertedId) {
            socket.emit("notification", "Error creating account.");
            return;
            // clear successfull inserts to avoid bugs.
        }
        socket.emit("notification", "Account created successfully.");
    });
};

const auth = [disconnect, getPrivateKeyHash, signin, signup];

var LogType;
(function (LogType) {
    LogType[LogType["ATTACK"] = 0] = "ATTACK";
    LogType[LogType["SUMMON"] = 1] = "SUMMON";
})(LogType || (LogType = {}));

const battleLog = (game, player, opponent, attacked, attacker, playerMinionId, opponentMinionId) => {
    const attackLog = {
        type: LogType.ATTACK,
        playerAtk: player.username,
        playerDef: opponent.username,
        with: playerMinionId,
        target: opponentMinionId,
        attacked,
        attacker
    };
    game.battleLogs.push(attackLog);
};

const buildDeck = (player) => {
    let deck = [];
    let gid = 1;
    player.decks[player.deckId].cards.forEach((deckCard) => {
        const card = cards.find((card) => card.id === deckCard.id);
        if (!card || card.type === CardType.HERO) {
            return;
        }
        const { id, klass, name, type, manaCost, effect } = card;
        let builtCard;
        if (card.type === CardType.MINION) {
            const { damage, health } = card;
            builtCard = {
                gid,
                id,
                klass,
                name,
                type,
                manaCost,
                effect,
                damage,
                health,
                maxHealth: health,
                canAttack: false,
                hasTriggeredEffect: false,
                buffs: [],
                debuffs: []
            };
        }
        else {
            builtCard = { gid, id, klass, name, type, manaCost, effect, buffs: [],
                debuffs: [] };
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
            name: playerA.name
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
            name: playerB.name
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

const floatingText = async (game, username, attacked, attacker, attackedDamage, attackerDamage) => {
    const { playerA, playerB } = game;
    const [$playerA, $playerB] = await Promise.all([
        playersDb.findOne({
            name: playerA.name
        }),
        playersDb.findOne({
            name: playerB.name
        })
    ]);
    if (!$playerA || !$playerB) {
        return;
    }
    if ($playerA.name === username) {
        ioServer.to($playerA.socketId).emit("floatingText", {
            attacked,
            attacker,
            attackedDamage,
            attackerDamage
        });
        ioServer.to($playerB.socketId).emit("floatingText", {
            attacked: attacker,
            attacker: attacked,
            attackedDamage: attackerDamage,
            attackerDamage: attackedDamage
        });
    }
    else {
        ioServer.to($playerA.socketId).emit("floatingText", {
            attacked: attacker,
            attacker: attacked,
            attackedDamage: attackerDamage,
            attackerDamage: attackedDamage
        });
        ioServer.to($playerB.socketId).emit("floatingText", {
            attacked,
            attacker,
            attackedDamage,
            attackerDamage
        });
    }
};

const generateGame = (type, gameId, playerA, playerB, playerASkins, playerBSkins) => {
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
    const playerAHero = cards.find(({ type, klass }) => klass === playerASelectedDeck.klass && type === CardType.HERO);
    const playerBHero = cards.find(({ type, klass }) => klass === playerBSelectedDeck.klass && type === CardType.HERO);
    if (!playerAHero || !playerBHero) {
        return {};
    }
    return {
        gameId,
        type,
        currentPlayer: playerA.name,
        currentTurn: 0,
        battleLogs: [],
        selectedSkins: {
            playerA: {
                name: playerA.name,
                list: playerASkins
            },
            playerB: {
                name: playerB.name,
                list: playerBSkins
            }
        },
        playerA: {
            name: playerA.name,
            hero: {
                ...playerAHero,
                maxHealth: 20,
                maxMana: 10,
            },
            minion: {
                a: undefined,
                b: undefined,
                c: undefined,
                d: undefined
            },
            trap: undefined,
            hand: playerAHand,
            deck: playerADeck,
            graveyard: [],
            selectedSkins: []
        },
        playerB: {
            name: playerB.name,
            hero: { ...playerBHero, maxHealth: 100, maxMana: 20 },
            minion: {
                a: undefined,
                b: undefined,
                c: undefined,
                d: undefined
            },
            trap: undefined,
            hand: playerBHand,
            deck: playerBDeck,
            graveyard: [],
            selectedSkins: []
        },
    };
};

const getGame = async (socketId) => {
    const $player = await playersDb.findOne({ socketId });
    if (!$player) {
        return;
    }
    const { name, gameId } = $player;
    const $game = await gamesDb.findOne({ gameId });
    if (!$game) {
        return;
    }
    const { playerA, playerB } = $game;
    const player = playerA.name === name ? playerA : playerB;
    const opponent = playerA.name === name ? playerB : playerA;
    return { $game, player, opponent };
};

const getPlayers = (game, name) => {
    const { playerA, playerB } = game;
    const player = playerA.name === name ? playerA : playerB;
    const opponent = playerA.name === name ? playerB : playerA;
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

const playMinion$1 = (player, gid, field) => {
    const { hand, minion, hero } = player;
    const handCard = hand.find((card) => card.gid === gid);
    if (!handCard) {
        return;
    } // hand card not found by gid
    if (handCard.type !== CardType.MINION) {
        return;
    } // hand card isn't minion
    if (minion[field]) {
        return;
    } // field already inhibits a minion
    if (handCard.manaCost > hero.mana) {
        return;
    } // hero doesn't have enough mana
    hero.mana -= handCard.manaCost;
    minion[field] = handCard;
    minion[field]?.buffs.push(minion[field]?.effect.id); // wtf? o.O
    hand.splice(hand.indexOf(handCard), 1);
    return minion[field];
};

const gamePopup = async (playerA, playerB) => {
    const [a, b] = await Promise.all([
        playersDb.findOne({ name: playerA }),
        playersDb.findOne({ name: playerB }),
    ]);
    if (!a || !b) {
        return;
    }
    const gameId = randomInt(0, 2_147_483_647);
    // const acceptTimeout = setTimeout(async () => {
    //   await preGamesDb.deleteOne({gameId});
    // }, 30_000);
    const preGame = {
        gameId,
        acceptTimeout: 0,
        playerA: { name: playerA, hasAccepted: false },
        playerB: { name: playerB, hasAccepted: false }
    };
    const inserted = await preGamesDb.insertOne(preGame);
    if (!inserted.insertedId) {
        return;
    }
    console.log("succ");
    ioServer.to(a.socketId).emit("gamePopup", { ...preGame });
    ioServer.to(b.socketId).emit("gamePopup", { ...preGame });
};

const saveGame = async (game) => {
    const { gameId, playerA, playerB } = game;
    const [$updateGame, $playerA, $playerB] = await Promise.all([
        gamesDb.replaceOne({ gameId }, game),
        playersDb.findOne({
            name: playerA.name
        }),
        playersDb.findOne({
            name: playerB.name
        })
    ]);
    if (!$updateGame.modifiedCount || !$playerA || !$playerB) {
        return;
    }
    ioServer.to($playerA.socketId).emit("reloadGameState", {
        game: generateGameFrontend(game, $playerA.name)
    });
    ioServer.to($playerB.socketId).emit("reloadGameState", {
        game: generateGameFrontend(game, $playerB.name)
    });
};

const startGame = async (type, playerA, playerB, gameId2 = 0) => {
    randomInt(0, 2_147_483_647);
    const [$playerA, $playerB, playerAChain, playerBChain] = await Promise.all([
        playersDb.findOneAndUpdate({
            name: playerA
        }, {
            $set: {
                status: PlayerStatus.INGAME,
                gameId: gameId2
            }
        }),
        playersDb.findOneAndUpdate({
            name: playerB
        }, {
            $set: {
                status: PlayerStatus.INGAME,
                gameId: gameId2
            }
        }),
        findSOM(playerA),
        findSOM(playerB)
    ]);
    if (!$playerA.value || !$playerB.value || !playerAChain || !playerBChain) {
        return;
    }
    const game = generateGame(type, gameId2, $playerA.value, $playerB.value, playerAChain.selectedSkins, playerBChain.selectedSkins);
    const isInserted = await gamesDb.insertOne(game);
    if (!isInserted.insertedId) {
        return;
    }
    ioServer.to($playerA.value.socketId).emit("startGame", {
        game: generateGameFrontend(game, $playerA.value.name)
    });
    ioServer.to($playerB.value.socketId).emit("startGame", {
        game: generateGameFrontend(game, $playerB.value.name)
    });
};

const charge = (minion) => {
    if (!minion.hasTriggeredEffect && minion.effect.id === EffectId.CHARGE) {
        minion.canAttack = true;
        minion.hasTriggeredEffect = true;
    }
};

const mirrorsEdge = (player, opponent, damage) => {
    if (opponent.trap && opponent.trap.effect.id === EffectId.MIRRORS_EDGE) {
        player.hero.health -= damage;
        opponent.graveyard.push(opponent.trap);
        opponent.trap = undefined;
        return true;
    }
    return false;
};

const multiStrike = (minion) => {
    if (minion.effect.id === EffectId.MULTI_STRIKE && !minion.hasTriggeredEffect) {
        minion.canAttack = true;
        minion.hasTriggeredEffect = true;
    }
};

const necro = (minion) => {
    if (minion.effect === EffectId.NECRO && !minion.hasTriggeredEffect) {
        minion.health -= 2;
        minion.damage -= 2;
        minion.hasTriggeredEffect = true;
    }
};

const quickShot = (minion, opponent) => {
    if (minion.effect === EffectId.QUICK_SHOT && !minion.hasTriggeredEffect) {
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

const smite = (player, opponent, minion, field) => {
    if (opponent.trap && opponent.trap.effect === EffectId.SMITE) {
        minion.health = minion.maxHealth;
        player.graveyard.push(minion);
        player.minion[field] = undefined;
        opponent.graveyard.push(opponent.trap);
        opponent.trap = undefined;
        return true;
    }
    return false;
};

const spellweave = (minion, player) => {
    if (minion.effect === EffectId.SPELLWEAVE && !minion.hasTriggeredEffect) {
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
    mirrorsEdge,
    multiStrike,
    necro,
    quickShot,
    smite,
    spellweave
};

const gameEngine = {
    battleLog,
    buildDeck,
    drawCard,
    endGame,
    floatingText,
    generateGame,
    generateGameFrontend,
    getGame,
    getPlayers,
    isGameOver,
    playMinion: playMinion$1,
    gamePopup,
    saveGame,
    startGame,
    triggerEffect
};

const acceptGame = (socket) => {
    const socketId = socket.id;
    socket.on("acceptGame", async (params) => {
        const { gameId } = params;
        const gamePopup = await preGamesDb.findOne({ gameId });
        if (!gamePopup) {
            socket.emit("notification", "Game popup not found.");
            return;
        }
        const [playerA, playerB, player] = await Promise.all([
            playersDb.findOne({ name: gamePopup.playerA.name }),
            playersDb.findOne({ name: gamePopup.playerB.name }),
            playersDb.findOne({ socketId })
        ]);
        if (!playerA || !playerB || !player) {
            socket.emit("notification", "Player not found.");
            return;
        }
        if (gamePopup.playerA.name === player.name) {
            if (gamePopup.playerB.hasAccepted) {
                await gameEngine.startGame("casual", gamePopup.playerA.name, gamePopup.playerB.name, gamePopup.gameId);
                // remove the game popup before starting the game
                return;
            }
            gamePopup.playerA.hasAccepted = true;
        }
        else if (gamePopup.playerB.name === player.name) {
            if (gamePopup.playerA.hasAccepted) {
                await gameEngine.startGame("casual", gamePopup.playerB.name, gamePopup.playerA.name, gamePopup.gameId);
                // remove the game popup before starting the game
                return;
            }
            gamePopup.playerB.hasAccepted = true;
        }
        const repl = await preGamesDb.replaceOne({ gameId: gamePopup.gameId }, gamePopup);
        if (!repl.modifiedCount) {
            socket.emit("notification", "Error replacing game popup.");
            return;
        }
        ioServer.to(playerA.socketId).emit("acceptGame");
        ioServer.to(playerB.socketId).emit("acceptGame");
    });
};

const deselectSkin = (socket) => {
    socket.on("deselectSkin", async (params) => {
        const { id, username, signature } = params;
        await leap.transact({
            contract: "eternisom141",
            action: "deselectskin",
            permission: "active",
            data: {
                cardId: id,
                name: username,
                signature
            }
        });
        socket.emit("deselectSkin", { id });
    });
};

const destroyLobby = (socket) => {
    const socketId = socket.id;
    socket.on("destroyLobby", async () => {
        const player = await playersDb.findOne({ socketId });
        if (!player) {
            return;
        }
        const { name, lobbyId } = player;
        if (!lobbyId) {
            socket.emit("notification", "You are not in a lobby.");
            return;
        }
        const lobby = await lobbiesDb.findOne({ lobbyId });
        if (!lobby) {
            return;
        }
        if (name !== lobby.host.name) {
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
        if (lobby.challengee.name) {
            const challengee = await playersDb.findOneAndUpdate({
                name: lobby.challengee.name
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
            .toArray()).map(({ name: username, lv, avatarId }) => ({ username, lv, avatarId: 1 }));
        const byElo = (await playersDb
            .find()
            .limit(100)
            .sort({
            "games.ranked.elo": -1
        })
            .toArray()).map(({ name: username, games: { ranked: { elo } }, avatarId }) => ({ username, elo, avatarId: 1 }));
        const byDMT = (await eosApi.rpc.get_table_rows({
            code: "eternisvm131",
            scope: "eternisvm131",
            table: "accounts",
            limit: 100
        })).rows.sort((a, b) => {
            // console.log(a);
            let aStake = a.tokens.fungible.find((token) => token.key.sym.includes("VMT"));
            let bStake = b.tokens.fungible.find((token) => token.key.sym.includes("VMT"));
            let aVal = "0.0000 VMT";
            let bVal = "0.0000 VMT";
            console.log(aStake);
            if (aStake) {
                aVal = aStake.value.staked;
            }
            if (bStake) {
                bVal = bStake.value.staked;
            }
            // if (!aVal) { aVal = "0.0000 VMT"; }
            // if (!bVal) { bVal = "0.0000 VMT"; }
            return parseInt(bVal) - parseInt(aVal);
        }).map((player) => {
            const { name } = player.profile;
            const dmt = player.tokens.fungible.find((token) => token.key.sym.includes("VMT"));
            let val = "0.0000 VMT";
            if (dmt) {
                val = dmt.value.staked;
            }
            return { username: name, dmt: val };
        });
        socket.emit("getLeaderboardsByLevel", { byLevel, byElo, byDMT });
    });
};

const joinCasualQueue = (socket) => {
    const socketId = socket.id;
    socket.on("joinCasualQueue", async () => {
        const player = await playersDb.findOne({ socketId });
        if (!player) {
            return;
        }
        const { name, lv } = player;
        const casualQueuePlayers = await casualQueuePlayersDb.find().toArray();
        for (const opponent of casualQueuePlayers) {
            if (opponent.lv < lv - 100 || opponent.lv < lv + 100) {
                const deleteCasualQueuePlayer = await casualQueuePlayersDb.deleteOne({
                    username: opponent.username
                });
                if (!deleteCasualQueuePlayer.deletedCount) {
                    return;
                }
                // await gameEngine.startGame("casual", opponent.username, name);
                await gameEngine.gamePopup(opponent.username, name);
                return;
            }
        }
        const insertCasualQueuePlayer = await casualQueuePlayersDb.insertOne({ username: name, lv });
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
        if (lobby.challengee.name) {
            socket.emit("notification", "Lobby is full.");
            return;
        }
        if (!isDeckValid(player.decks[player.deckId])) {
            socket.emit("notification", "Invalid deck.");
            return;
        }
        const { name, avatarId } = player;
        const [modifiedLobby, updatedPlayer] = await Promise.all([
            lobbiesDb.findOneAndUpdate({ lobbyId }, {
                $set: {
                    challengee: { name, socketId, avatarId }
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
        const { name, games } = player;
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
                await gameEngine.startGame("ranked", opponent.username, name);
                return;
            }
        }
        const insertRankedQueuePlayer = await rankedQueuePlayersDb
            .insertOne({ username: name, elo });
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
        const { name } = player;
        const [deleteCasualQueuePlayer, updatePlayer] = await Promise.all([
            casualQueuePlayersDb.deleteOne({ username: name }),
            playersDb.updateOne({ name }, {
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
                        name: "",
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
    const socketId = socket.id;
    socket.on("leaveRankedQueue", async () => {
        const player = await playersDb.findOne({ socketId });
        if (!player) {
            return;
        }
        const { name } = player;
        const [deleteRankedQueuePlayer, updatePlayer] = await Promise.all([
            rankedQueuePlayersDb.deleteOne({ username: name }),
            playersDb.updateOne({ name }, {
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
        const { name, avatarId } = player;
        const lobbyId = randomInt(1, 1000000);
        const [insertLobby, updatePlayer] = await Promise.all([
            lobbiesDb.insertOne({
                lobbyId,
                host: { name, socketId, avatarId },
                challengee: {
                    name: "",
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
            socket.emit("notification", "Error creating lobby.");
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

const selectSkin = (socket) => {
    socket.id;
    socket.on("selectSkin", async (params) => {
        const { serial, username, signature } = params;
        await leap.transact({
            contract: "eternisom141",
            action: "selectskin",
            permission: "active",
            data: {
                name: username,
                signature,
                serial
            }
        });
        socket.emit("selectSkin", { serial });
    });
};

const sendToken = (socket) => {
    socket.on("sendToken", async (params) => {
        const transaction = await leap.transact({
            contract: "eternisvm131",
            action: "transfer",
            permission: "active",
            data: params
        });
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
        await gameEngine.startGame("custom", host.name, challengee.name);
    });
};

const client = [
    acceptGame,
    deselectSkin,
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
    selectSkin,
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
        if (!$player) {
            return;
        }
        const { name, gameId } = $player;
        const game = await gamesDb.findOne({ gameId });
        if (!game) {
            return;
        }
        if (game.currentPlayer !== name) {
            return;
        }
        const { attacker } = params;
        const { player, opponent } = gameEngine.getPlayers(game, name);
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
        const isTriggered = triggerEffect.mirrorsEdge(player, opponent, playerMinion.damage);
        if (isTriggered) {
            if (await gameEngine.isGameOver(game)) {
                return;
            }
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
        const { name, gameId } = $player;
        const $game = await gamesDb.findOne({ gameId });
        if (!$game) {
            return;
        }
        if ($game.currentPlayer !== name) {
            return;
        }
        const { player, opponent } = gameEngine.getPlayers($game, name);
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
        if (opponent.trap && opponent.trap.effect.id === EffectId.MIRRORS_EDGE) {
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
        await gameEngine.floatingText($game, player.name, attacked, attacker, opponentMinion.damage, playerMinion.damage);
        gameEngine.battleLog($game, player, opponent, attacked, attacker, playerMinion.id, opponentMinion.id);
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
        const { name, gameId } = $player;
        const $game = await gamesDb.findOne({ gameId });
        if (!$game) {
            return;
        }
        if ($game.currentPlayer !== name) {
            return;
        }
        const { opponent } = gameEngine.getPlayers($game, name);
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
        $game.currentPlayer = opponent.name;
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
        const { name, gameId } = $player;
        const $game = await gamesDb.findOne({ gameId });
        if (!$game) {
            return;
        }
        if ($game.currentPlayer !== name) {
            return;
        }
        const { opponent } = gameEngine.getPlayers($game, name);
        const $opponent = await playersDb.findOne({
            name: opponent.name
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
        const { name, gameId } = $player;
        const $game = await gamesDb.findOne({ gameId });
        if (!$game) {
            return;
        }
        if ($game.currentPlayer !== name) {
            return;
        }
        const { opponent } = gameEngine.getPlayers($game, name);
        const $opponent = await playersDb.findOne({
            name: opponent.name
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
        const { name, gameId } = $player;
        const $game = await gamesDb.findOne({ gameId });
        if (!$game) {
            return;
        }
        if ($game.currentPlayer !== name) {
            return;
        }
        const { player } = gameEngine.getPlayers($game, name);
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
        if (handCard.effect.id === EffectId.RELOAD) {
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
        const data = await gameEngine.getGame(socketId);
        if (!data) {
            return;
        }
        const { $game, player, opponent } = data;
        if ($game.currentPlayer !== player.name) {
            return;
        }
        const summonedMinion = gameEngine.playMinion(player, gid, field);
        if (!summonedMinion) {
            return;
        }
        const isSmiteTriggered = triggerEffect.smite(player, opponent, summonedMinion, field);
        if (!isSmiteTriggered) {
            triggerEffect.charge(summonedMinion);
            triggerEffect.quickShot(summonedMinion, opponent);
            triggerEffect.necro(summonedMinion);
            triggerEffect.spellweave(summonedMinion, player);
        }
        const battleLog = {
            type: 1,
            field,
            player: player.name,
            minionKlass: summonedMinion.klass,
            minionId: summonedMinion.id
        };
        $game.battleLogs.push(battleLog);
        await gameEngine.saveGame($game);
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
        const { name, gameId } = $player;
        const $game = await gamesDb.findOne({ gameId });
        if (!$game) {
            return;
        }
        if ($game.currentPlayer !== name) {
            return;
        }
        const { player } = gameEngine.getPlayers($game, name);
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
        if (handCard.manaCost > hero.mana) {
            return;
        }
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
        const { name, gameId } = $player;
        const $game = await gamesDb.findOne({ gameId });
        if (!$game) {
            return;
        }
        if ($game.currentPlayer !== name) {
            return;
        }
        const { opponent } = gameEngine.getPlayers($game, name);
        const $opponent = await playersDb.findOne({
            name: opponent.name
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
        const { name, gameId } = $player;
        const $game = await gamesDb.findOne({ gameId });
        if (!$game) {
            return;
        }
        if ($game.currentPlayer !== name) {
            return;
        }
        const { opponent } = gameEngine.getPlayers($game, name);
        const $opponent = await playersDb.findOne({
            name: opponent.name
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
        const $player = await playersDb.findOne({ socketId });
        const $receiverP = await playersDb.findOne({ name: username });
        if (!$player || !$receiverP) {
            return;
        }
        const $sender = await accountsDb.findOneAndUpdate({ name: $player.name }, {
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
        const receiver = await accountsDb.findOneAndUpdate({ name: username }, {
            $push: {
                "social.friends": $sender.value.name
            }
        }, {
            returnDocument: "after"
        });
        if (!receiver.value) {
            return;
        }
        const insertChat = await chatsDb.insertOne({
            players: [$sender.value.name, receiver.value.name],
            messages: []
        });
        if (!insertChat.insertedId) {
            return;
        }
        socket.emit("acceptFriendSender", {
            username: receiver.value.name,
            avatarId: 1,
            status: 1
        });
        ioServer.to($receiverP.socketId).emit("acceptFriendReceiver", {
            username: $sender.value.name,
            avatarId: 1,
            status: $player.status // fetch from accountsDb
        });
    });
};

const addFriend = (socket) => {
    const socketId = socket.id;
    socket.on("addFriend", async (params) => {
        const { username } = params;
        const [senderP, receiverP] = await Promise.all([
            playersDb.findOne({ socketId }),
            playersDb.findOne({ name: username })
        ]);
        if (!senderP || !receiverP) {
            return;
        }
        const [sender, receiver] = await Promise.all([
            accountsDb.findOne({ name: senderP.name }),
            accountsDb.findOne({ name: receiverP.name })
        ]);
        if (!sender || !receiver) {
            return;
        }
        if (sender.name === username) {
            socket.emit("notification", "You can't add yourself as a friend.");
            return;
        }
        if (receiver.social.blocked.includes(sender.name)) {
            socket.emit("notification", "This player has blocked you.");
            return;
        }
        if (sender.social.blocked.includes(username)) {
            socket.emit("notification", "You have blocked this player.");
            return;
        }
        if (receiver.social.requests.includes(sender.name)) {
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
        const updatePlayer = await accountsDb.updateOne({ name: username }, {
            $push: {
                "social.requests": sender.name
            }
        });
        if (!updatePlayer.modifiedCount) {
            return;
        }
        socket.emit("notification", "Friend request sent.");
        ioServer.to(receiverP.socketId).emit("addFriend", {
            username: sender.name
        });
    });
};

const block = (socket) => {
    const socketId = socket.id;
    socket.on("block", async (params) => {
        console.log("init");
        const { username } = params;
        const [sender, receiver] = await Promise.all([
            playersDb.findOne({ socketId }),
            playersDb.findOne({ name: username })
        ]);
        if (!sender || !receiver) {
            return;
        }
        console.log("found them");
        const [isUpdatedSender, isUpdatedReceiver, isDeletedChat] = await Promise.all([
            accountsDb.updateOne({ name: sender.name }, {
                $pull: {
                    "social.friends": receiver.name
                },
                $push: {
                    "social.blocked": receiver.name
                }
            }),
            accountsDb.updateOne({ name: receiver.name }, {
                $pull: {
                    "social.friends": sender.name
                }
            }),
            chatsDb.deleteOne({
                players: {
                    $all: [receiver.name, sender.name]
                }
            })
        ]);
        console.log("tried to delet all.");
        if (!isUpdatedSender.modifiedCount ||
            !isUpdatedReceiver.modifiedCount ||
            !isDeletedChat.deletedCount) {
            return;
        }
        console.log("deleted all and updating ui");
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
        const $asd = await playersDb.findOne({ socketId });
        if (!$asd) {
            return;
        }
        const $updatedPlayer = await accountsDb.updateOne({ name: $asd.name }, {
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
            name: receiver
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
        const $asd = await playersDb.findOne({ socketId });
        if (!$asd) {
            return;
        }
        const player = await accountsDb.findOneAndUpdate({ name: $asd.name }, {
            $set: {
                "profile.avatarId": avatarId
            }
        }, {
            returnDocument: "after"
        });
        if (!player.value) {
            return;
        }
        const { name, social: { friends } } = player.value;
        const socketIds = await getSocketIds(friends);
        socket.emit("setAvatarSender", { avatarId });
        ioServer.to(socketIds).emit("setAvatarReceiver", { username: name, avatarId });
    });
};

const signout = (socket) => { };

const unblock = (socket) => {
    const socketId = socket.id;
    socket.on("unblock", async (params) => {
        const { username } = params;
        const $asd = await playersDb.findOne({ socketId });
        if (!$asd) {
            return;
        }
        const updatePlayer = await accountsDb.updateOne({ name: $asd.name }, {
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
        const asd = await playersDb.findOne({ socketId });
        if (!asd) {
            return;
        }
        const sender = await accountsDb.findOneAndUpdate({ name: asd.name }, {
            $pull: {
                "social.friends": username
            }
        }, {
            returnDocument: "after"
        });
        if (!sender.value) {
            return;
        }
        const receiver = await accountsDb.findOneAndUpdate({ name: username }, {
            $pull: {
                "social.friends": sender.value.name
            } // ??????
        }, {
            returnDocument: "after"
        });
        if (!receiver.value) {
            return;
        }
        const $receiverP = await playersDb.findOne({ name: username });
        if (!$receiverP)
            return;
        const deleteChat = await chatsDb.deleteOne({
            players: {
                $all: [username, sender.value.name]
            }
        });
        if (!deleteChat.deletedCount) {
            return;
        }
        socket.emit("unfriendSender", { username });
        ioServer.to($receiverP.socketId).emit("unfriendReceiver", {
            username: sender.value.name
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
        const $account = await accountsDb.findOne({ name: $player.name });
        if (!$account) {
            return;
        }
        const { status } = $player;
        const { name, social } = $account;
        const socketIds = await getSocketIds(social.friends);
        if (socketIds.length) {
            ioServer.to(socketIds).emit("updateStatus", { username: name, status });
        }
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

const airdrop = (socket) => {
    socket.on("airdrop", async (params) => {
        const transaction = await leap.transact({
            contract: "eternisvm131",
            action: "tokenairdrop",
            permission: "active",
            data: params
        });
        if (!transaction) {
            socket.emit("notification", "Error while signing airdrop action.");
            return;
        }
        socket.emit("airdrop");
    });
};

const mint = (socket) => {
    socket.on("mint", async (params) => {
        const rand = randomInt(1, 4);
        const transaction = await leap.transact({
            contract: "eternisvm131",
            action: "mint",
            permission: "active",
            data: {
                i: rand,
                ...params
            }
        });
        if (!transaction) {
            socket.emit("notification", "Error while signing mint action.");
            return;
        }
        const table = await eosApi.rpc.get_table_rows({
            code: "eterninft131",
            scope: "eterninft131",
            table: "config"
        });
        if (!table.rows.length) {
            socket.emit("notification", "NFT was minted, but there was an error updating your UI. Please relog.");
        }
        const nft = await findNFT(table.rows[0].last_serial);
        socket.emit("mint", { nft });
    });
};

const stake = (socket) => {
    socket.on("stake", async (params) => {
        const transaction = await leap.transact({
            contract: "eternisvm131",
            action: "stake",
            permission: "active",
            data: params
        });
        if (!transaction) {
            return;
        }
        socket.emit("stakeToken", {
            token: params.token
        });
    });
};

const transferToken = (socket) => {
    socket.on("transferToken", async (params) => {
        const transaction = await leap.transact({
            contract: "eternisvm131",
            action: "transfer",
            permission: "active",
            data: params
        });
        if (!transaction) {
            return;
        }
        const { from, to, quantity } = params;
        socket.emit("transferTokenSender", { to, quantity });
        const receiver = await playersDb.findOne({
            name: to
        });
        if (!receiver || !receiver.socketId) {
            return;
        }
        ioServer.to(receiver.socketId).emit("transferTokenReceiver", { from, quantity });
    });
};

const unstakeToken = (socket) => {
    socket.on("unstakeToken", async (params) => {
        const transaction = await leap.transact({
            contract: "eternisvm131",
            action: "unstake",
            permission: "active",
            data: params
        });
        if (!transaction) {
            return;
        }
        socket.emit("unstakeToken", {
            token: params.token
        });
    });
};

const wallet = [airdrop, mint, stake, transferToken, unstakeToken];

const requests = [...auth, ...client, ...game, ...sidenav, ...wallet];

process.on("unhandledRejection", (reason, promise) => {
    console.log(`Unhandled rejection: ${reason}`);
});
process.on("uncaughtException", (error, origin) => {
    console.log(`Uncaught Exception: ${error}`);
});
ioServer.on("connection", (socket) => {
    console.log("Connected");
    requests.forEach((request) => {
        request(socket);
    });
});
httpServer.listen(settings.server.port);
//# sourceMappingURL=index.js.map
