import { ethers, utils } from 'ethers';
import SomGame from '@som/contracts/SomGame/artifacts/SomGame.json' assert { type: 'json' };
import SomSkins from '@som/contracts/SomSkins/artifacts/SomSkins.json' assert { type: 'json' };
import { MongoClient } from 'mongodb';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { CardType, PlayerStatus, QueueId, EffectId, GameType, CardKlass, LogType } from '@som/shared/enums';
import { cards, cardsView, items } from '@som/shared/data';
import { compare, hash } from 'bcrypt';
import { randomInt } from 'crypto';

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
const signer = new ethers.Wallet("0x36558f992d19662cdea021407513e14f83f47917ba0a28fd879ff148afd0edd2", provider);
const gameKey = "0xA1584c8E3e572101D0D28A9ebb1784Af9f0fBCd4";
const skinsKey = "0x759F6751A243cc8EacC959bd10A910831A670720";
const game$1 = new ethers.Contract(gameKey, SomGame.abi, signer);
const skins = new ethers.Contract(skinsKey, SomSkins.abi, signer);
const contracts = { game: game$1, skins };

const mongoClient = await MongoClient.connect("mongodb://127.0.0.1:27017");
const eternitas = mongoClient.db("eternitas");
const som = mongoClient.db("som");
const mongo = {
    accounts: eternitas.collection("accounts"),
    chats: eternitas.collection("chats"),
    casualQueuePlayers: som.collection("casualQueuePlayers"),
    games: som.collection("games"),
    gamePopups: som.collection("gamePopups"),
    lobbies: som.collection("lobbies"),
    players: som.collection("players"),
    rankedQueuePlayers: som.collection("rankedQueuePlayers"),
    marketItems: som.collection("marketItems")
};

const http = createServer();
const io = new Server(http, {
    cors: {
        origin: "*"
    },
    serveClient: false,
    transports: ["websocket"],
    allowUpgrades: false
});
const server = { http, io };

const generatePlayerView = (player) => {
    const { name, experience, level, elo, joinedAt, status, queueId, deckId, lobbyId, gamePopupId, gameId, games, skins, tutorial } = player;
    const decks = player.decks.map((deck) => ({
        id: deck.id,
        klass: deck.klass,
        name: deck.name,
        cardsInDeck: deck.cards.reduce((acc, { amount }) => acc += amount, 0),
        cards: deck.cards.map((deckCard) => {
            const card = cards.find((card) => deckCard.id === card.id);
            if (!card || card.type === CardType.HERO) {
                console.log("Card not found, deck invalid, hero can't be in deck...?");
                // this should never happen though...
                return { id: 0, name: "", amount: 0, manaCost: 0 };
            }
            const cardView = cardsView.get(card.id);
            if (!cardView) {
                return { id: 0, name: "", amount: 0, manaCost: 0 };
            }
            const { id, amount } = deckCard;
            const { manaCost } = card;
            const { name } = cardView;
            return { id, name, amount, manaCost };
        })
    }));
    return {
        name,
        experience,
        level,
        elo,
        joinedAt,
        status,
        queueId,
        deckId,
        lobbyId,
        gameId,
        gamePopupId,
        games,
        decks,
        skins,
        tutorial
    };
};

const getSocketIds = async (players) => {
    return await mongo
        .players
        .find({ name: { $in: players } })
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

const disconnect = (socket, error) => {
    const socketId = socket.id;
    const { accounts, players } = mongo;
    socket.on("disconnect", async (reason) => {
        const $playerUpdate = await players.findOneAndUpdate({ socketId }, {
            $set: {
                socketId: "",
                status: PlayerStatus.OFFLINE
            }
        }, {
            returnDocument: "after"
        });
        if (!$playerUpdate.value) {
            return error("Error updating player.");
        }
        const { name, status } = $playerUpdate.value;
        const $account = await accounts.findOne({ name });
        if (!$account) {
            return error("Account not found.");
        }
        const socketIds = await getSocketIds($account.social.friends);
        server.io.to(socketIds).emit("updateStatus", { name, status });
    });
};

const generateGameView = (game, name) => {
    const { id, type, currentPlayer, currentTurn, gameLogs, playerA, playerB } = game;
    return {
        id,
        type,
        currentPlayer,
        currentTurn,
        gameLogs,
        player: playerA.name === name ? {
            name: playerA.name,
            hero: playerA.hero,
            minion: playerA.minion,
            trap: playerA.trap,
            deck: playerA.deck.length,
            hand: playerA.hand,
            graveyard: playerA.graveyard,
            skins: playerA.skins
        } : {
            name: playerB.name,
            hero: playerB.hero,
            minion: playerB.minion,
            trap: playerB.trap,
            deck: playerB.deck.length,
            hand: playerB.hand,
            graveyard: playerB.graveyard,
            skins: playerB.skins
        },
        opponent: playerA.name === name ? {
            name: playerB.name,
            hero: playerB.hero,
            minion: playerB.minion,
            trap: playerB.trap ? true : false,
            deck: playerB.deck.length,
            hand: playerB.hand.length,
            graveyard: playerB.graveyard,
            skins: playerB.skins
        } : {
            name: playerA.name,
            hero: playerA.hero,
            minion: playerA.minion,
            trap: playerA.trap ? true : false,
            deck: playerA.deck.length,
            hand: playerA.hand.length,
            graveyard: playerA.graveyard,
            skins: playerA.skins
        }
    };
};

const signin = (socket, error) => {
    const socketId = socket.id;
    const { accounts, chats, games, lobbies, players } = mongo;
    socket.on("signin", async (params) => {
        const { name, password } = params;
        let lobby, game;
        const acc = await accounts.findOne({ name });
        if (!acc) {
            return error(`Account ${name} not found.`);
        }
        const isCorrectPassword = await compare(password, acc.passwordHash);
        if (!isCorrectPassword) {
            return error("Invalid password.");
        }
        const $player = await players.findOneAndUpdate({ name }, [{
                $set: {
                    socketId,
                    status: {
                        $switch: {
                            branches: [{
                                    case: {
                                        $gt: ["$lobbyId", 0]
                                    },
                                    then: PlayerStatus.IN_LOBBY
                                }, {
                                    case: {
                                        $gt: ["$gameId", 0]
                                    },
                                    then: PlayerStatus.IN_GAME
                                }],
                            default: PlayerStatus.ONLINE
                        }
                    }
                }
            }], {
            returnDocument: "after"
        });
        if (!$player.value) {
            return error("Error updating player.");
        }
        const friendsView = [];
        for (const friendname of acc.social.friends) {
            const [friend, friendAcc, chat] = await Promise.all([
                players.findOne({
                    name: friendname
                }),
                accounts.findOne({
                    name: friendname
                }),
                chats.findOne({
                    players: {
                        $all: [$player.value.name, friendname]
                    }
                })
            ]);
            if (!friend || !friendAcc || !chat) {
                return;
            }
            const { status } = friend;
            const { messages } = chat;
            friendsView.push({ name: friendname, status, avatarId: friendAcc?.avatarId, messages });
        }
        const social = {
            friends: friendsView,
            requests: acc.social.requests,
            blocked: acc.social.blocked,
            chat: {
                name: "",
                status: 0,
                avatarId: 0,
                messages: [],
                isOpen: false
            }
        };
        const { lobbyId, gameId } = $player.value;
        let gameFrontend;
        if (lobbyId) {
            lobby = await lobbies.findOne({ id: lobbyId });
            if (!lobby) {
                return error("You are currently in a lobby that cannot be found. (Contact dev)");
            }
        }
        else if (gameId) {
            game = await games.findOne({ id: gameId });
            if (!game) {
                return error("You are currently in a game that cannot be found. (Contact dev)");
            }
            gameFrontend = generateGameView(game, $player.value.name);
        }
        const accountFrontend = {
            name,
            publicKey: acc.publicKey,
            avatarId: acc.avatarId,
            bannerId: acc.bannerId,
            social
        };
        const playerFrontend = generatePlayerView($player.value);
        socket.emit("signin", {
            accountFrontend,
            playerFrontend,
            lobbyFrontend: lobby,
            gameFrontend
        });
    });
};

const signup = (socket, error) => {
    const { accounts, players } = mongo;
    socket.on("signup", async (params) => {
        const { name, password } = params;
        if (name.length > 16) {
            return error("Maximum 16 characters.");
        }
        const $account = await accounts.findOne({ name });
        if ($account) {
            return error("Name taken.");
        }
        const passwordHash = await hash(password, 12);
        const [insertAccount, insertPlayer] = await Promise.all([
            accounts.insertOne({
                name,
                passwordHash,
                publicKey: "",
                avatarId: 0,
                bannerId: 0,
                social: {
                    friends: [],
                    requests: [],
                    blocked: []
                }
            }),
            players.insertOne({
                socketId: "",
                name,
                experience: 0,
                level: 1,
                elo: 500,
                joinedAt: Date.now(),
                status: PlayerStatus.OFFLINE,
                queueId: QueueId.NONE,
                deckId: 0,
                lobbyId: 0,
                gameId: 0,
                gamePopupId: 0,
                games: {
                    casual: { won: 0, lost: 0 },
                    ranked: { won: 0, lost: 0 }
                },
                decks: [
                    { id: 0, klass: 1, name: "Deck 1", cards: [] },
                    { id: 1, klass: 2, name: "Deck 2", cards: [] },
                    { id: 2, klass: 3, name: "Deck 3", cards: [] },
                    { id: 3, klass: 4, name: "Deck 4", cards: [] }
                ],
                skins: cards.map((card) => ({ cardId: card.id, skinId: 0 })),
                tutorial: {
                    deckBuilder: false,
                    game: false,
                    play: false,
                    wallet: false
                }
            })
        ]);
        if (!insertAccount.insertedId) {
            if (insertPlayer.insertedId) {
                await mongo.players.deleteOne({
                    _id: insertPlayer.insertedId
                });
            }
            return error("Error creating account, please try again.");
        }
        if (!insertPlayer.insertedId) {
            if (insertAccount.insertedId) {
                await mongo.accounts.deleteOne({
                    _id: insertAccount.insertedId
                });
            }
            return error("Error creating player, please try again.");
        }
        socket.emit("notification", "Account created successfully.");
    });
};

const auth = [disconnect, signin, signup];

const animateMagicTrigger = async (game, username, card) => {
    const { players } = mongo;
    const { io } = server;
    const { playerA, playerB } = game;
    const [$playerA, $playerB] = await Promise.all([
        players.findOne({
            name: playerA.name
        }),
        players.findOne({
            name: playerB.name
        })
    ]);
    if (!$playerA || !$playerB) {
        console.error("Animate magic trigger failed fetching players.");
        return;
    }
    if ($playerA.name === username) {
        io.to($playerA.socketId).emit("animateMagicTrigger", {
            username, card
        });
        io.to($playerB.socketId).emit("animateMagicTrigger", {
            username, card
        });
    }
    else {
        io.to($playerA.socketId).emit("animateMagicTrigger", {
            username, card
        });
        io.to($playerB.socketId).emit("animateMagicTrigger", {
            username, card
        });
    }
};

const animateTrapTrigger = async (game, username, card) => {
    const { players } = mongo;
    const { io } = server;
    const { playerA, playerB } = game;
    const [$playerA, $playerB] = await Promise.all([
        players.findOne({
            name: playerA.name
        }),
        players.findOne({
            name: playerB.name
        })
    ]);
    if (!$playerA || !$playerB) {
        console.error("Animate trap trigger failed fetching players.");
        return;
    }
    if ($playerA.name === username) {
        io.to($playerA.socketId).emit("animateTrapTrigger", {
            username, card
        });
        io.to($playerB.socketId).emit("animateTrapTrigger", {
            username, card
        });
    }
    else {
        io.to($playerA.socketId).emit("animateTrapTrigger", {
            username, card
        });
        io.to($playerB.socketId).emit("animateTrapTrigger", {
            username, card
        });
    }
};

const attackMinionSave = async ($game, username, attacker, attacked, attackerDamage, attackedDamage) => {
    const { players, games } = mongo;
    const { io } = server;
    const { playerA, playerB } = $game;
    const [$playerA, $playerB] = await Promise.all([
        players.findOne({
            name: playerA.name
        }),
        players.findOne({
            name: playerB.name
        })
    ]);
    if (!$playerA || !$playerB) {
        return;
    }
    io.to($playerA.socketId).emit("attackMinionSave", {
        game: generateGameView($game, $playerA.name),
        username,
        attacker,
        attacked,
        attackedDamage,
        attackerDamage
    });
    io.to($playerB.socketId).emit("attackMinionSave", {
        game: generateGameView($game, $playerB.name),
        username,
        attacker,
        attacked,
        attackedDamage,
        attackerDamage
    });
    // if ($playerA.name === username) {
    //   io.to($playerA.socketId).emit("attackMinionSave" as any, {
    //     game: generateGameView($game, $playerA.name),
    //     username,
    //     playerField: attacker,
    //     opponentField: attacked,
    //     playerDamageTaken: attackedDamage,
    //     opponentDamageTaken: attackerDamage
    //   });
    //   io.to($playerB.socketId).emit("attackMinionSave" as any, {
    //     game: generateGameView($game, $playerB.name),
    //     username,
    //     playerField: attacked,
    //     opponentField: attacker,
    //     playerDamageTaken: attackerDamage,
    //     opponentDamageTaken: attackedDamage
    //   });
    // }
    // else {
    //   io.to($playerA.socketId).emit("attackMinionSave" as any, {
    //     game: generateGameView($game, $playerA.name),
    //     username,
    //     playerField: attacked,
    //     opponentField: attacker,
    //     playerDamageTaken: attackerDamage,
    //     opponentDamageTaken: attackedDamage
    //   });
    //   io.to($playerB.socketId).emit("attackMinionSave" as any, {
    //     game: generateGameView($game, $playerB.name),
    //     username,
    //     playerField: attacker,
    //     opponentField: attacked,
    //     playerDamageTaken: attackedDamage,
    //     opponentDamageTaken: attackerDamage
    //   });
    // }
    await games.replaceOne({ id: $game.id }, $game);
};

const buildDeck = (deck) => {
    let gameDeck = [];
    let gid = 1;
    deck.cards.forEach((deckCard) => {
        const card = cards.find((card) => card.id === deckCard.id);
        if (!card) {
            console.error("One of the cards in the deck is invalid.");
            return;
        }
        if (card.type === CardType.HERO) {
            console.error("Hero cannot be a deck card.");
            return;
        }
        const { id, klass, effect, manaCost } = card;
        let gameCard;
        if (card.type === CardType.MINION) {
            const { type, health, damage } = card;
            gameCard = {
                id,
                gid,
                klass,
                effect,
                type,
                health,
                damage,
                manaCost,
                maxHealth: health,
                canAttack: false,
                buffs: [],
                debuffs: []
            };
        }
        else {
            const { type } = card;
            gameCard = { id, gid, klass, effect, type, manaCost };
        }
        gameDeck.push(gameCard);
        gid += 1;
        if (deckCard.amount > 1) {
            gameDeck.push({ ...gameCard, gid });
            gid += 1;
        }
    });
    for (let i = gameDeck.length - 1; i > 0; i -= 1) {
        const j = randomInt(0, i + 1);
        const temp = gameDeck[i];
        gameDeck[i] = gameDeck[j];
        gameDeck[j] = temp;
    }
    return gameDeck;
};

const heartOfSteel = (params) => {
    params.minion.damage += 3;
    params.player.graveyard.push(params.trap);
    params.player.trap = undefined;
    return [true, ""];
};

/**
* MODIFY THIS FUNCTION SO THAT IT CHECKS WHETHER HP IS <0, CALLS ALL ONDEATH EFFECTS
* AND MOVES THE CARD TO GRAVEYARD.
*/
const deductHealth = (attacker, attacked, attackerMinion, attackedMinion) => {
    const shieldBuff = attackerMinion.buffs.find((buff) => buff.id === EffectId.SHIELD);
    if (shieldBuff) { // has shield
        const amt = shieldBuff.data.amount;
        if (amt > attackedMinion.damage) { // shield reduced
            shieldBuff.data.amount -= attackedMinion.damage;
        }
        else if (amt <= attackedMinion.damage) { // shield broken
            if (attacker.trap && attacker.trap.effect === EffectId.HEART_OF_STEEL) {
                heartOfSteel({ minion: attackerMinion, player: attacker, trap: attacker.trap });
            }
            const remaining = shieldBuff.data.amount - attackedMinion.damage;
            if (remaining < 0) {
                if (attackedMinion.buffs.find((buff) => buff.id === EffectId.LEECH)) {
                    gameEngine.triggerEffect.leech({ player: attacked, minion: attackedMinion });
                }
                if (attackerMinion.buffs.find((buff) => buff.id === EffectId.RESILIENT)) {
                    attackerMinion.health -= 1;
                }
                else {
                    attackerMinion.health -= remaining;
                }
            }
            const index = attackerMinion.buffs.indexOf(shieldBuff);
            attackerMinion.buffs.splice(index, 1);
        }
    }
    else { // no shield
        if (attackedMinion.buffs.find((buff) => buff.id === EffectId.LEECH)) {
            gameEngine.triggerEffect.leech({ player: attacked, minion: attackedMinion });
        }
        if (attackerMinion.buffs.find((buff) => buff.id === EffectId.RESILIENT)) {
            attackerMinion.health -= 1;
        }
        else {
            attackerMinion.health -= attackedMinion.damage;
        }
    }
    if (attackerMinion.health <= 0) {
        attackerMinion.buffs.find((buff) => buff.id === EffectId.ACIDIC_DEATH);
        attackerMinion.debuffs.find((debuff) => debuff.id === EffectId.SELF_DESTRUCT);
    }
};

const endGame = async (gameId, winnerName) => {
    const { games, players } = mongo;
    const { io } = server;
    const $game = await games.findOne({ id: gameId });
    if (!$game) {
        return;
    }
    const { playerA, playerB } = $game;
    if (winnerName === playerA.name) {
        const $playerA = await players.findOne({
            name: playerA.name
        });
        const $playerB = await players.findOne({
            name: playerB.name
        });
        if (!$playerA || !$playerB) {
            return;
        }
        $playerA.status = PlayerStatus.ONLINE;
        $playerA.gameId = 0;
        $playerB.status = PlayerStatus.ONLINE;
        $playerB.gameId = 0;
        if ($game.type === GameType.CASUAL || $game.type === GameType.RANKED) {
            $playerA.experience += 110 + $game.currentTurn;
            const aReq = 1000 + ($playerA.level % 10) * 100;
            if ($playerA.experience >= aReq) {
                const rem = $playerA.experience - aReq;
                $playerA.level += 1;
                $playerA.experience = rem;
                // call levelup on chain, and save returned values, emit with gameEnded
            }
            $playerB.experience += 90 + $game.currentTurn;
            const bReq = 1000 + ($playerB.level % 10) * 100;
            if ($playerB.experience >= bReq) {
                const rem = $playerB.experience - bReq;
                $playerB.level += 1;
                $playerB.experience = rem;
                // call levelup on chain, and save returned values, emit with gameEnded
            }
        }
        if ($game.type === GameType.CASUAL) {
            $playerA.games.casual.won += 1;
            $playerB.games.casual.lost += 1;
        }
        if ($game.type === GameType.RANKED) {
            $playerA.games.ranked.won += 1;
            $playerB.games.ranked.lost += 1;
            $playerA.elo += 20;
            $playerB.elo -= 20;
        }
        await players.replaceOne({
            name: playerA.name
        }, $playerA);
        await players.replaceOne({
            name: playerB.name
        }, $playerB);
        io.to($playerA.socketId).emit("gameEnded", {
            isWinner: true,
            gameType: $game.type,
            experience: 110 + $game.currentTurn,
            elo: $game.type === GameType.RANKED ? 20 : 0
        });
        io.to($playerB.socketId).emit("gameEnded", {
            isWinner: false,
            gameType: $game.type,
            experience: 90 + $game.currentTurn,
            elo: $game.type === GameType.RANKED ? -20 : 0
        });
    }
    else if (winnerName === playerB.name) {
        const $playerB = await players.findOne({
            name: playerB.name
        });
        const $playerA = await players.findOne({
            name: playerA.name
        });
        if (!$playerB || !$playerA) {
            return;
        }
        $playerB.status = PlayerStatus.ONLINE;
        $playerB.gameId = 0;
        $playerA.status = PlayerStatus.ONLINE;
        $playerA.gameId = 0;
        if ($game.type === GameType.CASUAL || $game.type === GameType.RANKED) {
            $playerB.experience += 110 + $game.currentTurn;
            const bReq = 1000 + ($playerB.level % 10) * 100;
            if ($playerB.experience >= bReq) {
                const rem = $playerB.experience - bReq;
                $playerB.level += 1;
                $playerB.experience = rem;
                // call levelup on chain, and save returned values, emit with gameEnded
            }
            $playerA.experience += 90 + $game.currentTurn;
            const aReq = 1000 + ($playerA.level % 10) * 100;
            if ($playerA.experience >= aReq) {
                const rem = $playerA.experience - aReq;
                $playerA.level += 1;
                $playerA.experience = rem;
                // call levelup on chain, and save returned values, emit with gameEnded
            }
        }
        if ($game.type === GameType.CASUAL) {
            $playerB.games.casual.won += 1;
            $playerA.games.casual.lost += 1;
        }
        if ($game.type === GameType.RANKED) {
            $playerB.games.ranked.won += 1;
            $playerA.games.ranked.lost += 1;
            $playerB.elo += 20;
            $playerA.elo -= 20;
        }
        await players.replaceOne({
            name: playerB.name
        }, $playerB);
        await players.replaceOne({
            name: playerA.name
        }, $playerA);
        io.to($playerB.socketId).emit("gameEnded", {
            isWinner: true,
            gameType: $game.type,
            experience: 110 + $game.currentTurn,
            elo: $game.type === GameType.RANKED ? 20 : 0
        });
        io.to($playerA.socketId).emit("gameEnded", {
            isWinner: false,
            gameType: $game.type,
            experience: 90 + $game.currentTurn,
            elo: $game.type === GameType.RANKED ? -20 : 0
        });
    }
    const isDeletedGame = await games.deleteOne({ id: gameId });
    if (!isDeletedGame.deletedCount) {
        return;
    }
};

const drawCard = async (game, player, opponent) => {
    const card = opponent.deck.pop();
    if (!card) {
        return await endGame(game.id, player.name);
    }
    opponent.hand.push(card);
};

const generateGame = (id, type, playerA, playerB) => {
    const playerASelectedDeck = playerA.decks.find(({ id }) => id === playerA.deckId);
    const playerBSelectedDeck = playerB.decks.find(({ id }) => id === playerB.deckId);
    if (!playerASelectedDeck || !playerBSelectedDeck) {
        return {};
    }
    const playerAHand = [];
    const playerBHand = [];
    let playerADeck = buildDeck(playerASelectedDeck);
    let playerBDeck = buildDeck(playerBSelectedDeck);
    if (playerADeck.length !== 30 || playerBDeck.length !== 30) {
        return {};
    }
    playerAHand.push(...playerADeck.slice(-5));
    playerADeck = playerADeck.slice(0, -5);
    playerBHand.push(...playerBDeck.slice(-5));
    playerBDeck = playerBDeck.slice(0, -5);
    const playerAHero = cards.find(({ type, klass }) => klass === playerASelectedDeck.klass && type === CardType.HERO);
    const playerBHero = cards.find(({ type, klass }) => klass === playerBSelectedDeck.klass && type === CardType.HERO);
    if (!playerAHero || !playerBHero) {
        return {};
    }
    return {
        id,
        type,
        currentPlayer: playerA.name,
        currentTurn: 0,
        gameLogs: [],
        playerA: {
            name: playerA.name,
            hero: {
                ...playerAHero,
                maxHealth: 20,
                maxMana: 10,
                buffs: [],
                debuffs: []
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
            skins: playerA.skins
        },
        playerB: {
            name: playerB.name,
            hero: {
                ...playerBHero,
                maxHealth: 20,
                maxMana: 10,
                buffs: [],
                debuffs: []
            },
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
            skins: playerB.skins
        },
    };
};

const getGame = async (socketId) => {
    const { games, players } = mongo;
    const $player = await players.findOne({ socketId });
    if (!$player) {
        return [, "Player not found, try relogging."];
    }
    const { name } = $player;
    const id = $player.gameId;
    const $game = await games.findOne({ id });
    if (!$game) {
        return [, "Game not found."];
    }
    const { playerA, playerB } = $game;
    const player = playerA.name === name ? playerA : playerB;
    const opponent = playerA.name === name ? playerB : playerA;
    if ($game.currentPlayer !== player.name) {
        return [, "It's not your turn."];
    }
    return [{ $game, player, opponent }, ""];
};

const getRandomMinion = (player) => {
    const list = [];
    const fields = Object.keys(player.minion);
    fields.forEach((field) => {
        const minion = player.minion[field];
        if (minion) {
            list.push(minion);
        }
    });
    return list[randomInt(list.length)];
};

const isGameOver = async (game) => {
    if (game.playerA.hero.health <= 0) {
        await endGame(game.id, game.playerB.name);
        return true;
    }
    else if (game.playerB.hero.health <= 0) {
        await endGame(game.id, game.playerA.name);
        return true;
    }
    return false;
};

const revenge = (params) => {
    const { player, field } = params;
    const handCard = player.hand.find((card) => card.effect === EffectId.REVENGE);
    const deckCard = player.deck.find((card) => card.effect === EffectId.REVENGE);
    if (!handCard && !deckCard) {
        return [false, "No copy of the card found."];
    }
    if (handCard) {
        const index = player.hand.indexOf(handCard);
        player.minion[field] = handCard;
        player.hand.splice(index, 1);
    }
    else if (deckCard) {
        const index = player.deck.indexOf(deckCard);
        player.minion[field] = deckCard;
        player.deck.splice(index, 1);
    }
    return [true, ""];
};

const insertBuff = (card, id, data = {}) => {
    // switch (id) {
    //   case EffectId.BLAZE:
    //     const hasAttackedTwice = true;
    //     card.buffs.push({id, data: {hasAttackedTwice}});
    //     break;
    //   case EffectId.NECROMANCY:
    //     card.health -= 2;
    // }
    card.buffs.push({ id, data });
    // card.buffs.push({id, data});
    return [true, `Acidic Death buff added.`];
};

const unity = (params) => {
    const { player } = params;
    const handCard = player.hand.find((card) => card.effect === EffectId.UNITY);
    const deckCard = player.deck.find((card) => card.effect === EffectId.UNITY);
    if (!handCard && !deckCard) {
        return [false, "No copy of the card found in hand or deck."];
    }
    if (handCard) {
        insertBuff(handCard, EffectId.TAUNT);
    }
    else if (deckCard) {
        insertBuff(deckCard, EffectId.TAUNT);
    }
    return [true, ""];
};

const moveToGraveyard = (player, minion, field) => {
    const hasRevengeBuff = minion.buffs.find((buff) => buff.id === EffectId.REVENGE) !== undefined;
    const hasUnityBuff = minion.buffs.find((buff) => buff.id === EffectId.UNITY) !== undefined;
    const card = cards.find((card) => card.id === minion.id);
    if (!card)
        return;
    minion.health = minion.maxHealth;
    minion.damage = card.damage;
    minion.buffs = [];
    minion.debuffs = [];
    player.graveyard.push(minion);
    player.minion[field] = undefined;
    if (hasRevengeBuff) {
        revenge({ player, field });
    }
    if (hasUnityBuff) {
        unity({ player });
    }
};

const gamePopup = async (type, playerA, playerB) => {
    const { gamePopups, players } = mongo;
    const { io } = server;
    const id = randomInt(1, 1000000001);
    const [a, b] = await Promise.all([
        players.findOneAndUpdate({
            name: playerA
        }, {
            $set: {
                gamePopupId: id
            }
        }, {
            returnDocument: "after"
        }),
        players.findOneAndUpdate({
            name: playerB
        }, {
            $set: {
                gamePopupId: id
            }
        }, {
            returnDocument: "after"
        })
    ]);
    if (!a.value || !b.value) {
        return;
    }
    const inserted = await gamePopups.insertOne({
        id,
        type,
        playerA: {
            name: a.value.name,
            avatarId: 1,
            level: a.value.level,
            elo: a.value.elo,
            hasAccepted: false
        },
        playerB: {
            name: b.value.name,
            avatarId: 1,
            level: b.value.level,
            elo: b.value.elo,
            hasAccepted: false
        }
    });
    if (!inserted.insertedId) {
        return;
    }
    setTimeout(async () => {
        const $gamePopup = await gamePopups.findOne({ id });
        if (!$gamePopup) {
            return;
        }
        if (!$gamePopup.playerA.hasAccepted || !$gamePopup.playerB.hasAccepted) {
            const pa = await players.findOneAndUpdate({
                name: $gamePopup.playerA.name
            }, {
                $set: {
                    status: PlayerStatus.ONLINE,
                    gamePopupId: 0
                }
            });
            const pb = await players.findOneAndUpdate({
                name: $gamePopup.playerB.name
            }, {
                $set: {
                    status: PlayerStatus.ONLINE,
                    gamePopupId: 0
                }
            });
            if (!pa.value || !pb.value) {
                return;
            }
            await gamePopups.deleteOne({ id });
            io.to(pa.value.socketId).emit("declineGameSender");
            io.to(pb.value.socketId).emit("declineGameReceiver");
        }
    }, 10_000);
    io.to(a.value.socketId).emit("gamePopup");
    io.to(b.value.socketId).emit("gamePopup");
};

const saveGame = async (game) => {
    const { games, players } = mongo;
    const { io } = server;
    const { id, playerA, playerB } = game;
    const [$updateGame, $playerA, $playerB] = await Promise.all([
        games.replaceOne({ id }, game),
        players.findOne({
            name: playerA.name
        }),
        players.findOne({
            name: playerB.name
        })
    ]);
    if (!$updateGame.modifiedCount || !$playerA || !$playerB) {
        return;
    }
    io.to($playerA.socketId).emit("reloadGameState", {
        game: generateGameView(game, $playerA.name)
    });
    io.to($playerB.socketId).emit("reloadGameState", {
        game: generateGameView(game, $playerB.name)
    });
};

const startGame = async (id, type, playerA, playerB) => {
    const { accounts, games, players } = mongo;
    const { io } = server;
    const [$playerA, $playerB, $accountA, $accountB] = await Promise.all([
        players.findOneAndUpdate({
            name: playerA
        }, {
            $set: {
                status: PlayerStatus.IN_GAME,
                queueId: QueueId.NONE,
                lobbyId: 0,
                gamePopupId: 0,
                gameId: id
            }
        }),
        players.findOneAndUpdate({
            name: playerB
        }, {
            $set: {
                status: PlayerStatus.IN_GAME,
                queueId: QueueId.NONE,
                lobbyId: 0,
                gamePopupId: 0,
                gameId: id
            }
        }),
        accounts.findOne({
            name: playerA
        }),
        accounts.findOne({
            name: playerB
        }),
    ]);
    if (!$playerA.value || !$playerB.value || !$accountA || !$accountB) {
        return;
    }
    const game = generateGame(id, type, $playerA.value, $playerB.value);
    const isInserted = await games.insertOne(game);
    if (!isInserted.insertedId) {
        return;
    }
    io.to($playerA.value.socketId).emit("startGame", {
        playerA: {
            name: $playerA.value.name,
            avatarId: $accountA.avatarId,
            level: $playerA.value.level,
            elo: $playerA.value.elo
        },
        playerB: {
            name: $playerB.value.name,
            avatarId: $accountB.avatarId,
            level: $playerB.value.level,
            elo: $playerB.value.elo
        },
        game: generateGameView(game, $playerA.value.name)
    });
    io.to($playerB.value.socketId).emit("startGame", {
        playerA: {
            name: $playerA.value.name,
            avatarId: $accountA.avatarId,
            level: $playerA.value.level,
            elo: $playerA.value.elo
        },
        playerB: {
            name: $playerB.value.name,
            avatarId: $accountB.avatarId,
            level: $playerB.value.level,
            elo: $playerB.value.elo
        },
        game: generateGameView(game, $playerB.value.name)
    });
};

const lastStand = (params) => {
    const { minion, opponent, trap } = params;
    minion.health = 1;
    minion.buffs.push({ id: EffectId.TAUNT, data: {} });
    opponent.graveyard.push(trap);
    opponent.trap = undefined;
    return [true, "Last stand triggered"];
};

const deductHealth2 = (player, minion, damage) => {
    const shieldBuff = minion.buffs.find((buff) => buff.id === EffectId.SHIELD);
    if (shieldBuff) { // has shield
        const amt = shieldBuff.data.amount;
        if (amt > damage) { // shield reduced
            shieldBuff.data.amount -= damage;
        }
        else if (amt <= damage) { // shield broken
            if (player.trap && player.trap.effect === EffectId.HEART_OF_STEEL) {
                heartOfSteel({ minion, player, trap: player.trap });
            }
            const remaining = shieldBuff.data.amount - damage;
            if (remaining < 0) {
                if (minion.buffs.find((buff) => buff.id === EffectId.RESILIENT)) {
                    minion.health -= 1;
                }
                else {
                    minion.health -= remaining;
                }
            }
            const index = minion.buffs.indexOf(shieldBuff);
            minion.buffs.splice(index, 1);
        }
    }
    else { // no shield
        if (minion.buffs.find((buff) => buff.id === EffectId.RESILIENT)) {
            minion.health -= 1;
        }
        else {
            minion.health -= damage;
        }
    }
};

const selfDestruct = (params) => {
    params.player.hero.health -= 3;
    return [true, ""];
};

const acidicDeath = (params) => {
    const { player, opponent } = params;
    const playerMinionKeys = Object.keys(player.minion);
    const opponentMinionKeys = Object.keys(opponent.minion);
    playerMinionKeys.forEach((key) => {
        const minion = player.minion[key];
        if (!minion) {
            return;
        }
        deductHealth2(player, minion, 1);
        if (minion.health <= 0) {
            const { trap } = player;
            if (trap && trap.effect === EffectId.LAST_STAND) {
                lastStand({ minion, opponent: player, trap });
            }
            else {
                const hasAcidicDeathBuff = minion.buffs.find((buff) => buff.id === EffectId.ACIDIC_DEATH);
                moveToGraveyard(player, minion, key);
                if (hasAcidicDeathBuff) {
                    acidicDeath({ player, opponent });
                }
            }
        }
    });
    opponentMinionKeys.forEach((key) => {
        const minion = opponent.minion[key];
        if (!minion) {
            return;
        }
        deductHealth2(opponent, minion, 1);
        if (minion.health <= 0) {
            const { trap } = opponent;
            if (trap && trap.effect === EffectId.LAST_STAND) {
                lastStand({ minion, opponent, trap });
            }
            else {
                const hasAcidicDeathBuff = minion.buffs.find((buff) => buff.id === EffectId.ACIDIC_DEATH);
                const hasSelfDescturctDebuff = minion.debuffs.find((debuff) => debuff.id === EffectId.SELF_DESTRUCT);
                moveToGraveyard(opponent, minion, key);
                if (hasSelfDescturctDebuff) {
                    selfDestruct({ player }); // check for endgame? find a better way to call onDeath effects?
                }
                if (hasAcidicDeathBuff) {
                    acidicDeath({ player, opponent });
                }
            }
        }
    });
    return [true, "Acidic Death triggered."];
};

const banish = (params) => {
    const { player, opponent, minion, trap, field } = params;
    player.minion[field] = undefined;
    player.hand.push(minion);
    opponent.graveyard.push(trap);
    opponent.trap = undefined;
    return [true, ""];
};

const shadowSurge = (params) => {
    params.minion.canAttack = true;
    return [true, ""];
};

const diminish = (params) => {
    const { opponent, field } = params;
    if (!field) {
        return [false, "Field for Effect not specified."];
    }
    const card = opponent.minion[field];
    if (!card) {
        return [false, `Minion doesn't exist on the field ${field}.`];
    }
    if (card.buffs.find((buff) => buff.id === EffectId.ELUSIVE) !== undefined) {
        return [false, "Diminish negated."];
    }
    if (card.damage > 2) {
        card.damage -= 2;
    }
    else {
        card.damage = 0;
    }
    card.debuffs.push({
        id: EffectId.DIMINISH,
        data: { damage: -2 }
    });
    return [true, `
    Player ${opponent.name} has played Diminish magic card, reducing your card on
    the field ${field} Damage by 2.
  `];
};

const frostbite = (params) => {
    const { minion, player, trap } = params;
    minion.damage = 1;
    player.graveyard.push(trap);
    player.trap = undefined;
    return [true, `Frostbite triggered`];
};

const glory = (params) => {
    const { opponent, minion } = params;
    const possibleMinions = [];
    const minionKeys = Object.keys(opponent.minion);
    minionKeys.forEach((key) => {
        const Minion = opponent.minion[key];
        if (Minion) {
            const hasElusiveBuff = Minion.buffs.find((buff) => buff.id === EffectId.ELUSIVE);
            if (!hasElusiveBuff) {
                possibleMinions.push({ Minion, key });
            }
        }
    });
    if (possibleMinions.length) {
        let randomMinion = randomInt(possibleMinions.length);
        let { Minion, key } = possibleMinions[randomMinion];
        deductHealth2(opponent, Minion, 2);
        if (minion.health <= 0) {
            moveToGraveyard(opponent, Minion, key);
            insertBuff(minion, EffectId.TAUNT); // refactor this, minion = player, Minion = opponent
        }
    }
    return [true, ""];
};

const mirrorsEdge = (params) => {
    const { player, opponent, minion, trap } = params;
    player.hero.health -= minion.damage;
    opponent.graveyard.push(trap);
    opponent.trap = undefined;
    return [true, ""];
};

const risingFury = (params) => {
    const { minionCard } = params;
    minionCard.health += 1;
    minionCard.damage += 1;
    return [true, ""];
};

const blaze = (params) => {
    const blazeBuff = params.minion.buffs.find((buff) => buff.id === EffectId.BLAZE);
    if (!blazeBuff) {
        return [false, "Blaze buff not found."];
    }
    blazeBuff.data.hasAttackedTwice = false;
    return [true, ""];
};

const necromancy = (params) => {
    const { minion, isPositive } = params;
    if (isPositive) {
        minion.health += 2;
        minion.damage += 2;
    }
    else {
        minion.health -= 2;
        minion.damage -= 2;
    }
    return [true, ""];
};

const quickShot = (params) => {
    const { opponent } = params;
    const possibleMinions = [];
    const minionKeys = Object.keys(opponent.minion);
    minionKeys.forEach((key) => {
        const minion = opponent.minion[key];
        if (minion) {
            const hasElusiveBuff = minion.buffs.find((buff) => buff.id === EffectId.ELUSIVE);
            if (!hasElusiveBuff) {
                possibleMinions.push({ minion, key });
            }
        }
    });
    if (possibleMinions.length) {
        let randomMinion = randomInt(possibleMinions.length);
        let { minion, key } = possibleMinions[randomMinion];
        deductHealth2(opponent, minion, 2);
        if (minion.health <= 0) {
            moveToGraveyard(opponent, minion, key);
        }
    }
    return [true, ""];
};

const rebirth = (params) => {
    const { player, target, field } = params;
    if (!target) {
        return [false, "Target for revival not specified."];
    }
    if (!field) {
        return [false, "Field for Special Summon not specified."];
    }
    if (player.minion[field]) {
        return [false, `Minion already exists on the field ${field}.`];
    }
    const toRevive = player.graveyard.find((card) => card.gid === target);
    if (!toRevive) {
        return [false, "Card with the given ID not found in the graveyard."];
    }
    if (toRevive.type !== CardType.MINION) {
        return [false, "Selected card for revival must be a Minion."];
    }
    if (toRevive.effect === EffectId.ELUSIVE) {
        return [false, "Rebirth negated."];
    }
    if (toRevive.effect === EffectId.NECROMANCY) {
        toRevive.damage += 2;
        toRevive.health += 2;
        toRevive.buffs.push({
            id: EffectId.NECROMANCY,
            data: { damage: 2, health: 2 }
        });
    }
    if (toRevive.effect === EffectId.PROTECTOR) {
        toRevive.buffs.push({ id: EffectId.SHIELD, data: { amount: 3 } });
    }
    player.minion[field] = toRevive;
    player.graveyard.splice(player.graveyard.indexOf(toRevive), 1);
    return [true, "Successfully revived."];
};

const reload = (params) => {
    const { player } = params;
    const drawnCard = player.deck.pop();
    if (!drawnCard) {
        return [false, "You have no cards remaining to draw."];
    }
    player.hand.push(drawnCard);
    return [true, ""];
};

const ricochet = (params) => {
    const { player, opponent, minionCard, trapCard } = params;
    const possibleMinions = [];
    const minionKeys = Object.keys(opponent.minion);
    minionKeys.forEach((key) => {
        const minion = opponent.minion[key];
        if (minion) {
            const hasElusiveBuff = minion.buffs.find((buff) => buff.id === EffectId.ELUSIVE);
            if (!hasElusiveBuff) {
                possibleMinions.push({ minion, key });
            }
        }
    });
    if (possibleMinions.length) {
        let randomMinion = randomInt(possibleMinions.length);
        let { minion, key } = possibleMinions[randomMinion];
        deductHealth2(opponent, minion, minionCard.damage);
        if (minion.health <= 0) {
            moveToGraveyard(opponent, minion, key);
        }
    }
    opponent.graveyard.push(trapCard);
    opponent.trap = undefined;
    return [true, ""];
};

const shell = (params) => {
    const { player } = params;
    const keys = Object.keys(player.minion);
    keys.forEach((field) => {
        const minion = player.minion[field];
        if (minion) {
            const shieldBuff = minion.buffs.find((buff) => buff.id === EffectId.SHIELD);
            const unbreakableBuff = minion.buffs.find((buff) => buff.id === EffectId.UNBREAKABLE);
            const amount = unbreakableBuff ? 2 : 1;
            if (shieldBuff) {
                shieldBuff.data.amount += amount;
            }
            else {
                insertBuff(minion, EffectId.SHIELD, { amount });
            }
        }
    });
};

const getAdjacentMinions = (field) => {
    const adjacentFields = [];
    switch (field) {
        case "a":
            adjacentFields.push("b");
            break;
        case "b":
            adjacentFields.push("a", "c");
            break;
        case "c":
            adjacentFields.push("b", "d");
            break;
        case "d":
            adjacentFields.push("c");
            break;
    }
    return adjacentFields;
};

const shieldwall = (params) => {
    const { player, field } = params;
    const fields = getAdjacentMinions(field);
    fields.forEach((field) => {
        const minion = player.minion[field];
        if (minion) {
            const shieldBuff = minion.buffs.find((buff) => buff.id === EffectId.SHIELD);
            const unbreakableBuff = minion.buffs.find((buff) => buff.id === EffectId.UNBREAKABLE);
            const amount = unbreakableBuff ? 2 : 1;
            if (shieldBuff) {
                shieldBuff.data.amount += amount;
            }
            else {
                insertBuff(minion, EffectId.SHIELD, { amount });
            }
        }
    });
};

const silence = (params) => {
    const { opponent, trap } = params;
    opponent.graveyard.push(trap);
    opponent.trap = undefined;
    return [true, ""];
};

const smite = (params) => {
    const { player, opponent, minion, trap, field } = params;
    moveToGraveyard(player, minion, field);
    opponent.graveyard.push(trap);
    opponent.trap = undefined;
    return [true, ""];
};

const spellweave = (params) => {
    const { player, minion } = params;
    const amount = player.graveyard.reduce((sum, card) => {
        if (card.type === CardType.MAGIC) {
            return sum += 1;
        }
        return sum;
    }, 0);
    insertBuff(minion, EffectId.SHIELD, { amount });
    return [true, ""];
};

const insertDebuff = (card, id, data = {}) => {
    card.debuffs.push({ id, data });
    return [true, "Debuff added."];
};

const toxicSpray = (params) => {
    const { opponent } = params;
    const possibleMinions = [];
    const minionKeys = Object.keys(opponent.minion);
    minionKeys.forEach((key) => {
        const minion = opponent.minion[key];
        if (minion) {
            const hasElusiveBuff = minion.buffs.find((buff) => buff.id === EffectId.ELUSIVE);
            if (!hasElusiveBuff) {
                possibleMinions.push({ minion, key });
            }
        }
    });
    if (possibleMinions.length) {
        let randomMinion = randomInt(possibleMinions.length);
        let { minion, key } = possibleMinions[randomMinion];
        deductHealth2(opponent, minion, 1);
        insertDebuff(minion, EffectId.NEUROTOXIN);
        if (minion.health <= 0) {
            moveToGraveyard(opponent, minion, key);
        }
    }
    return [true, ""];
};

const valor = (params) => {
    const { opponent } = params;
    const minionKeys = Object.keys(opponent.minion);
    let totalDamage = 0;
    minionKeys.forEach((key) => {
        const minion = opponent.minion[key];
        if (minion) {
            const shieldBuff = minion.buffs.find((buff) => buff.id === EffectId.SHIELD);
            if (shieldBuff) {
                totalDamage += shieldBuff.data.amount;
                minion.buffs.splice(minion.buffs.indexOf(shieldBuff, 1));
            }
        }
    });
    opponent.hero.health -= totalDamage;
    return [true, ""];
};

const fortitude = (params) => {
    const { player, field } = params;
    if (!field) {
        return [false, "Field not specified."];
    }
    const minion = player.minion[field];
    if (!minion) {
        return [false, `No minion on the ${field} field.`];
    }
    deductHealth2(player, minion, 1);
    if (minion.health > 0) {
        insertBuff(minion, EffectId.TAUNT);
    }
    else {
        moveToGraveyard(player, minion, field);
    }
    return [true, ""];
};

const regeneration = (params) => {
    const { player } = params;
    const minionKeys = Object.keys(player.minion);
    const possibleKeys = [];
    minionKeys.forEach((key) => {
        const Minion = player.minion[key];
        if (!Minion) {
            return;
        }
        if (Minion.buffs.find((buff) => buff.id !== EffectId.REGENERATION)) {
            possibleKeys.push(key);
        }
    });
    if (possibleKeys.length) {
        const rand = randomInt(possibleKeys.length);
        const min = player.minion[possibleKeys[rand]];
        if (!min) {
            return [false, ""];
        }
        min.health += 2;
    }
    return [true, ""];
};

const leech = (params) => {
    const { player, minion } = params;
    player.hero.health += minion.damage;
    return [true, ""];
};

const electroShock = (params) => {
    const { player, opponent } = params;
    const playerMinionFields = Object.keys(player.minion);
    const opponentMinionFields = Object.keys(opponent.minion);
    playerMinionFields.forEach((field) => {
        const minion = player.minion[field];
        if (minion) {
            minion.buffs = [];
            minion.debuffs = [];
        }
    });
    opponentMinionFields.forEach((field) => {
        const minion = opponent.minion[field];
        if (minion) {
            minion.buffs = [];
            minion.debuffs = [];
        }
    });
    return [true, ""];
};

const cleanse = (params) => {
    const { player, field } = params;
    if (!field) {
        return [false, "Field not specified."];
    }
    const minion = player.minion[field];
    if (!minion) {
        return [false, `No minion on the ${field} field.`];
    }
    minion.debuffs = [];
    return [true, ""];
};

const tidalWave = (params) => {
    const { player } = params;
    const playerMinionFields = Object.keys(player.minion);
    playerMinionFields.forEach((field) => {
        const minion = player.minion[field];
        if (minion) {
            minion.health += 3;
        }
    });
    return [true, ""];
};

const retribution = (params) => {
    const { player, field } = params;
    const adj = getAdjacentMinions(field);
    adj.forEach((field) => {
        const minj = player.minion[field];
        if (!minj)
            return;
        minj.damage -= 2;
        if (minj.damage <= 0) {
            minj.damage = 0;
        }
    });
    return [true, ""];
};

const corrosiveTouch = (params) => {
    const { opponent } = params;
    const minionKeys = Object.keys(opponent.minion);
    let damageToHero = 0;
    minionKeys.forEach((key) => {
        const minion = opponent.minion[key];
        if (minion) {
            const hasElusiveBuff = minion.buffs.find((buff) => buff.id === EffectId.ELUSIVE);
            if (!hasElusiveBuff) {
                const hasNeurotoxinDebuff = minion.debuffs.find((debuff) => debuff.id === EffectId.NEUROTOXIN);
                if (hasNeurotoxinDebuff) {
                    damageToHero += 1;
                }
            }
        }
    });
    opponent.hero.health -= damageToHero;
    return [true, ""];
};

const toxicGas = (params) => {
    const { opponent } = params;
    const minionKeys = Object.keys(opponent.minion);
    minionKeys.forEach((key) => {
        const minion = opponent.minion[key];
        if (minion) {
            const hasElusiveBuff = minion.buffs.find((buff) => buff.id === EffectId.ELUSIVE);
            if (!hasElusiveBuff) {
                insertBuff(minion, EffectId.NEUROTOXIN);
            }
        }
    });
    return [true, ""];
};

const acidRain = (params) => {
    const { opponent } = params;
    const minionKeys = Object.keys(opponent.minion);
    const possibleMinions = [];
    minionKeys.forEach((key) => {
        const minion = opponent.minion[key];
        if (minion) {
            const hasElusiveBuff = minion.buffs.find((buff) => buff.id === EffectId.ELUSIVE);
            if (!hasElusiveBuff) {
                possibleMinions.push(minion);
            }
        }
    });
    const minion1 = possibleMinions[randomInt(possibleMinions.length)];
    const minion2 = possibleMinions[randomInt(possibleMinions.length)];
    insertDebuff(minion1, EffectId.NEUROTOXIN);
    insertDebuff(minion2, EffectId.NEUROTOXIN);
    return [true, ""];
};

const smokeBomb = (params) => {
    const { player } = params;
    const minionKeys = Object.keys(player.minion);
    minionKeys.forEach((key) => {
        const minion = player.minion[key];
        if (minion) {
            const hasElusiveBuff = minion.buffs.find((buff) => buff.id === EffectId.ELUSIVE);
            if (!hasElusiveBuff) {
                insertBuff(minion, EffectId.STEALTH);
            }
        }
    });
    return [true, ""];
};

const contaminatedAir = (params) => {
    const { player, opponent } = params;
    const minionKeys = Object.keys(player.minion);
    const opponentMinionKeys = Object.keys(player.minion);
    minionKeys.forEach((key) => {
        const minion = player.minion[key];
        if (minion) {
            const hasElusiveBuff = minion.buffs.find((buff) => buff.id === EffectId.ELUSIVE);
            if (!hasElusiveBuff) {
                if (minion.damage > 0) {
                    minion.damage -= 1;
                }
                insertDebuff(minion, EffectId.CONTAMINATED_AIR);
            }
        }
    });
    opponentMinionKeys.forEach((key) => {
        const minion = opponent.minion[key];
        if (minion) {
            const hasElusiveBuff = minion.buffs.find((buff) => buff.id === EffectId.ELUSIVE);
            if (!hasElusiveBuff) {
                if (minion.damage > 0) {
                    minion.damage -= 1;
                }
                insertDebuff(minion, EffectId.CONTAMINATED_AIR);
            }
        }
    });
    return [true, ""];
};

const noxiousFumes = (params) => {
    const { opponent, minion, field } = params;
    const minionKeys = Object.keys(opponent.minion);
    let damage = 0;
    minionKeys.forEach((key) => {
        const minion = opponent.minion[key];
        if (minion) {
            const hasElusiveBuff = minion.buffs.find((buff) => buff.id === EffectId.ELUSIVE);
            if (!hasElusiveBuff) {
                const hasNeurotoxinDebuff = minion.debuffs.find((debuff) => debuff.id === EffectId.NEUROTOXIN);
                if (hasNeurotoxinDebuff) {
                    damage += 1;
                }
            }
        }
    });
    deductHealth2(opponent, minion, damage);
    if (minion.health <= 0) {
        moveToGraveyard(opponent, minion, field);
    }
    return [true, ""];
};

const poisonedGround = (params) => {
    const { player, minion, trap } = params;
    insertDebuff(minion, EffectId.NEUROTOXIN);
    player.graveyard.push(trap);
    player.trap = undefined;
    return [true, ""];
};

const rampage = (params) => {
    params.minion.damage += 1;
    return [true, ""];
};

const backstab = (params) => {
    const { opponent, minion } = params;
    opponent.hero.mana -= 1;
    minion.damage += 2;
    return [true, ""];
};

const overpower = (params) => {
    const { opponent, damage } = params;
    opponent.hero.health -= damage;
    return [true, ""];
};

const ignite = (params) => {
    const { player, opponent, field } = params;
    if (!field) {
        return [false, "Field for Effect not specified."];
    }
    const card = opponent.minion[field];
    if (!card) {
        return [false, `Minion doesn't exist on the field ${field}.`];
    }
    if (card.buffs.find((buff) => buff.id === EffectId.ELUSIVE)) {
        return [false, "Ignite negated."];
    }
    card.health -= 2;
    if (card.health <= 0) {
        moveToGraveyard(opponent, card, field);
        const drawnCard = player.deck.pop();
        if (drawnCard) {
            player.hand.push(drawnCard);
        }
    }
    return [true, ""];
};

const corruption = (params) => {
    const { player, field } = params;
    if (!field) {
        return [false, "Field for Effect not specified."];
    }
    const card = player.minion[field];
    if (!card) {
        return [false, `Minion doesn't exist on the field ${field}.`];
    }
    if (card.buffs.find((buff) => buff.id === EffectId.ELUSIVE)) {
        return [false, "Corruption negated."];
    }
    card.health -= 2;
    if (card.health <= 0) {
        moveToGraveyard(player, card, field);
    }
    else {
        insertBuff(card, EffectId.OVERCHARGE);
    }
    return [true, ""];
};

const hysteria = (params) => {
    const { player, field } = params;
    if (!field) {
        return [false, "Field for Effect not specified."];
    }
    const card = player.minion[field];
    if (!card) {
        return [false, `Minion doesn't exist on the field ${field}.`];
    }
    if (card.buffs.find((buff) => buff.id === EffectId.ELUSIVE)) {
        return [false, "Hysteria negated."];
    }
    card.damage *= 2;
    card.health = 1;
    insertBuff(card, EffectId.HYSTERIA);
    return [true, ""];
};

const explosive = (params) => {
    const { player, opponent, trap, field } = params;
    const fields = getAdjacentMinions(field);
    fields.forEach((field) => {
        const minion = player.minion[field];
        if (minion) {
            minion.health -= 2;
            if (minion.health <= 0) {
                moveToGraveyard(player, minion, field);
            }
        }
    });
    opponent.graveyard.push(trap);
    opponent.trap = undefined;
    return [true, "Last stand triggered"];
};

const reflection = (params) => {
    const { player, opponent, trap } = params;
    const fields = Object.keys(player.minion);
    fields.forEach((field) => {
        const minion = player.minion[field];
        if (minion) {
            insertBuff(minion, EffectId.OVERCHARGE);
        }
    });
    opponent.graveyard.push(trap);
    opponent.trap = undefined;
    return [true, "Last stand triggered"];
};

const constriction = (params) => {
    const { player, opponent, minion, trap } = params;
    const fields = Object.keys(player.minion);
    const sum = fields.reduce((amount, field) => {
        const minion = player.minion[field];
        return minion && minion.buffs.find((buff) => buff.id === EffectId.OVERCHARGE) ? amount + 1 : amount;
    }, 0);
    if (minion.damage >= sum) {
        minion.damage -= sum;
    }
    else {
        minion.damage = 0;
    }
    opponent.graveyard.push(trap);
    opponent.trap = undefined;
    return [true, "Last stand triggered"];
};

const triggerEffect = {
    acidicDeath,
    acidRain,
    banish,
    backstab,
    cleanse,
    corrosiveTouch,
    contaminatedAir,
    shadowSurge,
    diminish,
    electroShock,
    fortitude,
    frostbite,
    glory,
    heartOfSteel,
    lastStand,
    leech,
    mirrorsEdge,
    risingFury,
    blaze,
    necromancy,
    unity,
    silence,
    quickShot,
    shieldwall,
    smite,
    spellweave,
    rebirth,
    regeneration,
    retribution,
    reload,
    revenge,
    ricochet,
    shell,
    toxicGas,
    toxicSpray,
    tidalWave,
    valor,
    smokeBomb,
    noxiousFumes,
    poisonedGround,
    selfDestruct,
    rampage,
    overpower,
    ignite,
    corruption,
    hysteria,
    explosive,
    reflection,
    constriction,
};

const gameEngine = {
    animateMagicTrigger,
    animateTrapTrigger,
    attackMinionSave,
    buildDeck,
    deductHealth,
    drawCard,
    endGame,
    generateGame,
    generateGameView,
    getAdjacentMinions,
    getGame,
    getRandomMinion,
    isGameOver,
    moveToGraveyard,
    gamePopup,
    saveGame,
    startGame,
    insertBuff,
    insertDebuff,
    triggerEffect
};

const acceptGame = (socket, error) => {
    const socketId = socket.id;
    const { gamePopups, players } = mongo;
    const { io } = server;
    socket.on("acceptGame", async () => {
        const $player = await players.findOne({ socketId });
        if (!$player) {
            return error("Player not found, try relogging.");
        }
        const id = $player.gamePopupId;
        const $gamePopup = await gamePopups.findOne({ id });
        if (!$gamePopup) {
            return error("Game popup not found.");
        }
        const { type, playerA, playerB } = $gamePopup;
        if (playerA.hasAccepted || playerB.hasAccepted) {
            const $gamePopupDelete = await gamePopups.deleteOne({ id });
            if (!$gamePopupDelete.deletedCount) {
                return error("Error deleting game popup.");
            }
            await gameEngine.startGame(id, type, playerA.name, playerB.name);
        }
        else {
            if (playerA.name === $player.name) {
                playerA.hasAccepted = true;
            }
            else if (playerB.name === $player.name) {
                playerB.hasAccepted = true;
            }
            const [$playerA, $playerB, $gamePopupReplace] = await Promise.all([
                players.findOne({
                    name: playerA.name
                }),
                players.findOne({
                    name: playerB.name
                }),
                gamePopups.replaceOne({ id }, $gamePopup)
            ]);
            if (!$playerA || !$playerB) {
                return error("Player A in popup not found.");
            }
            if (!$playerB) {
                return error("Player B in popup not found.");
            }
            if (!$gamePopupReplace.modifiedCount) {
                return error("Error replacing game popup.");
            }
            io.to([$playerA.socketId, $playerB.socketId]).emit("acceptGame");
        }
    });
};

const closeLobby = (socket, error) => {
    const socketId = socket.id;
    const { players, lobbies } = mongo;
    const { io } = server;
    socket.on("closeLobby", async () => {
        const $player = await players.findOne({ socketId });
        if (!$player) {
            return error("Player not found, try relogging.");
        }
        const { name, lobbyId } = $player;
        if (!lobbyId) {
            return error("You are not in a lobby.");
        }
        const id = lobbyId;
        const $lobby = await lobbies.findOne({ id });
        if (!$lobby) {
            return error("Lobby not found.");
        }
        const { host, challengee } = $lobby;
        if (host.name !== name) {
            return error("You are not the lobby host.");
        }
        const [$lobbyDelete, $playerUpdate] = await Promise.all([
            lobbies.deleteOne({ id }),
            players.updateOne({ socketId }, {
                $set: {
                    lobbyId: 0,
                    status: PlayerStatus.ONLINE
                }
            })
        ]);
        if (!$lobbyDelete.deletedCount) {
            return error("Error deleting lobby.");
        }
        if (!$playerUpdate.modifiedCount) {
            return error("Error updating player host.");
        }
        socket.emit("closeLobby");
        if (challengee.name) {
            const $challengee = await players.findOneAndUpdate({
                name: challengee.name
            }, {
                $set: {
                    lobbyId: 0,
                    status: PlayerStatus.ONLINE
                }
            }, {
                returnDocument: "after"
            });
            if (!$challengee.value) {
                return error("Error updating player challengee.");
            }
            io.to($challengee.value.socketId).emit("closeLobby");
        }
    });
};

const createLobby = (socket, error) => {
    const socketId = socket.id;
    const { accounts, players, lobbies } = mongo;
    socket.on("createLobby", async () => {
        const $player = await players.findOne({ socketId });
        if (!$player) {
            return error("Player not found, try relogging.");
        }
        if ($player.lobbyId) {
            return error("Already in a lobby.");
        }
        if ($player.gameId) {
            return error("Can't make a lobby while in game.");
        }
        if ($player.queueId) {
            return error("Can't make a lobby while in queue.");
        }
        if (!isDeckValid($player.decks[$player.deckId])) {
            return error("Invalid deck.");
        }
        const { name } = $player;
        const $account = await accounts.findOne({ name });
        if (!$account) {
            return error("Account not found, try relogging.");
        }
        const { avatarId } = $account;
        const id = randomInt(1, 1000000001);
        const lobby = {
            id,
            host: { name, avatarId },
            challengee: {
                name: "",
                avatarId: 0
            }
        };
        const [$lobbyInsert, $playerUpdate] = await Promise.all([
            lobbies.insertOne(lobby),
            players.updateOne({ socketId }, {
                $set: {
                    lobbyId: id,
                    status: PlayerStatus.IN_LOBBY
                }
            })
        ]);
        if (!$lobbyInsert.insertedId) {
            return error("Error inserting lobby.");
        }
        if (!$playerUpdate.modifiedCount) {
            return error("Error updating player.");
        }
        socket.emit("createLobby", { lobby });
    });
};

const declineGame = (socket, error) => {
    const socketId = socket.id;
    const { gamePopups, players } = mongo;
    const { io } = server;
    socket.on("declineGame", async () => {
        const $player = await players.findOne({ socketId });
        if (!$player) {
            return error("Player not found, try relogging.");
        }
        const id = $player.gamePopupId;
        const $gamePopup = await gamePopups.findOne({ id });
        if (!$gamePopup) {
            return error("Game popup not found.");
        }
        const { playerA, playerB } = $gamePopup;
        const [$gamePopupDelete, $playerA, $playerB] = await Promise.all([
            gamePopups.deleteOne({ id }),
            players.findOneAndUpdate({
                name: playerA.name
            }, {
                $set: {
                    status: PlayerStatus.ONLINE,
                    gamePopupId: 0
                }
            }, {
                returnDocument: "after"
            }),
            players.findOneAndUpdate({
                name: playerB.name
            }, {
                $set: {
                    status: PlayerStatus.ONLINE,
                    gamePopupId: 0
                }
            }, {
                returnDocument: "after"
            })
        ]);
        if (!$gamePopupDelete.deletedCount) {
            return error("Failed to delete game popup.");
        }
        if (!$playerA.value) {
            return error("Player A in popup not found / updated.");
        }
        if (!$playerB.value) {
            return error("Player B in popup not found / updated.");
        }
        io.to([
            $playerA.value.socketId,
            $playerB.value.socketId
        ]).emit("declineGame");
    });
};

const defaultSkin = (socket, error) => {
    const socketId = socket.id;
    const { players } = mongo;
    socket.on("defaultSkin", async (params) => {
        const $player = await players.findOne({ socketId });
        if (!$player) {
            return error("Player not found, try relogging.");
        }
        const { cardId } = params;
        const $playerUpdate = await players.updateOne({ socketId }, {
            $pull: {
                skins: { cardId }
            }
        });
        if (!$playerUpdate.modifiedCount) {
            return error("Failed to set default skin");
        }
        socket.emit("defaultSkin", { cardId });
    });
};

const finishTutorial = (socket, error) => {
    const socketId = socket.id;
    const { players } = mongo;
    socket.on("finishTutorial", async (params) => {
        const { tutorial } = params;
        if (tutorial !== "deckBuilder" &&
            tutorial !== "wallet" &&
            tutorial !== "play") {
            return error("Invalid tutorial.");
        }
        const $playerUpdate = await players.updateOne({ socketId }, {
            $set: {
                [`tutorial.${tutorial}`]: true
            }
        });
        if (!$playerUpdate.modifiedCount) {
            return error("Failed to update player.");
        }
        socket.emit("finishTutorial", { tutorial });
    });
};

/**
  * Call the below functionality once per hour / day, sort & store in mongodb.
  * On signin event query the mongodb for sorted leaderboards and emit.
  * Frontend should be able to re-query on leaderboards change (emit to all?).
  * This event should then be removed.
**/
const getLeaderboards = (socket, error) => {
    const { accounts, players } = mongo;
    socket.on("getLeaderboards", async () => {
        const byLevel = (await players
            .find()
            .limit(100)
            .sort({
            level: -1
        })
            .toArray()).map(({ name, level }) => ({ name, level, avatarId: 1 }));
        for (let i = 0; i < byLevel.length; i += 1) {
            const $account = await accounts.findOne({ name: byLevel[i].name });
            if (!$account) {
                return;
            }
            const { avatarId } = $account;
            byLevel[i].avatarId = avatarId;
        }
        const byElo = (await players
            .find()
            .limit(100)
            .sort({
            elo: -1
        })
            .toArray()).map(({ name, elo }) => ({ name, elo, avatarId: 1 }));
        for (let i = 0; i < byElo.length; i += 1) {
            const $account = await accounts.findOne({ name: byElo[i].name });
            if (!$account) {
                return;
            }
            const { avatarId } = $account;
            byElo[i].avatarId = avatarId;
        }
        socket.emit("getLeaderboards", { byLevel, byElo });
    });
};

const generateLobbyView = ($lobby) => {
    const { id, host, challengee } = $lobby;
    return { id, host, challengee };
};

const joinCasualQueue = async (name, level) => {
    const { casualQueuePlayers, players } = mongo;
    const opponents = await casualQueuePlayers.find().toArray();
    for (const opponent of opponents) { // maybe create an interval and loop every 20 seconds for matchmaking
        if (opponent.level < level - 100 || opponent.level < level + 100) {
            const $casualQueuePlayerDelete = await casualQueuePlayers.deleteOne({
                name: opponent.name
            });
            const $playerUpdate = await players.updateOne({
                name: opponent.name
            }, {
                $set: {
                    queueId: QueueId.NONE
                }
            });
            await players.updateOne({
                name
            }, {
                $set: {
                    queueId: QueueId.NONE
                }
            });
            if (!$casualQueuePlayerDelete.deletedCount || !$playerUpdate.modifiedCount) {
                console.error("Failed removing player from queue after match found.");
                return;
            }
            await gameEngine.gamePopup(GameType.CASUAL, opponent.name, name);
            return;
        }
    }
    const $casualQueuePlayerInsert = await casualQueuePlayers.insertOne({ name, level });
    if (!$casualQueuePlayerInsert.insertedId) {
        console.error("Failed to insert player in the queue.");
        return;
    }
    // player queue id is set in joinQueue request.
};

const joinRankedQueue = async (name, elo) => {
    const { rankedQueuePlayers, players } = mongo;
    const opponents = await rankedQueuePlayers.find().toArray();
    for (const opponent of opponents) {
        if (opponent.elo < elo - 11250 || opponent.elo < elo + 11250) {
            const $casualQueuePlayerDelete = await rankedQueuePlayers.deleteOne({
                name: opponent.name
            });
            const $playerUpdate = await players.updateOne({
                name: opponent.name
            }, {
                $set: {
                    queueId: QueueId.NONE
                }
            });
            await players.updateOne({
                name
            }, {
                $set: {
                    queueId: QueueId.NONE
                }
            });
            if (!$casualQueuePlayerDelete.deletedCount || !$playerUpdate.modifiedCount) {
                console.error("Failed removing player from queue after match found.");
                return;
            }
            await gameEngine.gamePopup(GameType.RANKED, opponent.name, name);
            return;
        }
    }
    const inserted = await rankedQueuePlayers.insertOne({ name, elo });
    if (!inserted.insertedId) {
        console.error("Failed to insert player in the queue.");
        return;
    }
};

const leaveCasualQueue = async (name) => {
    const { casualQueuePlayers, players } = mongo;
    const [deleteCasualQueuePlayer, updatePlayer] = await Promise.all([
        casualQueuePlayers.deleteOne({ name }),
        players.updateOne({ name }, {
            $set: {
                status: PlayerStatus.ONLINE,
                queueId: 0
            }
        })
    ]);
    if (!deleteCasualQueuePlayer.deletedCount || !updatePlayer.modifiedCount) {
        console.error("Error removing player from queue.");
        return;
    }
};

const leaveRankedQueue = async (name) => {
    const [deleteRankedQueuePlayer, updatePlayer] = await Promise.all([
        mongo.rankedQueuePlayers.deleteOne({ name }),
        mongo.players.updateOne({ name }, {
            $set: {
                status: PlayerStatus.ONLINE,
                queueId: 0
            }
        })
    ]);
    if (!deleteRankedQueuePlayer.deletedCount || !updatePlayer.modifiedCount) {
        console.error("Error removing player from queue.");
        return;
    }
};

const joinLobby = (socket, error) => {
    const socketId = socket.id;
    const { accounts, lobbies, players } = mongo;
    const { io } = server;
    socket.on("joinLobby", async (params) => {
        const { id } = params;
        const [$player, $lobby] = await Promise.all([
            players.findOne({ socketId }),
            lobbies.findOne({ id })
        ]);
        if (!$player) {
            return error("Player not found.");
        }
        if (!$lobby) {
            return error("Lobby not found.");
        }
        if ($player.lobbyId) {
            return error("You are already in a lobby.");
        }
        if ($player.gameId) {
            return error("You can't join a lobby while in game.");
        }
        if ($lobby.challengee.name) {
            return error("Lobby is full.");
        }
        if (!isDeckValid($player.decks[$player.deckId])) {
            return error("Invalid deck.");
        }
        const { name } = $player;
        const $account = await accounts.findOne({ name });
        if (!$account) {
            return error("Eternitas account not found for player.");
        }
        const { avatarId } = $account;
        const [$lobbyUpdate, $playerUpdate, $playerHost] = await Promise.all([
            lobbies.findOneAndUpdate({ id }, {
                $set: {
                    challengee: { name, avatarId }
                }
            }, {
                returnDocument: "after"
            }),
            players.updateOne({ socketId }, {
                $set: {
                    lobbyId: id,
                    status: PlayerStatus.IN_LOBBY
                }
            }),
            players.findOne({
                name: $lobby.host.name
            })
        ]);
        if (!$lobbyUpdate.value) {
            return error("Error updating lobby.");
        }
        if (!$playerUpdate.modifiedCount) {
            return error("Error updating player.");
        }
        if (!$playerHost) {
            return error("Lobby host not found.");
        }
        const lobby = generateLobbyView($lobbyUpdate.value);
        const { challengee } = lobby;
        socket.emit("joinLobbySender", { lobby });
        io.to($playerHost.socketId).emit("joinLobbyReceiver", { challengee });
    });
};

const joinQueue = (socket, error) => {
    const { players } = mongo;
    const socketId = socket.id;
    socket.on("joinQueue", async (params) => {
        const { queueId } = params;
        if (!(queueId in QueueId) || queueId === QueueId.NONE) {
            return error("Invalid queue selected.");
        }
        const $player = await players.findOne({ socketId });
        if (!$player) {
            return error("Player not found.");
        }
        if ($player.queueId) {
            return error("You are already in a queue.");
        }
        if ($player.lobbyId) {
            return error("Can't join queue while in lobby.");
        }
        if ($player.gameId) {
            return error("Can't join queue while in game.");
        }
        if ($player.gamePopupId) {
            return error("Can't join queue while in game popup.");
        }
        const { name, level, elo } = $player;
        if (queueId === QueueId.CASUAL) {
            joinCasualQueue(name, level);
        }
        else if (queueId === QueueId.RANKED) {
            joinRankedQueue(name, elo);
        }
        const $playerUpdate = await players.updateOne({ socketId }, {
            $set: {
                status: PlayerStatus.IN_QUEUE,
                queueId
            }
        });
        if (!$playerUpdate.modifiedCount) {
            return error("Error updating player.");
        }
        socket.emit("joinQueue", { queueId });
    });
};

const leaveLobby = (socket, error) => {
    const socketId = socket.id;
    const { lobbies, players } = mongo;
    const { io } = server;
    socket.on("leaveLobby", async () => {
        const $player = await players.findOne({ socketId });
        if (!$player) {
            return error("Player not found.");
        }
        if (!$player.lobbyId) {
            return error("You are not in a lobby.");
        }
        const id = $player.lobbyId;
        const $lobby = await lobbies.findOne({ id });
        if (!$lobby) {
            return error("Lobby not found.");
        }
        if ($lobby.host.name === $player.name) {
            return error("Lobby host can't leave lobby.");
        }
        const [$lobbyUpdate, $playerUpdate, $playerHost] = await Promise.all([
            lobbies.updateOne({ id }, {
                $set: {
                    challengee: {
                        name: "",
                        avatarId: 0
                    }
                }
            }),
            players.updateOne({ socketId }, {
                $set: {
                    lobbyId: 0,
                    status: PlayerStatus.ONLINE
                }
            }),
            players.findOne({
                name: $lobby.host.name
            })
        ]);
        if (!$lobbyUpdate.modifiedCount) {
            return error("Error updating lobby.");
        }
        if (!$playerUpdate.modifiedCount) {
            return error("Error updating player.");
        }
        if (!$playerHost) {
            return error("Lobby host not found.");
        }
        socket.emit("leaveLobbySender");
        io.to($playerHost.socketId).emit("leaveLobbyReceiver");
    });
};

const leaveQueue = (socket, error) => {
    const socketId = socket.id;
    socket.on("leaveQueue", async () => {
        const $player = await mongo.players.findOne({ socketId });
        if (!$player) {
            return error("Player not found.");
        }
        if (!$player.queueId) {
            return error("You are not in a queue.");
        }
        const { name } = $player;
        if ($player.queueId === QueueId.CASUAL) {
            leaveCasualQueue(name);
        }
        else if ($player.queueId === QueueId.RANKED) {
            leaveRankedQueue(name);
        }
        socket.emit("leaveQueue");
    });
};

const saveDeck = (socket, error) => {
    const socketId = socket.id;
    const { players } = mongo;
    socket.on("saveDeck", async (params) => {
        const { deck } = params;
        if (deck.name.length >= 12) {
            return error("Maximum 12 characters length allowed for deck name.");
        }
        if (deck.klass < 1 || deck.klass > 4) { // prevent decimals?
            return error("Invalid class.");
        }
        const $player = await players.findOne({ socketId });
        if (!$player) {
            return error("Player not found, try relogging.");
        }
        for (const deckCard of deck.cards) {
            const card = cards.find((card) => card.id === deckCard.id);
            if (!card) {
                return error("One of the cards in your deck is invalid.");
            }
            if (card.type === CardType.HERO) {
                return error("Can't add Hero as a deck card.");
            }
            if (deckCard.amount > 2 || deckCard.amount < 1) { // prevent decimals?
                return error("Invalid amount of same cards added.");
            }
        }
        const totalCards = deck.cards.reduce((acc, { amount }) => acc += amount, 0);
        if (totalCards !== 30) {
            return error("Invalid number of cards, should be 30.");
        }
        const $playerUpdate = await players.updateOne({
            socketId,
            "decks.id": $player.deckId
        }, {
            $set: {
                "decks.$": deck
            }
        });
        if (!$playerUpdate.modifiedCount) {
            return error("Error saving deck (Most likely you made no changes to it).");
        }
        socket.emit("notification", "Deck saved successfully.");
    });
};

const selectDeck = (socket, error) => {
    const socketId = socket.id;
    const { players } = mongo;
    socket.on("selectDeck", async (params) => {
        const { deckId } = params;
        if (deckId < 0 || deckId > 3) {
            return error("Invalid deck range.");
        }
        const $playerUpdate = await players.updateOne({ socketId }, {
            $set: { deckId }
        });
        if (!$playerUpdate.modifiedCount) {
            return error("Failed to set deck id.");
        }
        socket.emit("selectDeck", { deckId });
    });
};

const selectSkin = (socket, error) => {
    const socketId = socket.id;
    const { accounts, players } = mongo;
    socket.on("selectSkin", async (params) => {
        const $player = await players.findOne({ socketId });
        if (!$player) {
            return error("Player not found.");
        }
        const { name } = $player;
        const $account = await accounts.findOne({ name });
        if (!$account) {
            return error("Account not found.");
        }
        const { id } = params;
        const item = items.find((item) => item.id === id);
        if (!item || item.type !== 2) { // 2 === skin, make ItemType enum?
            return error("Selected item isn't a skin.");
        }
        const balance = await contracts.skins.balanceOf($account.publicKey, id);
        if (balance.lte(0)) {
            return error("You do not own the skin.");
        }
        const $playerUpdate = await players.updateOne({
            socketId,
            "skins.cardId": item.cardId
        }, {
            $set: {
                "skins.$": { cardId: item.cardId, skinId: id }
            }
        });
        if (!$playerUpdate.modifiedCount) {
            // most likely failed because skins.$ object not found, in that case add
            // it instead.
            const $playerUpdate2 = await players.updateOne({ socketId }, {
                $addToSet: {
                    skins: { cardId: item.cardId, skinId: id }
                }
            });
            if (!$playerUpdate2) {
                return error("Failed to set the skin.");
            }
        }
        socket.emit("selectSkin", {
            cardId: item.cardId,
            skinId: id
        });
    });
};

const startCustomGame = (socket, error) => {
    const socketId = socket.id;
    const { lobbies, players } = mongo;
    socket.on("startCustomGame", async () => {
        const $player = await players.findOne({ socketId });
        if (!$player) {
            return error("Player not found, please relog.");
        }
        if (!$player.lobbyId) {
            return error("You are not in a lobby.");
        }
        const id = $player.lobbyId;
        const $lobby = await lobbies.findOne({ id });
        if (!$lobby) {
            return error("Lobby not found.");
        }
        if ($player.name !== $lobby.host.name) {
            return error("You are not the host.");
        }
        const $lobbyDelete = await lobbies.deleteOne({ id });
        if (!$lobbyDelete.deletedCount) {
            return error("Failed to delete lobby.");
        }
        const { host, challengee } = $lobby;
        await gameEngine.startGame($lobby.id, GameType.CUSTOM, host.name, challengee.name);
    });
};

const client = [
    acceptGame,
    closeLobby,
    createLobby,
    declineGame,
    defaultSkin,
    finishTutorial,
    getLeaderboards,
    joinLobby,
    joinQueue,
    leaveLobby,
    leaveQueue,
    saveDeck,
    selectDeck,
    selectSkin,
    startCustomGame
];

const attackHero = (socket, error) => {
    const socketId = socket.id;
    const { triggerEffect } = gameEngine;
    socket.on("attackHero", async (params) => {
        const [getGameData, getGameError] = await gameEngine.getGame(socketId);
        if (!getGameData) {
            return error(getGameError);
        }
        const { attacker } = params;
        const { $game, player, opponent } = getGameData;
        const playerMinion = player.minion[attacker];
        const opponentHero = opponent.hero;
        if (!playerMinion) {
            return;
        }
        const multiStrikeBuff = playerMinion.buffs.find((buff) => buff.id === EffectId.BLAZE);
        if (!playerMinion.canAttack) {
            if (multiStrikeBuff && !multiStrikeBuff.data.hasAtacked) {
                multiStrikeBuff.data.hasAttacked = true;
            }
            else {
                return error("This card can't attack anymore this turn.");
            }
        }
        else {
            playerMinion.canAttack = false;
        }
        const { trap } = opponent;
        if (trap && trap.effect === EffectId.MIRRORS_EDGE) {
            triggerEffect.mirrorsEdge({
                player,
                opponent,
                minion: playerMinion,
                trap
            });
            if (await gameEngine.isGameOver($game)) {
                return;
            }
        }
        if (trap && trap.effect === EffectId.RETRIBUTION) {
            gameEngine.triggerEffect.retribution({ player, field: attacker });
        }
        if (trap && trap.effect === EffectId.FROSTBITE) {
            gameEngine.triggerEffect.frostbite({ minion: playerMinion, player: opponent, trap: trap });
        }
        if (trap && trap.effect === EffectId.RUSTY_NEEDLE) {
            gameEngine.insertDebuff(playerMinion, EffectId.NEUROTOXIN);
        }
        if (trap && trap.effect === EffectId.NOXIOUS_FUMES) {
            const field = attacker;
            triggerEffect.noxiousFumes({ opponent: player, minion: playerMinion, field });
        }
        if (trap && trap.effect === EffectId.EXPLOSIVE) {
            const field = attacker;
            triggerEffect.explosive({ player, opponent, trap, field });
        }
        if (playerMinion.health && playerMinion.buffs.find((buff) => buff.id === EffectId.CORROSIVE_TOUCH)) {
            gameEngine.triggerEffect.corrosiveTouch({ opponent });
        }
        if (playerMinion.health && playerMinion.buffs.find((buff) => buff.id === EffectId.RAMPAGE)) {
            triggerEffect.rampage({ minion: playerMinion });
        }
        if (playerMinion.health && playerMinion.buffs.find((buff) => buff.id === EffectId.BACKSTAB)) {
            triggerEffect.backstab({ opponent, minion: playerMinion });
        }
        opponentHero.health -= playerMinion.damage;
        if (await gameEngine.isGameOver($game)) {
            return;
        }
        await gameEngine.saveGame($game);
    });
};

const attackMinion = (socket, error) => {
    const socketId = socket.id;
    const { triggerEffect } = gameEngine;
    socket.on("attackMinion", async (params) => {
        const [getGameData, getGameError] = await gameEngine.getGame(socketId);
        if (!getGameData) {
            return error(getGameError);
        }
        const { attacked, attacker } = params;
        const { $game, player, opponent } = getGameData;
        const playerMinion = player.minion[attacker];
        const opponentMinion = opponent.minion[attacked];
        const animate = []; // push sequences and emit with saveGame, loop animate on frontend, play all animations, and overwrite game state.
        if (!playerMinion) {
            return error("Players minion not found.");
        }
        if (!opponentMinion) {
            return error("Opponents minion not found.");
        }
        // check if any of the opposing minions has Taunt, and whether the player minion has Marksmanship
        // return error if not
        if (opponentMinion.buffs.find((buff) => buff.id === EffectId.STEALTH) &&
            !playerMinion.buffs.find((buff) => buff.id === EffectId.SHADOWSTRIKE)) {
            return error("Can't attack minion with stealth.");
        }
        const multiStrikeBuff = playerMinion.buffs.find((buff) => buff.id === EffectId.BLAZE);
        if (!playerMinion.canAttack) {
            if (multiStrikeBuff && !multiStrikeBuff.data.hasAtacked) {
                multiStrikeBuff.data.hasAttacked = true;
            }
            else {
                return error("This card can't attack anymore this turn.");
            }
        }
        else {
            playerMinion.canAttack = false;
        }
        if (opponent.trap && opponent.trap.effect === EffectId.MIRRORS_EDGE) {
            triggerEffect.mirrorsEdge({
                player,
                opponent,
                minion: playerMinion,
                trap: opponent.trap
            });
            animate.push({
                type: 1,
                field: "hero",
                damage: playerMinion.damage
            });
            if (await gameEngine.isGameOver($game)) {
                return;
            }
        }
        let ricochetData = [];
        if (opponent.trap && opponent.trap.effect === EffectId.RICOCHET) {
            ricochetData = triggerEffect.ricochet({
                player,
                opponent,
                minionCard: playerMinion,
                trapCard: opponent.trap
            });
        }
        if (opponent.trap && opponent.trap.effect === EffectId.FROSTBITE) {
            gameEngine.triggerEffect.frostbite({ minion: playerMinion, player: opponent, trap: opponent.trap });
            animate.push({
                type: 0,
                field: attacker,
                text: "+Frostbite"
            });
        }
        if (opponent.trap && opponent.trap.effect === EffectId.RUSTY_NEEDLE) {
            insertDebuff(playerMinion, EffectId.NEUROTOXIN);
        }
        if (opponent.trap && opponent.trap.effect === EffectId.NOXIOUS_FUMES) {
            triggerEffect.noxiousFumes({ opponent: player, minion: playerMinion, field: attacker });
        }
        if (opponent.trap && opponent.trap.effect === EffectId.EXPLOSIVE) {
            triggerEffect.explosive({ player, opponent, trap: opponent.trap, field: attacker });
        }
        if (opponent.trap && opponent.trap.effect === EffectId.CONSTRICTION) {
            triggerEffect.constriction({ player, opponent, trap: opponent.trap, minion: playerMinion });
        }
        // remove this?
        const attackerDamage = playerMinion.damage;
        const attackedDamage = opponentMinion.damage;
        if (playerMinion.buffs.find((buff) => buff.id === EffectId.POISONOUS_TOUCH)) {
            gameEngine.insertDebuff(opponentMinion, EffectId.NEUROTOXIN);
        }
        if (playerMinion.buffs.find((buff) => buff.id === EffectId.CORROSIVE_TOUCH)) {
            gameEngine.triggerEffect.corrosiveTouch({ opponent });
            if (await gameEngine.isGameOver($game)) {
                return;
            }
        }
        if (playerMinion.buffs.find((buff) => buff.id === EffectId.OVERPOWER)) {
            if (playerMinion.damage > opponentMinion.health) {
                gameEngine.triggerEffect.overpower({ opponent, damage: playerMinion.damage - opponentMinion.health });
                if (await gameEngine.isGameOver($game)) {
                    return;
                }
            }
        }
        if (opponentMinion.buffs.find((buff) => buff.id === EffectId.POISONOUS_TOUCH)) {
            gameEngine.insertDebuff(playerMinion, EffectId.NEUROTOXIN);
        }
        if (opponentMinion.buffs.find((buff) => buff.id === EffectId.CORROSIVE_TOUCH)) {
            gameEngine.triggerEffect.corrosiveTouch({ opponent: player });
            if (await gameEngine.isGameOver($game)) {
                return;
            }
        }
        if (opponentMinion.buffs.find((buff) => buff.id === EffectId.OVERPOWER)) {
            if (opponentMinion.damage > playerMinion.health) {
                gameEngine.triggerEffect.overpower({ opponent, damage: opponentMinion.damage - playerMinion.health });
                if (await gameEngine.isGameOver($game)) {
                    return;
                }
            }
        }
        deductHealth(player, opponent, playerMinion, opponentMinion);
        animate.push({
            type: 1,
            field: attacked,
            damage: playerMinion.damage
        });
        if (ricochetData.length && ricochetData[0] !== true) {
            deductHealth(player, opponent, opponentMinion, playerMinion);
            animate.push({
                type: 1,
                field: attacker,
                damage: opponentMinion.damage
            });
        }
        if (playerMinion.health <= 0 || (playerMinion.health === 1 && opponentMinion.buffs.find((buff) => buff.id === EffectId.EXECUTE))) {
            if (player.trap && player.trap.effect === EffectId.LAST_STAND) {
                gameEngine.triggerEffect.lastStand({ minion: playerMinion, opponent: player, trap: player.trap });
            }
            else {
                const hasAcidicDeathBuff = playerMinion.buffs.find((buff) => buff.id === EffectId.ACIDIC_DEATH);
                const hasSelfDescturctDebuff = playerMinion.debuffs.find((debuff) => debuff.id === EffectId.SELF_DESTRUCT);
                if (player.trap && player.trap.effect === EffectId.REFLECTION) {
                    gameEngine.triggerEffect.reflection({ player, opponent, trap: player.trap });
                }
                gameEngine.moveToGraveyard(player, playerMinion, attacker);
                if (hasSelfDescturctDebuff) {
                    gameEngine.triggerEffect.selfDestruct({ player });
                    if (await gameEngine.isGameOver($game)) {
                        return;
                    }
                }
                if (hasAcidicDeathBuff) {
                    triggerEffect.acidicDeath({ player, opponent });
                }
                Object.keys(player.minion).forEach((key) => {
                    const minion = player.minion[key];
                    if (!minion) {
                        return;
                    }
                    if (minion.buffs.find((buff) => buff.id === EffectId.RISING_FURY)) {
                        gameEngine.triggerEffect.risingFury({ minionCard: minion });
                    }
                    if (minion.buffs.find((buff) => buff.id === EffectId.SACRIFICE)) {
                        if (playerMinion.klass === CardKlass.LIQUID) {
                            const minion = getRandomMinion(player);
                            if (!minion) {
                                return;
                            }
                            minion.health += 3;
                        }
                    }
                });
            }
        }
        else {
            if (playerMinion.buffs.find((buff) => buff.id === EffectId.RAMPAGE)) {
                triggerEffect.rampage({ minion: playerMinion });
            }
        }
        if (opponentMinion.health <= 0 || (opponentMinion.health === 1 && playerMinion.buffs.find((buff) => buff.id === EffectId.EXECUTE))) {
            if (opponent.trap && opponent.trap.effect === EffectId.LAST_STAND) {
                gameEngine.triggerEffect.lastStand({ minion: opponentMinion, opponent, trap: opponent.trap });
            }
            else {
                const hasAcidicDeathBuff = playerMinion.buffs.find((buff) => buff.id === EffectId.ACIDIC_DEATH);
                const hasSelfDescturctDebuff = playerMinion.debuffs.find((debuff) => debuff.id === EffectId.SELF_DESTRUCT);
                if (opponent.trap && opponent.trap.effect === EffectId.REFLECTION) {
                    gameEngine.triggerEffect.reflection({ player: opponent, opponent: player, trap: opponent.trap });
                }
                gameEngine.moveToGraveyard(opponent, opponentMinion, attacked);
                if (hasSelfDescturctDebuff) {
                    gameEngine.triggerEffect.selfDestruct({ player });
                    if (await gameEngine.isGameOver($game)) {
                        return;
                    }
                }
                if (hasAcidicDeathBuff) {
                    triggerEffect.acidicDeath({ player, opponent });
                }
            }
            Object.keys(opponent.minion).forEach((key) => {
                const minion = opponent.minion[key];
                if (!minion) {
                    return;
                }
                if (minion.buffs.find((buff) => buff.id === EffectId.RISING_FURY)) {
                    gameEngine.triggerEffect.risingFury({ minionCard: minion });
                }
                if (minion.buffs.find((buff) => buff.id === EffectId.SACRIFICE)) {
                    if (opponentMinion.klass === CardKlass.LIQUID) {
                        const minion = getRandomMinion(opponent);
                        if (!minion) {
                            return;
                        }
                        minion.health += 3;
                    }
                }
            });
        }
        else {
            if (opponentMinion.buffs.find((buff) => buff.id === EffectId.RAMPAGE)) {
                triggerEffect.rampage({ minion: opponentMinion });
            }
        }
        // await gameEngine.floatingText($game, player.name, attacked, attacker, opponentMinion.damage, playerMinion.damage);
        // $game.battleLogs.push(attacked, attacker, playerMinion.id, opponentMinion.id);
        await gameEngine.attackMinionSave($game, player.name, attacker, attacked, attackerDamage, attackedDamage);
    });
};

const endTurn = (socket, error) => {
    const socketId = socket.id;
    socket.on("endTurn", async () => {
        const [getGameData, getGameError] = await gameEngine.getGame(socketId);
        if (!getGameData) {
            return error(getGameError);
        }
        const { $game, player, opponent } = getGameData;
        await gameEngine.drawCard($game, player, opponent);
        player.hero.mana = 10;
        const playerMinionFields = Object.keys(player.minion);
        playerMinionFields.forEach((field) => {
            const minion = player.minion[field];
            if (!minion) {
                return;
            }
            minion.canAttack = true;
            gameEngine.triggerEffect.blaze({ minion });
            if (minion.buffs.find((buff) => buff.id === EffectId.REGENERATION)) {
                gameEngine.triggerEffect.regeneration({ player });
            }
        });
        $game.currentPlayer = opponent.name;
        $game.currentTurn += 1;
        await gameEngine.saveGame($game);
    });
};

const playMagic = (socket, error) => {
    const socketId = socket.id;
    const { triggerEffect } = gameEngine;
    socket.on("playMagic", async (params) => {
        const [getGameData, getGameError] = await gameEngine.getGame(socketId);
        if (!getGameData) {
            return error(getGameError);
        }
        const { gid, field, target } = params;
        const { $game, player, opponent } = getGameData;
        if (field && opponent.minion[field]?.buffs.find((buff) => buff.id === EffectId.ELUSIVE)) {
            return error("Selected minion has Elusive buff.");
        }
        const card = player.hand.find((card) => card.gid === gid);
        if (!card) {
            return error("Card not found in hand.");
        }
        if (card.type !== CardType.MAGIC) {
            return error("Selected card is not Magic.");
        }
        if (card.manaCost > player.hero.mana) {
            return error("Not enough mana.");
        }
        player.hero.mana -= card.manaCost;
        player.hand.splice(player.hand.indexOf(card), 1);
        player.graveyard.push(card);
        const { trap } = opponent;
        if (trap && trap.effect === EffectId.SILENCE) {
            triggerEffect.silence({ opponent, trap });
        }
        else {
            if (card.effect === EffectId.REBIRTH) {
                const [success, message] = triggerEffect.rebirth({ player, target, field });
                if (!success) {
                    return error(message);
                }
            }
            if (card.effect === EffectId.DIMINISH) {
                const [success, message] = triggerEffect.diminish({ opponent, field });
                if (!success) {
                    return error(message);
                }
            }
            if (card.effect === EffectId.RELOAD) {
                triggerEffect.reload({ player });
            }
            if (card.effect === EffectId.VALOR) {
                const [success, message] = triggerEffect.valor({ opponent });
                if (!success) {
                    return error(message);
                }
                else {
                    if (await gameEngine.isGameOver($game)) {
                        return;
                    }
                }
            }
            if (card.effect === EffectId.SHELL) {
                const [success, message] = triggerEffect.shell({ player });
                if (!success) {
                    return error(message);
                }
            }
            if (card.effect === EffectId.FORTITUDE) {
                const [success, message] = triggerEffect.fortitude({ player, field });
                if (!success) {
                    return error(message);
                }
            }
            if (card.effect === EffectId.ELECTRO_SHOCK) {
                const [success, message] = triggerEffect.electroShock({ player, opponent });
                if (!success) {
                    return error(message);
                }
            }
            if (card.effect === EffectId.CLEANSE) {
                const [success, message] = triggerEffect.cleanse({ player, field });
                if (!success) {
                    return error(message);
                }
            }
            if (card.effect === EffectId.TIDAL_WAVE) {
                const [success, message] = triggerEffect.tidalWave({ player });
                if (!success) {
                    return error(message);
                }
            }
            if (card.effect === EffectId.ACID_RAIN) {
                const [success, message] = triggerEffect.acidRain({ opponent });
                if (!success) {
                    return error(message);
                }
            }
            if (card.effect === EffectId.SMOKE_BOMB) {
                const [success, message] = triggerEffect.smokeBomb({ player });
                if (!success) {
                    return error(message);
                }
            }
            if (card.effect === EffectId.CONTAMINATED_AIR) {
                const [success, message] = triggerEffect.contaminatedAir({ player, opponent });
                if (!success) {
                    return error(message);
                }
            }
            if (card.effect === EffectId.IGNITE) {
                const [success, message] = triggerEffect.ignite({ player, opponent, field });
                if (!success) {
                    return error(message);
                }
            }
            if (card.effect === EffectId.CORRUPTION) {
                const [success, message] = triggerEffect.corruption({ player, field });
                if (!success) {
                    return error(message);
                }
            }
            if (card.effect === EffectId.HYSTERIA) {
                const [success, message] = triggerEffect.hysteria({ player, field });
                if (!success) {
                    return error(message);
                }
            }
        }
        await gameEngine.animateMagicTrigger($game, player.name, card);
        $game.gameLogs.push({
            type: LogType.MAGIC,
            player: player.name,
            magicId: card.id
        });
        await gameEngine.saveGame($game);
    });
};

const playMinion = (socket, error) => {
    const socketId = socket.id;
    const { triggerEffect } = gameEngine;
    socket.on("playMinion", async (params) => {
        const [getGameData, getGameError] = await gameEngine.getGame(socketId);
        if (!getGameData) {
            return error(getGameError);
        }
        const { $game, player, opponent } = getGameData;
        const { field, gid } = params;
        if (player.minion[field]) {
            return error("Field already inhibits a Minion.");
        }
        const card = player.hand.find((card) => card.gid === gid);
        if (!card) {
            return error("Card not found in hand.");
        }
        if (card.type !== CardType.MINION) {
            return error("Selected card is not Minion.");
        }
        if (card.manaCost > player.hero.mana) {
            return error("Not enough mana.");
        }
        player.hero.mana -= card.manaCost;
        player.minion[field] = card;
        const minion = player.minion[field];
        if (!minion) {
            return error("Error summoning card.");
        }
        player.hand.splice(player.hand.indexOf(card), 1);
        const { trap } = opponent;
        const isElusive = minion.effect === EffectId.ELUSIVE;
        // Step 1: Insert buffs / debuffs
        // Step 2: Check for on summon trap cards
        // Step 3: Trigger on summon effects
        switch (minion.effect) {
            case EffectId.BLAZE:
                const hasAttackedTwice = true;
                gameEngine.insertBuff(minion, EffectId.BLAZE, { hasAttackedTwice });
                break;
        }
        if (trap && !isElusive) {
            switch (trap.effect) {
                case EffectId.SMITE:
                    triggerEffect.smite({ player, opponent, minion, trap, field });
                    break;
                case EffectId.BANISH:
                    triggerEffect.banish({ player, opponent, minion, trap, field });
                    break;
                case EffectId.POISONED_GROUND:
                    triggerEffect.poisonedGround({ player: opponent, minion, trap });
                    break;
            }
        }
        else {
            switch (minion.effect) {
                // ---------- [ N E U T R A L ] ----------
                case EffectId.SHADOW_SURGE:
                    triggerEffect.shadowSurge({ minion });
                    break;
                case EffectId.QUICK_SHOT:
                    triggerEffect.quickShot({ opponent });
                    break;
                case EffectId.NECROMANCY:
                    gameEngine.insertDebuff(minion, EffectId.NECROMANCY, {
                        health: -2,
                        damage: -2
                    });
                    const isPositive = false;
                    triggerEffect.necromancy({ minion, isPositive });
                    break;
                case EffectId.ELUSIVE:
                    gameEngine.insertBuff(minion, EffectId.ELUSIVE);
                    break;
                case EffectId.REVENGE:
                    gameEngine.insertBuff(minion, EffectId.REVENGE);
                    break;
                // ---------- [ S O L I D ] ----------
                case EffectId.GLORY:
                    triggerEffect.glory({ opponent, minion });
                    break;
                case EffectId.UNITY:
                    gameEngine.insertBuff(minion, EffectId.UNITY);
                    break;
                case EffectId.SPELLWEAVE:
                    triggerEffect.spellweave({ player, minion });
                    break;
                case EffectId.SHIELDWALL:
                    triggerEffect.shieldwall({ player, field });
                    break;
                case EffectId.UNBREAKABLE:
                    gameEngine.insertBuff(minion, EffectId.UNBREAKABLE);
                    break;
                case EffectId.PROTECTOR:
                    gameEngine.insertBuff(minion, EffectId.TAUNT);
                    break;
                // ---------- [ L I Q U I D ] ----------
                case EffectId.RISING_FURY:
                    gameEngine.insertBuff(minion, EffectId.RISING_FURY);
                    break;
                case EffectId.REGENERATION:
                    gameEngine.insertBuff(minion, EffectId.REGENERATION);
                    break;
                case EffectId.SACRIFICE:
                    gameEngine.insertBuff(minion, EffectId.SACRIFICE);
                    break;
                case EffectId.SHADOWSTRIKE:
                    gameEngine.insertBuff(minion, EffectId.SHADOWSTRIKE);
                    break;
                case EffectId.LEECH:
                    gameEngine.insertBuff(minion, EffectId.LEECH);
                    break;
                case EffectId.RESILIENT:
                    gameEngine.insertBuff(minion, EffectId.RESILIENT);
                    break;
                // ---------- [ G A S ] ----------
                case EffectId.ACIDIC_DEATH:
                    gameEngine.insertBuff(minion, EffectId.ACIDIC_DEATH);
                    break;
                case EffectId.STEALTH:
                    gameEngine.insertBuff(minion, EffectId.STEALTH);
                    break;
                case EffectId.POISONOUS_TOUCH:
                    gameEngine.insertBuff(minion, EffectId.POISONOUS_TOUCH);
                    break;
                case EffectId.TOXIC_SPRAY:
                    triggerEffect.toxicSpray({ opponent });
                    break;
                case EffectId.CORROSIVE_TOUCH:
                    gameEngine.insertBuff(minion, EffectId.CORROSIVE_TOUCH);
                    break;
                case EffectId.TOXIC_GAS:
                    triggerEffect.toxicGas({ opponent });
                    break;
                // ---------- [ P L A S M A ] ----------
                case EffectId.SELF_DESTRUCT:
                    gameEngine.insertBuff(minion, EffectId.SELF_DESTRUCT);
                    break;
                case EffectId.RAMPAGE:
                    gameEngine.insertBuff(minion, EffectId.RAMPAGE);
                    break;
                case EffectId.BACKSTAB:
                    gameEngine.insertBuff(minion, EffectId.BACKSTAB);
                    break;
                case EffectId.MARKSMANSHIP:
                    gameEngine.insertBuff(minion, EffectId.MARKSMANSHIP);
                    break;
                case EffectId.OVERPOWER:
                    gameEngine.insertBuff(minion, EffectId.OVERPOWER);
                    break;
                case EffectId.EXECUTE:
                    gameEngine.insertBuff(minion, EffectId.EXECUTE);
                    break;
                default:
                    return error("Effect not found.");
            }
        }
        $game.gameLogs.push({
            type: LogType.SUMMON,
            field,
            player: player.name,
            minionId: minion.id
        });
        await gameEngine.saveGame($game);
    });
};

const playTrap = (socket, error) => {
    const socketId = socket.id;
    socket.on("playTrap", async (params) => {
        const [getGameData, getGameError] = await gameEngine.getGame(socketId);
        if (!getGameData) {
            return error(getGameError);
        }
        const { $game, player } = getGameData;
        const { gid } = params;
        if (player.trap) {
            return error("Trap Card is already set.");
        }
        const card = player.hand.find((card) => card.gid === gid);
        if (!card) {
            return error("Card not found in hand.");
        }
        if (card.type !== CardType.TRAP) {
            return error("Selected card is not Trap.");
        }
        if (card.manaCost > player.hero.mana) {
            return error("Not enough mana.");
        }
        player.hero.mana -= card.manaCost;
        player.hand.splice(player.hand.indexOf(card), 1);
        player.trap = card;
        await gameEngine.saveGame($game);
    });
};

const game = [
    attackHero,
    attackMinion,
    endTurn,
    playMagic,
    playMinion,
    playTrap
];

const acceptFriend = (socket, error) => {
    const socketId = socket.id;
    const { accounts, chats, players } = mongo;
    const { io } = server;
    socket.on("acceptFriend", async (params) => {
        const { name } = params;
        const [$playerSender, $playerReceiver] = await Promise.all([
            players.findOne({ socketId }),
            players.findOne({ name })
        ]);
        if (!$playerSender) {
            return error("Player sender not found.");
        }
        if (!$playerReceiver) {
            return error("Player receiver not found.");
        }
        const [$accountSender, $accountReceiver, $chatInsert] = await Promise.all([
            accounts.findOneAndUpdate({
                name: $playerSender.name
            }, {
                $pull: {
                    "social.requests": name
                },
                $push: {
                    "social.friends": name
                }
            }, {
                returnDocument: "after"
            }),
            accounts.findOneAndUpdate({ name }, {
                $push: {
                    "social.friends": $playerSender.name
                }
            }, {
                returnDocument: "after"
            }),
            chats.insertOne({
                players: [$playerSender.name, $playerReceiver.name],
                messages: []
            })
        ]);
        if (!$accountSender.value) {
            return error("Account sender not found.");
        }
        if (!$accountReceiver.value) {
            return error("Account receiver not found.");
        }
        if (!$chatInsert.insertedId) {
            return error("Failed to insert chat.");
        }
        socket.emit("acceptFriendSender", {
            name: $playerReceiver.name,
            avatarId: $accountReceiver.value.avatarId,
            status: $playerReceiver.status
        });
        io.to($playerReceiver.socketId).emit("acceptFriendReceiver", {
            name: $playerSender.name,
            avatarId: $accountSender.value.avatarId,
            status: $playerSender.status
        });
    });
};

const addFriend = (socket, error) => {
    const socketId = socket.id;
    const { accounts, players } = mongo;
    const { io } = server;
    socket.on("addFriend", async (params) => {
        const { name } = params;
        const [$playerSender, $playerReceiver] = await Promise.all([
            players.findOne({ socketId }),
            players.findOne({ name })
        ]);
        if (!$playerSender) {
            return error("Player sender not found.");
        }
        if (!$playerReceiver) {
            return error("Player receiver not found.");
        }
        const [$accountSender, $accountReceiver] = await Promise.all([
            accounts.findOne({ name: $playerSender.name }),
            accounts.findOne({ name: $playerReceiver.name })
        ]);
        if (!$accountSender) {
            return error("Account sender not found.");
        }
        if (!$accountReceiver) {
            return error("Account receiver not found.");
        }
        if ($accountSender.name === name) {
            return error("You can't add yourself as a friend.");
        }
        if ($accountReceiver.social.blocked.includes($accountSender.name)) {
            return error("This player has blocked you.");
        }
        if ($accountSender.social.blocked.includes(name)) {
            return error("You have blocked this player.");
        }
        if ($accountReceiver.social.requests.includes($accountSender.name)) {
            return error("You have already sent the request to this player.");
        }
        if ($accountSender.social.requests.includes(name)) {
            return error("This player has already sent you the request.");
        }
        if ($accountSender.social.friends.includes(name)) {
            return error("This player is already your friend.");
        }
        const $playerUpdate = await accounts.updateOne({ name }, {
            $push: {
                "social.requests": $accountSender.name
            }
        });
        if (!$playerUpdate.modifiedCount) {
            return error("Error updating player.");
        }
        socket.emit("notification", "Friend request sent.");
        io.to($playerReceiver.socketId).emit("addFriend", {
            name: $accountSender.name
        });
    });
};

const blockFriend = (socket, error) => {
    const socketId = socket.id;
    const { accounts, chats, players } = mongo;
    const { io } = server;
    socket.on("blockFriend", async (params) => {
        const { name } = params;
        const [$playerSender, $playerReceiver] = await Promise.all([
            players.findOne({ socketId }),
            players.findOne({ name })
        ]);
        if (!$playerSender) {
            return error("Player sender not found.");
        }
        if (!$playerReceiver) {
            return error("Player receiver not found.");
        }
        const [$accountSenderUpdate, $accountReceiverUpdate, $chatDelete] = await Promise.all([
            accounts.updateOne({
                name: $playerSender.name
            }, {
                $pull: {
                    "social.friends": $playerReceiver.name
                },
                $push: {
                    "social.blocked": $playerReceiver.name
                }
            }),
            accounts.updateOne({
                name: $playerReceiver.name
            }, {
                $pull: {
                    "social.friends": $playerSender.name
                }
            }),
            chats.deleteOne({
                players: {
                    $all: [$playerReceiver.name, $playerSender.name]
                }
            })
        ]);
        if (!$accountSenderUpdate.modifiedCount) {
            return error("Account sender not found.");
        }
        if (!$accountReceiverUpdate.modifiedCount) {
            return error("Account receiver not found.");
        }
        if (!$chatDelete.deletedCount) {
            return error("Failed to delete chat.");
        }
        socket.emit("blockFriendSender", { name });
        io.to($playerReceiver.socketId).emit("blockFriendReceiver", {
            name: $playerSender.username
        });
    });
};

const declineFriend = (socket, error) => {
    const socketId = socket.id;
    const { accounts, players } = mongo;
    socket.on("declineFriend", async (params) => {
        const { name } = params;
        const $player = await players.findOne({ socketId });
        if (!$player) {
            return error("Player not found, try relogging.");
        }
        const $accountUpdate = await accounts.updateOne({
            name: $player.name
        }, {
            $pull: {
                "social.requests": name
            }
        });
        if (!$accountUpdate.modifiedCount) {
            return error("Failed to update account.");
        }
        socket.emit("declineFriend", { name });
    });
};

const removeFriend = (socket, error) => {
    const socketId = socket.id;
    const { accounts, chats, players } = mongo;
    const { io } = server;
    socket.on("removeFriend", async (params) => {
        const { name } = params;
        const [$playerSender, $playerReceiver] = await Promise.all([
            players.findOne({ socketId }),
            players.findOne({ name })
        ]);
        if (!$playerSender) {
            return error("Player sender not found.");
        }
        if (!$playerReceiver) {
            return error("Player receiver not found.");
        }
        const [$accountSenderUpdate, $accountReceiverUpdate, $chatDelete] = await Promise.all([
            accounts.findOneAndUpdate({
                name: $playerSender.name
            }, {
                $pull: {
                    "social.friends": name
                }
            }, {
                returnDocument: "after"
            }),
            accounts.findOneAndUpdate({ name }, {
                $pull: {
                    "social.friends": $playerSender.name
                }
            }, {
                returnDocument: "after"
            }),
            chats.deleteOne({
                players: {
                    $all: [name, $playerSender.name]
                }
            })
        ]);
        if (!$accountSenderUpdate.value) {
            return error("Account sender not found.");
        }
        if (!$accountReceiverUpdate.value) {
            return error("Account receiver not found.");
        }
        if (!$chatDelete.deletedCount) {
            return error("Failed to delete chat.");
        }
        socket.emit("removeFriendSender", { name });
        io.to($playerReceiver.socketId).emit("removeFriendReceiver", {
            name: $accountSenderUpdate.value.name
        });
    });
};

const sendChatMsg = (socket, error) => {
    const socketId = socket.id;
    const { accounts, players, chats } = mongo;
    const { io } = server;
    socket.on("sendChatMsg", async (params) => {
        const { receiver, text } = params;
        const [$playerSender, $playerReceiver] = await Promise.all([
            players.findOne({ socketId }),
            players.findOne({
                name: receiver
            })
        ]);
        if (!$playerSender) {
            return error("Player sender not found, try relogging.");
        }
        if (!$playerReceiver) {
            return error("Player receiver not found, try relogging.");
        }
        const $account = await accounts.findOne({
            name: $playerSender.name
        });
        if (!$account) {
            return error("Account not found.");
        }
        if (!$account.social.friends.includes(receiver)) {
            return error("This user isn't your friend.");
        }
        const date = new Date();
        const $chatUpdate = await chats.updateOne({
            players: {
                $all: [$playerSender.name, receiver]
            }
        }, {
            $push: {
                messages: {
                    name: $playerSender.name,
                    text,
                    date
                }
            } // pop first if length > 100!
        });
        if (!$chatUpdate.modifiedCount) {
            return error("Error updating chat.");
        }
        socket.emit("sendChatMsgSender", {
            sender: $playerSender.name,
            receiver,
            text,
            date
        });
        io.to($playerReceiver.socketId).emit("sendChatMsgReceiver", {
            sender: $playerSender.name,
            text,
            date
        });
    });
};

const setAvatar = (socket, error) => {
    const socketId = socket.id;
    const { accounts, players } = mongo;
    socket.on("setAvatar", async (params) => {
        const { avatarId } = params;
        if (avatarId < 0 || avatarId > 4) {
            return error("Invalid avatar.");
        }
        const $player = await players.findOne({ socketId });
        if (!$player) {
            return error("Player not found, try relogging.");
        }
        const $accountUpdate = await accounts.findOneAndUpdate({
            name: $player.name
        }, {
            $set: { avatarId }
        }, {
            returnDocument: "after"
        });
        if (!$accountUpdate.value) {
            return error("Failed to update account.");
        }
        const { name, social } = $accountUpdate.value;
        const socketIds = await getSocketIds(social.friends);
        socket.emit("setAvatarSender", { avatarId });
        server.io.to(socketIds).emit("setAvatarReceiver", { name, avatarId });
    });
};

const unblockFriend = (socket, error) => {
    const socketId = socket.id;
    const { accounts, players } = mongo;
    socket.on("unblockFriend", async (params) => {
        const { name } = params;
        const $player = await players.findOne({ socketId });
        if (!$player) {
            return error("Player not found, try relogging.");
        }
        const $accountUpdate = await accounts.updateOne({ name: $player.name }, {
            $pull: {
                "social.blocked": name
            }
        });
        if (!$accountUpdate.modifiedCount) {
            return error("Failed to update account.");
        }
        socket.emit("unblockFriend", { name });
    });
};

const updateStatus = (socket) => {
    const socketId = socket.id;
    const { accounts, players } = mongo;
    const { io } = server;
    socket.on("updateFriend", async () => {
        const $player = await players.findOne({ socketId });
        if (!$player) {
            return;
        }
        const $account = await accounts.findOne({ name: $player.name });
        if (!$account) {
            return;
        }
        const { name, status } = $player;
        const socketIds = await getSocketIds($account.social.friends);
        if (socketIds.length) {
            io.to(socketIds).emit("updateFriend", { name, status });
        }
    });
};

const sidenav = [
    acceptFriend,
    addFriend,
    blockFriend,
    declineFriend,
    removeFriend,
    sendChatMsg,
    setAvatar,
    unblockFriend,
    updateStatus
];

const requests = [...auth, ...client, ...game, ...sidenav];

process.on("unhandledRejection", (reason, promise) => {
    console.log(`Unhandled rejection: ${reason}`);
});
process.on("uncaughtException", (error, origin) => {
    console.log(`Uncaught Exception: ${error}`);
});
// maybe remove all rankedQueuePlayers, casualQueuePlayers, and gamePopups
// when restarting the server?
// put these ethereum events in separate files?
contracts.game.on("ListItem", async (seller, listingId, skinId, amount, price) => {
    const $account = await mongo.accounts.findOne({
        publicKey: seller.toLowerCase() // wtf is wrong with ethereum addresses?
    });
    if (!$account) {
        console.log("Item seller account not found, listing anyway...");
    }
    await mongo.marketItems.insertOne({
        sellerName: $account ? $account.name : "Not a player",
        sellerAddress: seller.toLowerCase(),
        listingId: utils.formatUnits(listingId, 0),
        skinId: utils.formatUnits(skinId, 0),
        amount: utils.formatUnits(amount, 0),
        price: utils.formatUnits(price, 18) // etheric crystals
    });
});
contracts.game.on("CancelItem", async (listingId) => {
    const $marketItemDelete = await mongo.marketItems.deleteOne({
        listingId: utils.formatUnits(listingId, 0)
    });
    if (!$marketItemDelete) {
        console.log(`Error deleting item ${listingId} from market`);
    }
});
contracts.game.on("BuyItem", async (listingId, amount) => {
    const $item = await mongo.marketItems.findOne({
        listingId: utils.formatUnits(listingId, 0)
    });
    if (!$item) {
        return;
    }
    const big = utils.parseUnits($item.amount, 0);
    if (big.sub(amount).lte(0)) {
        await mongo.marketItems.deleteOne({
            listingId: utils.formatUnits(listingId, 0)
        });
    }
    else {
        await mongo.marketItems.replaceOne({
            listingId: utils.formatUnits(listingId, 0)
        }, {
            ...$item,
            amount: utils.formatUnits(big.sub(amount), 0)
        });
    }
});
server.io.on("connection", (socket) => {
    const error = (msg) => {
        socket.emit("notification", msg);
        console.error(msg);
    };
    socket.on("getMarketItems", async () => {
        const items = await mongo.marketItems.find().limit(100).toArray();
        socket.emit("getMarketItems", { items });
    });
    requests.forEach((request) => {
        request(socket, error);
    });
});
server.http.listen(process.env.PORT || 4201);
//# sourceMappingURL=index.js.map
