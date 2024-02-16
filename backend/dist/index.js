import { JsonRpcProvider, Wallet, Contract, getAddress, verifyMessage, isAddress } from 'ethers';
import EthericEssence from '@som/contracts/EthericEssence/artifacts/EthericEssence.json' assert { type: 'json' };
import EthericCrystals from '@som/contracts/EthericCrystals/artifacts/EthericCrystals.json' assert { type: 'json' };
import EthericEnergy from '@som/contracts/EthericEnergy/artifacts/EthericEnergy.json' assert { type: 'json' };
import SomGame from '@som/contracts/Game/artifacts/Game.json' assert { type: 'json' };
import SomTokens from '@som/contracts/Items/artifacts/Items.json' assert { type: 'json' };
import { MongoClient } from 'mongodb';
import { createServer } from 'http';
import express from 'express';
import { Server } from 'socket.io';
import jsonwebtoken from 'jsonwebtoken';
import { EffectId, CardType, PlayerStatus, GameType, QueueId, CardKlass, LogType } from '@som/shared/enums';
import { randomInt } from 'crypto';
import { cards, cardsView } from '@som/shared/data';
import { compare, hash } from 'bcrypt';
import { schedule } from 'node-cron';
import path from 'path';

const provider = new JsonRpcProvider("https://testnet.telos.net/evm");
const signer = new Wallet("0xc5ebf1171e9f76c728795be3fb75620e9e7888404e461099f6b4b916283b540b", provider);
const keys = {
    ethericEssence: "0xDeCD7574fa58b52Dc87dDDB3BD376228D54E78a1",
    ethericCrystals: "0xf811f1AB4bfE4f58a703a0E32654a7789e7A9469",
    ethericEnergy: "0x51d94d7F370DAD3971f54baAb4911acFedbCf984",
    somTokens: "0xdF735A6a29a85E144623F8c6197b11134d4C11ae",
    somGame: "0x3BDCc313b07cAeA90Fc5323749D13F086a4b62e0"
};
const ethericEssence = new Contract(keys.ethericEssence, EthericEssence.abi, signer);
const ethericCrystals = new Contract(keys.ethericCrystals, EthericCrystals.abi, signer);
const ethericEnergy = new Contract(keys.ethericEnergy, EthericEnergy.abi, signer);
const somTokens = new Contract(keys.somTokens, SomTokens.abi, signer);
const somGame = new Contract(keys.somGame, SomGame.abi, signer);
const contracts = {
    ethericEssence,
    ethericCrystals,
    ethericEnergy,
    somTokens,
    somGame
};

const client$1 = await MongoClient.connect("mongodb://127.0.0.1:27017");
const som = client$1.db("som");
const mongo = {
    $chats: som.collection("chats"),
    $casualQueuePlayers: som.collection("casualQueuePlayers"),
    $games: som.collection("games"),
    $gamePopups: som.collection("gamePopups"),
    $lobbies: som.collection("lobbies"),
    $players: som.collection("players"),
    $rankedQueuePlayers: som.collection("rankedQueuePlayers"),
    $supplySnapshots: som.collection("supplySnapshots"),
    $leaderboards: som.collection("leaderboards"),
};

const app = express();
const http = createServer(app);
const io = new Server(http, {
    cors: {
        origin: "*"
    },
    serveClient: false,
    transports: ["websocket"],
    allowUpgrades: false
});
const server = { app, http, io };

const lastStand = (params) => {
    const { opponent, opponentMinion, opponentMinionField, opponentTrap } = params;
    const animations = [];
    opponentMinion.buffs.push({
        id: EffectId.TAUNT,
        data: {}
    });
    animations.push({
        type: "TRAP",
        name: opponent.name,
        card: opponentTrap
    });
    animations.push({
        type: "HEALTH",
        field: opponentMinionField,
        name: opponent.name,
        increment: 1 - opponentMinion.health.current
    }, {
        type: "FLOATING_TEXT",
        field: opponentMinionField,
        name: opponent.name,
        text: `Last stand`
    }, {
        type: "FLOATING_TEXT",
        field: opponentMinionField,
        name: opponent.name,
        text: `+ Taunt`
    });
    opponentMinion.health.current = 1;
    opponent.graveyard.push(opponentTrap);
    opponent.trap = undefined;
    return animations;
};

const selfDestruct = (params) => {
    params.player.field.hero.health -= 3;
    return [true, ""];
};

const revenge = (params) => {
    const { player, field } = params;
    const handCard = player.hand.find((card) => card.effect === EffectId.REVENGE);
    const deckCard = player.deck.find((card) => card.effect === EffectId.REVENGE);
    if (!handCard && !deckCard) {
        return [];
    }
    if (handCard) {
        const index = player.hand.indexOf(handCard);
        player.field[field] = handCard;
        player.hand.splice(index, 1);
    }
    else if (deckCard) {
        const index = player.deck.indexOf(deckCard);
        player.field[field] = deckCard;
        player.deck.splice(index, 1);
    }
    return [{
            type: "SUMMON",
            name: player.name,
            field,
            minion: player.field[field]
        }];
};

// remove this?
const insertBuff = (card, id, data = {}) => {
    card.buffs.push({ id, data });
    return [];
};

const unity = (params) => {
    const { player: { name, hand, deck } } = params;
    const handCard = hand.find((card) => card.effect === EffectId.UNITY);
    const deckCard = deck.find((card) => card.effect === EffectId.UNITY);
    if (handCard) {
        insertBuff(handCard, EffectId.TAUNT);
    }
    else if (deckCard) {
        insertBuff(deckCard, EffectId.TAUNT);
    }
    return [{
            type: "FLOATING_TEXT",
            name: name,
            field: "hero",
            text: "UNITY"
        }];
};

const moveToGraveyard = (player, minion, field) => {
    const hasRevengeBuff = minion.buffs.find((buff) => buff.id === EffectId.REVENGE) !== undefined;
    const hasUnityBuff = minion.buffs.find((buff) => buff.id === EffectId.UNITY) !== undefined;
    const animations = [];
    minion.health.current = minion.health.default;
    minion.damage.current = minion.damage.default;
    minion.buffs = [];
    minion.debuffs = [];
    player.graveyard.push(minion);
    player.field[field] = undefined;
    animations.push({
        type: "DEATH",
        field,
        name: player.name
    });
    if (hasRevengeBuff) {
        animations.push(...revenge({ player, field }));
    }
    if (hasUnityBuff) {
        animations.push(...unity({ player }));
    }
    return animations;
};

const heartOfSteel = (params) => {
    const { opponent, opponentMinion, opponentTrap, field } = params;
    opponentMinion.damage.current += 3;
    opponent.graveyard.push(opponentTrap);
    opponent.trap = undefined;
    return [{
            type: "TRAP",
            name: opponent.name,
            card: opponentTrap
        }, {
            type: "DAMAGE",
            field,
            name: opponent.name,
            increment: 3
        }];
};

const deductHealth = (player, minion, damage, field) => {
    const shieldBuff = minion.buffs.find((buff) => buff.id === EffectId.SHIELD);
    const animations = [];
    if (shieldBuff) { // has shield
        const amt = shieldBuff.data.amount;
        if (amt > damage) { // shield reduced
            shieldBuff.data.amount -= damage;
            animations.push({
                type: "FLOATING_TEXT",
                field: field,
                name: player.name,
                text: `-${damage} Shield`
            });
        }
        else if (amt <= damage) { // shield broken
            if (player.trap && player.trap.effect === EffectId.HEART_OF_STEEL) {
                animations.push(...heartOfSteel({ opponentMinion: minion, opponent: player, opponentTrap: player.trap, field }));
            }
            const remaining = shieldBuff.data.amount - damage;
            if (remaining < 0) {
                if (minion.buffs.find((buff) => buff.id === EffectId.RESILIENT)) {
                    minion.health.current -= 1;
                }
                else {
                    minion.health.current -= remaining;
                }
            }
            animations.push({
                type: "FLOATING_TEXT",
                field: field,
                name: player.name,
                text: `-${shieldBuff.data.amount} Shield`
            }, {
                type: "HEALTH",
                field: field,
                name: player.name,
                increment: -remaining
            });
            minion.buffs.splice(minion.buffs.indexOf(shieldBuff), 1);
        }
    }
    else { // no shield
        if (minion.buffs.find((buff) => buff.id === EffectId.RESILIENT)) {
            minion.health.current -= 1;
        }
        else {
            minion.health.current -= damage;
        }
        animations.push({
            type: "HEALTH",
            field: field,
            name: player.name,
            increment: -damage
        });
    }
    return animations;
};

const acidicDeath = (params) => {
    const { player, opponent } = params;
    const playerMinionKeys = Object.keys(player.field);
    const opponentMinionKeys = Object.keys(opponent.field);
    const animations = [];
    playerMinionKeys.forEach((key) => {
        const minion = player.field[key];
        if (!minion || minion.type === CardType.HERO) {
            return;
        }
        animations.push(...deductHealth(player, minion, 1, key));
        if (minion.health.current <= 0) {
            const { trap } = player;
            if (trap && trap.effect === EffectId.LAST_STAND) {
                animations.push(...lastStand({ minion, opponent: player, trap }));
            }
            else {
                const hasAcidicDeathBuff = minion.buffs.find((buff) => buff.id === EffectId.ACIDIC_DEATH);
                animations.push(...moveToGraveyard(player, minion, key));
                if (hasAcidicDeathBuff) {
                    animations.push(...acidicDeath({ player, opponent }));
                }
            }
        }
    });
    opponentMinionKeys.forEach((key) => {
        const minion = opponent.field[key];
        if (!minion || minion.type === CardType.HERO) {
            return;
        }
        animations.push(...deductHealth(opponent, minion, 1, key));
        if (minion.health.current <= 0) {
            const { trap } = opponent;
            if (trap && trap.effect === EffectId.LAST_STAND) {
                animations.push(...lastStand({ minion, opponent, trap }));
            }
            else {
                const hasAcidicDeathBuff = minion.buffs.find((buff) => buff.id === EffectId.ACIDIC_DEATH);
                const hasSelfDescturctDebuff = minion.debuffs.find((debuff) => debuff.id === EffectId.SELF_DESTRUCT);
                animations.push(...moveToGraveyard(opponent, minion, key));
                if (hasSelfDescturctDebuff) {
                    // check for endgame? find a better way to call onDeath effects?
                    animations.push(...selfDestruct({ player }));
                }
                if (hasAcidicDeathBuff) {
                    animations.push(...acidicDeath({ player, opponent }));
                }
            }
        }
    });
    return animations;
};

const banish = (params) => {
    const { player, opponent, playerMinion, opponentTrap, playerMinionField } = params;
    player.field[playerMinionField] = undefined;
    player.hand.push(playerMinion);
    opponent.graveyard.push(opponentTrap);
    opponent.trap = undefined;
    return [{
            type: "TRAP",
            name: opponent.name,
            card: opponentTrap
        }, {
            type: "FLOATING_TEXT",
            field: playerMinionField,
            name: player.name,
            text: "BANISH"
        }];
};

const shadowSurge = {
    onNormalSummon(params) {
        const { player, playerMinion, playerMinionField } = params;
        playerMinion.canAttack = true;
        return [{
                type: "FLOATING_TEXT",
                name: player.name,
                field: playerMinionField,
                text: "SHADOW SURGE"
            }];
    }
};

const diminish = (params) => {
    const { opponent, opponentMinion, opponentMinionField } = params;
    const animations = [];
    if (opponentMinion.damage.current > 2) {
        opponentMinion.damage.current -= 2;
        opponentMinion.debuffs.push({
            id: EffectId.DIMINISH,
            data: {
                damage: -2
            }
        });
        animations.push({
            type: "FLOATING_TEXT",
            name: opponent.name,
            field: opponentMinionField,
            text: "DIMINISH"
        }, {
            type: "DAMAGE",
            name: opponent.name,
            field: opponentMinionField,
            increment: (-2)
        });
    }
    else {
        const val = opponentMinion.damage.current;
        opponentMinion.damage.current = 0;
        opponentMinion.debuffs.push({
            id: EffectId.DIMINISH,
            data: {
                damage: -val
            }
        });
        animations.push({
            type: "FLOATING_TEXT",
            name: opponent.name,
            field: opponentMinionField,
            text: "DIMINISH"
        }, {
            type: "DAMAGE",
            name: opponent.name,
            field: opponentMinionField,
            increment: -val
        });
    }
    return animations;
};

const frostbite = (params) => {
    const { player, playerMinion, playerMinionField, opponent, opponentTrap } = params;
    playerMinion.damage = 1;
    opponent.graveyard.push(opponentTrap);
    opponent.trap = undefined;
    return [{
            type: "FLOATING_TEXT",
            field: playerMinionField,
            name: player.name,
            text: "+Frostbite",
        }];
};

const glory = (params) => {
    const { player, opponent, minion, playerMinionField } = params;
    const animations = [];
    const possibleMinions = [];
    const minionKeys = Object.keys(opponent.field);
    minionKeys.forEach((key) => {
        const Minion = opponent.field[key];
        if (Minion && Minion.type !== CardType.HERO && key !== "hero") {
            const hasElusiveBuff = Minion.buffs.find((buff) => buff.id === EffectId.ELUSIVE);
            if (!hasElusiveBuff) {
                possibleMinions.push({ Minion, key });
            }
        }
    });
    if (possibleMinions.length) {
        let randomMinion = randomInt(possibleMinions.length);
        let { Minion, key } = possibleMinions[randomMinion];
        animations.push({
            type: "FLOATING_TEXT",
            name: opponent.name,
            field: key,
            text: "GLORY"
        });
        animations.push(...deductHealth(opponent, Minion, 1, key));
        if (Minion.health.current <= 0) {
            animations.push(...moveToGraveyard(opponent, Minion, key));
            minion.buffs.push({ id: EffectId.TAUNT, data: {} });
            animations.push({
                type: "FLOATING_TEXT",
                name: player.name,
                field: playerMinionField,
                text: "TAUNT"
            });
        }
    }
    return animations;
};

const mirrorsEdge = (params) => {
    const { player, playerMinion, opponent, opponentTrap } = params;
    player.field.hero.health.current -= playerMinion.damage.current;
    opponent.graveyard.push(opponentTrap);
    opponent.trap = undefined;
    return [{
            type: "TRAP",
            name: opponent.name,
            card: opponentTrap
        }, {
            type: "FLOATING_TEXT",
            name: player.name,
            field: "hero",
            text: "MIRROR'S EDGE"
        }, {
            type: "HEALTH",
            field: "hero",
            increment: -playerMinion.damage.current,
            name: player.name
        }];
};

const risingFury = (params) => {
    const { minionCard } = params;
    minionCard.health += 1;
    minionCard.damage += 1;
    return [true, ""];
};

const blaze = (params) => {
    const { player, playerMinion, playerMinionField } = params;
    const blazeBuff = playerMinion.buffs.find((buff) => buff.id === EffectId.BLAZE);
    if (!blazeBuff) {
        return [];
    }
    blazeBuff.data.hasAttackedTwice = false;
    return [{
            type: "FLOATING_TEXT",
            field: playerMinionField,
            text: "BLAZE",
            name: player.name
        }];
};

const insertDebuff = (card, id, data = {}) => {
    card.debuffs.push({ id, data });
    return [true, "Debuff added."];
};

const necromancy = (params) => {
    const { player, playerMinion, playerMinionField, isPositive } = params;
    const animations = [];
    if (isPositive) {
        playerMinion.health.current += 2;
        playerMinion.damage.current += 2;
        insertBuff(playerMinion, EffectId.NECROMANCY, {
            health: 2,
            damage: 2
        });
        animations.push({
            type: "FLOATING_TEXT",
            field: playerMinionField,
            text: "NECROMANCY",
            name: player.name
        }, {
            type: "DAMAGE",
            name: player.name,
            field: playerMinionField,
            increment: 2
        }, {
            type: "HEALTH",
            name: player.name,
            field: playerMinionField,
            increment: 2
        });
    }
    else {
        playerMinion.health.current -= 2;
        playerMinion.damage.current -= 2;
        insertDebuff(playerMinion, EffectId.NECROMANCY, {
            health: -2,
            damage: -2
        });
        animations.push({
            type: "FLOATING_TEXT",
            field: playerMinionField,
            text: "NECROMANCY",
            name: player.name
        }, {
            type: "DAMAGE",
            name: player.name,
            field: playerMinionField,
            increment: -2
        }, {
            type: "HEALTH",
            name: player.name,
            field: playerMinionField,
            increment: -2
        });
    }
    return animations;
};

const quickShot = (params) => {
    const { opponent } = params;
    const possibleMinions = [];
    const minionKeys = Object.keys(opponent.field);
    const animations = [];
    minionKeys.forEach((key) => {
        const minion = opponent.field[key];
        if (minion && minion.type !== CardType.HERO) {
            const hasElusiveBuff = minion.buffs.find((buff) => buff.id === EffectId.ELUSIVE);
            if (!hasElusiveBuff) {
                possibleMinions.push({ minion, key });
            }
        }
    });
    if (possibleMinions.length) {
        let randomMinion = randomInt(possibleMinions.length);
        let { minion, key } = possibleMinions[randomMinion];
        animations.push({
            type: "FLOATING_TEXT",
            field: key,
            name: opponent.name,
            text: "QUICK SHOT"
        });
        animations.push(...deductHealth(opponent, minion, 2, key));
        if (minion.health.current <= 0) {
            animations.push(...moveToGraveyard(opponent, minion, key));
        }
    }
    return animations;
};

const rebirth = (params) => {
    const { player, minion, field } = params;
    const animations = [];
    animations.push({
        type: "SUMMON",
        name: player.name,
        field,
        minion,
        necromancyFixPositive: true
    }, {
        type: "FLOATING_TEXT",
        field,
        text: "REBIRTH",
        name: player.name
    });
    if (minion.effect === EffectId.NECROMANCY) {
        minion.damage.current += 2;
        minion.health.current += 2;
        minion.buffs.push({
            id: EffectId.NECROMANCY,
            data: { damage: 2, health: 2 }
        });
        animations.push({
            type: "FLOATING_TEXT",
            field,
            text: "NECROMANCY",
            name: player.name
        }, {
            type: "DAMAGE",
            name: player.name,
            field,
            increment: 2
        }, {
            type: "HEALTH",
            name: player.name,
            field,
            increment: 2
        });
    }
    if (minion.effect === EffectId.PROTECTOR) {
        minion.buffs.push({
            id: EffectId.SHIELD,
            data: { amount: 3 }
        });
        animations.push({
            type: "FLOATING_TEXT",
            field,
            text: "PROTECTOR",
            name: player.name
        }, {
            type: "FLOATING_TEXT",
            field,
            text: "+3 Shield",
            name: player.name
        });
    }
    player.field[field] = minion;
    player.graveyard.splice(player.graveyard.indexOf(minion), 1);
    return animations;
};

const reload = (params) => {
    const { player, drawnCard } = params;
    player.hand.push(drawnCard);
    return [];
};

const ricochet = (params) => {
    const { player, playerMinion, opponent, opponentTrap } = params;
    const animations = [];
    const possibleMinions = [];
    const fieldKeys = Object.keys(player.field);
    fieldKeys.forEach((key) => {
        if (key === "hero") {
            return;
        }
        const minion = player.field[key];
        if (!minion) {
            return;
        }
        const hasElusiveBuff = minion.buffs.find(({ id }) => id === EffectId.ELUSIVE);
        if (hasElusiveBuff) {
            return;
        }
        possibleMinions.push({ minion, key });
    });
    animations.push({
        type: "TRAP",
        name: opponent.name,
        card: opponentTrap
    });
    if (possibleMinions.length) {
        let randomMinion = randomInt(possibleMinions.length);
        let { minion, key } = possibleMinions[randomMinion];
        animations.push({
            type: "FLOATING_TEXT",
            field: key,
            name: player.name,
            text: "Ricochet"
        });
        animations.push(...deductHealth(player, minion, playerMinion.damage.current, key));
        if (minion.health.current <= 0) {
            animations.push(...moveToGraveyard(player, minion, key));
        }
    }
    opponent.graveyard.push(opponentTrap);
    opponent.trap = undefined;
    return animations;
};

const shell = (params) => {
    const { player } = params;
    const animations = [];
    const fieldKeys = Object.keys(player.field);
    fieldKeys.forEach((fieldKey) => {
        const card = player.field[fieldKey];
        if (!card) {
            return;
        }
        const shieldBuff = card.buffs.find((buff) => buff.id === EffectId.SHIELD);
        const unbreakableBuff = card.buffs.find((buff) => buff.id === EffectId.UNBREAKABLE);
        const amount = unbreakableBuff ? 2 : 1;
        if (shieldBuff) {
            shieldBuff.data.amount += amount;
        }
        else {
            card.buffs.push({
                id: EffectId.SHIELD,
                data: { amount }
            });
        }
        animations.push({
            type: "FLOATING_TEXT",
            field: fieldKey,
            name: player.name,
            text: `+${amount} Shield`
        });
    });
    return animations;
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
    const { player, playerMinionField } = params;
    const animations = [];
    const fields = getAdjacentMinions(playerMinionField);
    animations.push({
        type: "FLOATING_TEXT",
        field: playerMinionField,
        name: player.name,
        text: `SHIELDWALL`
    });
    fields.forEach((field) => {
        const minion = player.field[field];
        if (minion) {
            const shieldBuff = minion.buffs.find((buff) => buff.id === EffectId.SHIELD);
            const unbreakableBuff = minion.buffs.find((buff) => buff.id === EffectId.UNBREAKABLE);
            const amount = unbreakableBuff ? 2 : 1;
            if (shieldBuff) {
                shieldBuff.data.amount += amount;
            }
            else {
                minion.buffs.push({
                    id: EffectId.SHIELD,
                    data: { amount }
                });
            }
            animations.push({
                type: "FLOATING_TEXT",
                field: field,
                name: player.name,
                text: `+${amount} Shield`
            });
        }
    });
    return animations;
};

const silence = (params) => {
    const { opponent, trap } = params;
    opponent.graveyard.push(trap);
    opponent.trap = undefined;
    return [{
            type: "TRAP",
            name: opponent.name,
            card: trap
        }];
};

const smite = (params) => {
    const { player, opponent, minion, trap, field } = params;
    const animations = [];
    animations.push({
        type: "TRAP",
        name: opponent.name,
        card: trap
    });
    animations.push(...moveToGraveyard(player, minion, field));
    opponent.graveyard.push(trap);
    opponent.trap = undefined;
    return animations;
};

const spellweave = (params) => {
    const { player, playerMinion, playerMinionField } = params;
    const { name, graveyard } = player;
    const amount = graveyard.reduce((sum, { type }) => type === CardType.MAGIC ? sum += 1 : sum, 0);
    playerMinion.buffs.push({
        id: EffectId.SHIELD,
        data: { amount }
    });
    return [{
            type: "FLOATING_TEXT",
            field: playerMinionField,
            name,
            text: "SPELLWEAVE"
        }, {
            type: "FLOATING_TEXT",
            field: playerMinionField,
            name,
            text: `+${amount} Shield`
        }];
};

const toxicSpray = (params) => {
    const { opponent } = params;
    const possibleMinions = [];
    const minionKeys = Object.keys(opponent.field);
    minionKeys.forEach((key) => {
        const minion = opponent.field[key];
        if (minion && minion.type !== CardType.HERO) {
            const hasElusiveBuff = minion.buffs.find((buff) => buff.id === EffectId.ELUSIVE);
            if (!hasElusiveBuff) {
                possibleMinions.push({ minion, key });
            }
        }
    });
    if (possibleMinions.length) {
        let randomMinion = randomInt(possibleMinions.length);
        let { minion, key } = possibleMinions[randomMinion];
        deductHealth(opponent, minion, 1, key);
        insertDebuff(minion, EffectId.NEUROTOXIN);
        if (minion.health.current <= 0) {
            moveToGraveyard(opponent, minion, key);
        }
    }
    return [true, ""];
};

const valor = (params) => {
    const { player, opponent } = params;
    const animations = [];
    const fieldKeys = Object.keys(player.field);
    const damage = fieldKeys.reduce((acc, fieldKey) => {
        const card = player.field[fieldKey];
        const shieldBuff = card
            ?.buffs
            .find(({ id }) => id === EffectId.SHIELD);
        if (!card || !shieldBuff) {
            return acc;
        }
        animations.push({
            type: "FLOATING_TEXT",
            field: fieldKey,
            name: player.name,
            text: `-${shieldBuff.data.amount} Shield`
        });
        acc += shieldBuff.data.amount;
        card.buffs.splice(card.buffs.indexOf(shieldBuff, 1));
        return acc;
    }, 0);
    opponent.field.hero.health.current -= damage;
    animations.push({
        type: "HEALTH",
        field: "hero",
        name: opponent.name,
        increment: -damage
    });
    return animations;
};

const fortitude = (params) => {
    const { player, playerMinion, playerMinionField } = params;
    const animations = [];
    animations.push(...deductHealth(player, playerMinion, 1, playerMinionField));
    if (playerMinion.health.current > 0) {
        playerMinion.buffs.push({
            id: EffectId.TAUNT,
            data: {}
        });
        animations.push({
            type: "FLOATING_TEXT",
            field: playerMinionField,
            name: player.name,
            text: `+ Taunt`
        });
    }
    else {
        animations.push(...moveToGraveyard(player, playerMinion, playerMinionField));
    }
    return animations;
};

const regeneration = (params) => {
    const { player } = params;
    const minionKeys = Object.keys(player.field);
    const possibleKeys = [];
    minionKeys.forEach((key) => {
        const Minion = player.field[key];
        if (!Minion || Minion.type === CardType.HERO) {
            return;
        }
        if (Minion.buffs.find((buff) => buff.id !== EffectId.REGENERATION)) {
            possibleKeys.push(key);
        }
    });
    if (possibleKeys.length) {
        const rand = randomInt(possibleKeys.length);
        const min = player.field[possibleKeys[rand]];
        if (!min) {
            return [false, ""];
        }
        min.health += 2;
    }
    return [true, ""];
};

const leech = (params) => {
    const { player, minion } = params;
    player.field.hero.health += minion.damage;
    return [true, ""];
};

const electroShock = (params) => {
    const { player, opponent } = params;
    const playerMinionFields = Object.keys(player.field);
    const opponentMinionFields = Object.keys(opponent.field);
    playerMinionFields.forEach((field) => {
        const minion = player.field[field];
        if (minion) {
            minion.buffs = [];
            minion.debuffs = [];
        }
    });
    opponentMinionFields.forEach((field) => {
        const minion = opponent.field[field];
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
        return [];
    }
    const minion = player.field[field];
    if (!minion) {
        return [];
    }
    minion.debuffs = [];
    return [{
            type: "FLOATING_TEXT",
            field,
            name: player.name,
            text: "CLEANSE"
        }];
};

const tidalWave = (params) => {
    const { player } = params;
    const playerMinionFields = Object.keys(player.field);
    playerMinionFields.forEach((field) => {
        const minion = player.field[field];
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
        const minj = player.field[field];
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
    const minionKeys = Object.keys(opponent.field);
    let damageToHero = 0;
    minionKeys.forEach((key) => {
        const minion = opponent.field[key];
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
    opponent.field.hero.health.current -= damageToHero;
    return [true, ""];
};

const toxicGas = (params) => {
    const { opponent } = params;
    const minionKeys = Object.keys(opponent.field);
    minionKeys.forEach((key) => {
        const minion = opponent.field[key];
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
    const animations = [];
    const minionKeys = Object.keys(opponent.field);
    const possibleMinions = [];
    minionKeys.forEach((key) => {
        const minion = opponent.field[key];
        if (minion && minion.type !== CardType.HERO) {
            const hasElusiveBuff = minion
                .buffs
                .find((buff) => buff.id === EffectId.ELUSIVE);
            if (!hasElusiveBuff) {
                possibleMinions.push(minion);
            }
        }
    });
    const minion1 = possibleMinions[randomInt(possibleMinions.length)];
    const minion2 = possibleMinions[randomInt(possibleMinions.length)];
    insertDebuff(minion1, EffectId.NEUROTOXIN);
    insertDebuff(minion2, EffectId.NEUROTOXIN);
    return animations;
};

const smokeBomb = (params) => {
    const { player } = params;
    const minionKeys = Object.keys(player.field);
    minionKeys.forEach((key) => {
        const minion = player.field[key];
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
    const minionKeys = Object.keys(player.field);
    const opponentMinionKeys = Object.keys(player.field);
    minionKeys.forEach((key) => {
        const minion = player.field[key];
        if (minion && minion.type !== CardType.HERO) {
            const hasElusiveBuff = minion.buffs.find((buff) => buff.id === EffectId.ELUSIVE);
            if (!hasElusiveBuff) {
                if (minion.damage.current > 0) {
                    minion.damage.current -= 1;
                }
                insertDebuff(minion, EffectId.CONTAMINATED_AIR);
            }
        }
    });
    opponentMinionKeys.forEach((key) => {
        const minion = opponent.field[key];
        if (minion && minion.type !== CardType.HERO) {
            const hasElusiveBuff = minion.buffs.find((buff) => buff.id === EffectId.ELUSIVE);
            if (!hasElusiveBuff) {
                if (minion.damage.current > 0) {
                    minion.damage.current -= 1;
                }
                insertDebuff(minion, EffectId.CONTAMINATED_AIR);
            }
        }
    });
    return [true, ""];
};

const noxiousFumes = (params) => {
    const { player, opponent, playerMinion, playerMinionField, opponentTrap } = params;
    const animations = [];
    const minionKeys = Object.keys(player.field);
    let damage = 0;
    minionKeys.forEach((key) => {
        const minion = player.field[key];
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
    animations.push(...deductHealth(player, playerMinion, damage, playerMinionField));
    animations.push({
        type: "FLOATING_TEXT",
        field: playerMinionField,
        name: player.name,
        text: "Noxious Fumes"
    });
    if (playerMinion.health.current <= 0) {
        moveToGraveyard(player, playerMinion, playerMinionField);
        animations.push({
            type: "DEATH",
            field: playerMinionField,
            name: player.name
        });
    }
    opponent.graveyard.push(opponentTrap);
    opponent.trap = undefined;
    return [];
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
    const { player, opponent, playerMinion, playerMinionField } = params;
    opponent.field.hero.mana.current -= 1;
    playerMinion.damage.current += 2;
    return [{
            type: "FLOATING_TEXT",
            field: "hero",
            name: opponent.name,
            text: "BACKSTAB"
        }, {
            type: "MANA",
            increment: -1,
            field: "hero",
            name: opponent.name
        }, {
            type: "DAMAGE",
            increment: 2,
            field: playerMinionField,
            name: player.name
        }];
};

const overpower = (params) => {
    const { opponent, damage } = params;
    opponent.field.hero.health -= damage;
    return [true, ""];
};

const ignite = (params) => {
    const { player, opponent, field } = params;
    if (!field) {
        return [false, "Field for Effect not specified."];
    }
    const card = opponent.field[field];
    if (!card || card.type === CardType.HERO) {
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
    const card = player.field[field];
    if (!card) {
        return [false, `Minion doesn't exist on the field ${field}.`];
    }
    if (card.buffs.find((buff) => buff.id === EffectId.ELUSIVE)) {
        return [false, "Corruption negated."];
    }
    card.health.current -= 2;
    if (card.health.current <= 0) {
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
    const card = player.field[field];
    if (!card || card.type === CardType.HERO) {
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
    const { player, playerMinionField, opponent, opponentTrap } = params;
    const fields = getAdjacentMinions(playerMinionField);
    fields.forEach((field) => {
        const minion = player.field[field];
        if (minion) {
            minion.health -= 2;
            if (minion.health <= 0) {
                moveToGraveyard(player, minion, field);
            }
        }
    });
    opponent.graveyard.push(opponentTrap);
    opponent.trap = undefined;
    return [];
};

const reflection = (params) => {
    const { player, opponent, trap } = params;
    const fields = Object.keys(player.field);
    fields.forEach((field) => {
        const minion = player.field[field];
        if (minion && minion.type !== CardType.HERO) {
            insertBuff(minion, EffectId.OVERCHARGE);
        }
    });
    opponent.graveyard.push(trap);
    opponent.trap = undefined;
    return [true, "Last stand triggered"];
};

const constriction = (params) => {
    const { player, playerMinion, opponent, opponentTrap, playerMinionField } = params;
    const fields = Object.keys(player.field);
    const sum = fields.reduce((amount, field) => {
        const minion = player.field[field];
        return minion && minion.buffs.find((buff) => buff.id === EffectId.OVERCHARGE) ? amount + 1 : amount;
    }, 0);
    if (playerMinion.damage.current >= sum) {
        playerMinion.damage.current -= sum;
    }
    else {
        playerMinion.damage.current = 0;
    }
    opponent.graveyard.push(opponentTrap);
    opponent.trap = undefined;
    return [{
            type: "TRAP",
            name: opponent.name,
            card: opponentTrap
        }, {
            type: "FLOATING_TEXT",
            field: playerMinionField,
            name: player.name,
            text: "CONSTRICTION"
        }, {
            type: "DAMAGE",
            field: playerMinionField,
            name: player.name,
            increment: -sum
        }];
};

const effect = {
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

const generateGameView = ({ id, type, currentPlayer, currentTurn, gameLogs, playerA, playerB }, name) => ({
    id,
    type,
    currentPlayer,
    currentTurn,
    gameLogs,
    player: playerA.name === name ? {
        name: playerA.name,
        // hero: playerA.hero,
        // minion: playerA.minion,
        field: playerA.field,
        trap: playerA.trap,
        deck: playerA.deck.length,
        hand: playerA.hand,
        graveyard: playerA.graveyard,
        skins: playerA.skins
    } : {
        name: playerB.name,
        // hero: playerB.hero,
        // minion: playerB.minion,
        field: playerB.field,
        trap: playerB.trap,
        deck: playerB.deck.length,
        hand: playerB.hand,
        graveyard: playerB.graveyard,
        skins: playerB.skins
    },
    opponent: playerA.name === name ? {
        name: playerB.name,
        // hero: playerB.hero,
        // minion: playerB.minion,
        field: playerB.field,
        trap: playerB.trap ? true : false,
        deck: playerB.deck.length,
        hand: playerB.hand.length,
        graveyard: playerB.graveyard,
        skins: playerB.skins
    } : {
        name: playerA.name,
        // hero: playerA.hero,
        // minion: playerA.minion,
        field: playerA.field,
        trap: playerA.trap ? true : false,
        deck: playerA.deck.length,
        hand: playerA.hand.length,
        graveyard: playerA.graveyard,
        skins: playerA.skins
    }
});

const attackMinionSave = async ($game, animations) => {
    const { $players, $games } = mongo;
    const { io } = server;
    const { playerA, playerB } = $game;
    const [$playerA, $playerB] = await Promise.all([
        $players.findOne({
            name: playerA.name
        }),
        $players.findOne({
            name: playerB.name
        })
    ]);
    if (!$playerA || !$playerB) {
        return;
    }
    io.to($playerA.socketId).emit("attackMinionSave", {
        game: generateGameView($game, $playerA.name),
        animations
    });
    io.to($playerB.socketId).emit("attackMinionSave", {
        game: generateGameView($game, $playerB.name),
        animations
    });
    await $games.replaceOne({ id: $game.id }, $game);
};

const buildDeck = (deck) => {
    const gameDeck = [];
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
                health: {
                    current: health,
                    default: health
                },
                damage: {
                    current: damage,
                    default: damage
                },
                manaCost: {
                    current: manaCost,
                    default: manaCost
                },
                canAttack: false,
                buffs: [],
                debuffs: []
            };
        }
        else {
            const { type } = card;
            gameCard = { id, gid, klass, effect, type, manaCost: {
                    current: manaCost,
                    default: manaCost
                } };
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

const endGame = async (gameId, winnerName, animations) => {
    const { $games, $players } = mongo;
    const { io } = server;
    const $game = await $games.findOne({ id: gameId });
    if (!$game) {
        return;
    }
    const { playerA, playerB } = $game;
    if (winnerName === playerA.name) {
        const $playerA = await $players.findOne({
            name: playerA.name
        });
        const $playerB = await $players.findOne({
            name: playerB.name
        });
        if (!$playerA || !$playerB) {
            return;
        }
        $playerA.status = PlayerStatus.ONLINE;
        $playerA.gameId = 0;
        $playerB.status = PlayerStatus.ONLINE;
        $playerB.gameId = 0;
        let playerAEesReward = "0";
        let playerADaily = false;
        let playerBEesReward = "0";
        let playerBDaily = false;
        if (!$playerA.tasks.daily) {
            $playerA.tasks.daily = true;
            playerADaily = true;
        }
        if (!$playerB.tasks.daily && $playerB.tasks.dailyAlternative < 2) {
            $playerB.tasks.dailyAlternative += 1;
        }
        else if (!$playerB.tasks.daily && $playerB.tasks.dailyAlternative >= 2) {
            $playerB.tasks.daily = true;
            playerBDaily = true;
        }
        if ($game.type === GameType.CASUAL || $game.type === GameType.RANKED) {
            $playerA.experience += 110 + $game.currentTurn;
            const XP_REQUIRED = 1000;
            if ($playerA.experience >= XP_REQUIRED) {
                const remaining = $playerA.experience - XP_REQUIRED;
                $playerA.level += 1;
                $playerA.experience = remaining;
                playerAEesReward = `${BigInt(playerAEesReward) + 1n * 10n ** 18n}`;
                if ($playerA.level % 2 === 0) {
                    playerAEesReward = `${BigInt(playerAEesReward) + 2n * 10n ** 18n}`;
                }
                if ($playerA.level % 4 === 0) {
                    playerAEesReward = `${BigInt(playerAEesReward) + 4n * 10n ** 18n}`;
                }
                if ($playerA.level % 8 === 0) {
                    playerAEesReward = `${BigInt(playerAEesReward) + 8n * 10n ** 18n}`;
                }
                if ($playerA.level % 16 === 0) {
                    playerAEesReward = `${BigInt(playerAEesReward) + 16n * 10n ** 18n}`;
                }
                if ($playerA.level % 32 === 0) {
                    playerAEesReward = `${BigInt(playerAEesReward) + 32n * 10n ** 18n}`;
                }
                if ($playerA.level % 64 === 0) {
                    playerAEesReward = `${BigInt(playerAEesReward) + 64n * 10n ** 18n}`;
                }
                $playerA.rewards.ees = `${BigInt($playerA.rewards.ees) + playerAEesReward}`;
            }
            $playerB.experience += 90 + $game.currentTurn;
            if ($playerB.experience >= XP_REQUIRED) {
                const rem = $playerB.experience - XP_REQUIRED;
                $playerB.level += 1;
                $playerB.experience = rem;
                playerBEesReward = `${BigInt(playerBEesReward) + 1n * 10n ** 18n}`;
                if ($playerB.level % 2 === 0) {
                    playerBEesReward = `${BigInt(playerBEesReward) + 2n * 10n ** 18n}`;
                }
                if ($playerB.level % 4 === 0) {
                    playerBEesReward = `${BigInt(playerBEesReward) + 4n * 10n ** 18n}`;
                }
                if ($playerB.level % 8 === 0) {
                    playerBEesReward = `${BigInt(playerBEesReward) + 8n * 10n ** 18n}`;
                }
                if ($playerB.level % 16 === 0) {
                    playerBEesReward = `${BigInt(playerBEesReward) + 16n * 10n ** 18n}`;
                }
                if ($playerB.level % 32 === 0) {
                    playerBEesReward = `${BigInt(playerBEesReward) + 32n * 10n ** 18n}`;
                }
                if ($playerB.level % 64 === 0) {
                    playerBEesReward = `${BigInt(playerBEesReward) + 64n * 10n ** 18n}`;
                }
                $playerB.rewards.ees = `${BigInt($playerB.rewards.ees) + playerBEesReward}`;
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
        await $players.replaceOne({
            name: playerA.name
        }, $playerA);
        await $players.replaceOne({
            name: playerB.name
        }, $playerB);
        io.to($playerA.socketId).emit("gameEnded", {
            isWinner: true,
            gameType: $game.type,
            experience: 110 + $game.currentTurn,
            elo: $game.type === GameType.RANKED ? 20 : 0,
            eesReward: playerAEesReward,
            playerDaily: playerADaily,
            animations
        });
        io.to($playerB.socketId).emit("gameEnded", {
            isWinner: false,
            gameType: $game.type,
            experience: 90 + $game.currentTurn,
            elo: $game.type === GameType.RANKED ? -20 : 0,
            eesReward: playerBEesReward,
            playerDaily: playerBDaily,
            animations
        });
    }
    else if (winnerName === playerB.name) {
        const $playerB = await $players.findOne({
            name: playerB.name
        });
        const $playerA = await $players.findOne({
            name: playerA.name
        });
        if (!$playerB || !$playerA) {
            return;
        }
        $playerB.status = PlayerStatus.ONLINE;
        $playerB.gameId = 0;
        $playerA.status = PlayerStatus.ONLINE;
        $playerA.gameId = 0;
        let playerADaily = false;
        let playerBDaily = false;
        let playerAEesReward = "0";
        let playerBEesReward = "0";
        if (!$playerB.tasks.daily) {
            $playerB.tasks.daily = true;
            playerBDaily = true;
        }
        if (!$playerA.tasks.daily && $playerA.tasks.dailyAlternative < 2) {
            $playerA.tasks.dailyAlternative += 1;
        }
        else if (!$playerA.tasks.daily && $playerA.tasks.dailyAlternative >= 2) {
            $playerA.tasks.daily = true;
            playerADaily = true;
        }
        if ($game.type === GameType.CASUAL || $game.type === GameType.RANKED) {
            $playerB.experience += 110 + $game.currentTurn;
            const XP_REQUIRED = 1000;
            if ($playerB.experience >= XP_REQUIRED) {
                const remaining = $playerB.experience - XP_REQUIRED;
                $playerB.level += 1;
                $playerB.experience = remaining;
                if ($playerB.experience >= XP_REQUIRED) {
                    const rem = $playerB.experience - XP_REQUIRED;
                    $playerB.level += 1;
                    $playerB.experience = rem;
                    playerBEesReward = `${BigInt(playerBEesReward) + 1n * 10n ** 18n}`;
                    if ($playerB.level % 2 === 0) {
                        playerBEesReward = `${BigInt(playerBEesReward) + 2n * 10n ** 18n}`;
                    }
                    if ($playerB.level % 4 === 0) {
                        playerBEesReward = `${BigInt(playerBEesReward) + 4n * 10n ** 18n}`;
                    }
                    if ($playerB.level % 8 === 0) {
                        playerBEesReward = `${BigInt(playerBEesReward) + 8n * 10n ** 18n}`;
                    }
                    if ($playerB.level % 16 === 0) {
                        playerBEesReward = `${BigInt(playerBEesReward) + 16n * 10n ** 18n}`;
                    }
                    if ($playerB.level % 32 === 0) {
                        playerBEesReward = `${BigInt(playerBEesReward) + 32n * 10n ** 18n}`;
                    }
                    if ($playerB.level % 64 === 0) {
                        playerBEesReward = `${BigInt(playerBEesReward) + 64n * 10n ** 18n}`;
                    }
                    $playerB.rewards.ees = `${BigInt($playerB.rewards.ees) + playerBEesReward}`;
                }
            }
            $playerA.experience += 90 + $game.currentTurn;
            if ($playerA.experience >= XP_REQUIRED) {
                const rem = $playerA.experience - XP_REQUIRED;
                $playerA.level += 1;
                $playerA.experience = rem;
                if ($playerA.level % 2 === 0) {
                    playerAEesReward = `${BigInt(playerAEesReward) + 2n * 10n ** 18n}`;
                }
                if ($playerA.level % 4 === 0) {
                    playerAEesReward = `${BigInt(playerAEesReward) + 4n * 10n ** 18n}`;
                }
                if ($playerA.level % 8 === 0) {
                    playerAEesReward = `${BigInt(playerAEesReward) + 8n * 10n ** 18n}`;
                }
                if ($playerA.level % 16 === 0) {
                    playerAEesReward = `${BigInt(playerAEesReward) + 16n * 10n ** 18n}`;
                }
                if ($playerA.level % 32 === 0) {
                    playerAEesReward = `${BigInt(playerAEesReward) + 32n * 10n ** 18n}`;
                }
                if ($playerA.level % 64 === 0) {
                    playerAEesReward = `${BigInt(playerAEesReward) + 64n * 10n ** 18n}`;
                }
                $playerA.rewards.ees = `${BigInt($playerA.rewards.ees) + playerAEesReward}`;
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
        await $players.replaceOne({
            name: playerB.name
        }, $playerB);
        await $players.replaceOne({
            name: playerA.name
        }, $playerA);
        io.to($playerB.socketId).emit("gameEnded", {
            isWinner: true,
            gameType: $game.type,
            experience: 110 + $game.currentTurn,
            elo: $game.type === GameType.RANKED ? 20 : 0,
            playerDaily: playerBDaily,
            eesReward: playerBEesReward,
            animations
        });
        io.to($playerA.socketId).emit("gameEnded", {
            isWinner: false,
            gameType: $game.type,
            experience: 90 + $game.currentTurn,
            elo: $game.type === GameType.RANKED ? -20 : 0,
            playerDaily: playerADaily,
            eesReward: playerAEesReward, animations
        });
    }
    const isDeletedGame = await $games.deleteOne({ id: gameId });
    if (!isDeletedGame.deletedCount) {
        return;
    }
};

const gamePopup = async (type, playerA, playerB) => {
    const { $gamePopups, $players } = mongo;
    const { io } = server;
    const id = randomInt(1, 1000000001);
    const [a, b] = await Promise.all([
        $players.findOneAndUpdate({
            name: playerA
        }, {
            $set: {
                gamePopupId: id
            }
        }, {
            returnDocument: "after"
        }),
        $players.findOneAndUpdate({
            name: playerB
        }, {
            $set: {
                gamePopupId: id
            }
        }, {
            returnDocument: "after"
        })
    ]);
    if (!a || !b) {
        return;
    }
    const gamePopupp = {
        id,
        type,
        playerA: {
            name: a.name,
            hasAccepted: false
        },
        playerB: {
            name: b.name,
            hasAccepted: false
        }
    };
    const inserted = await $gamePopups.insertOne(gamePopupp);
    if (!inserted.insertedId) {
        return;
    }
    setTimeout(async () => {
        const $gamePopup = await $gamePopups.findOne({ id });
        if (!$gamePopup) {
            return;
        }
        if (!$gamePopup.playerA.hasAccepted || !$gamePopup.playerB.hasAccepted) {
            const pa = await $players.findOneAndUpdate({
                name: $gamePopup.playerA.name
            }, {
                $set: {
                    status: PlayerStatus.ONLINE,
                    gamePopupId: 0
                }
            });
            const pb = await $players.findOneAndUpdate({
                name: $gamePopup.playerB.name
            }, {
                $set: {
                    status: PlayerStatus.ONLINE,
                    gamePopupId: 0
                }
            });
            if (!pa || !pb) {
                return;
            }
            await $gamePopups.deleteOne({ id });
            io.to(pa.socketId).emit("declineGame");
            io.to(pb.socketId).emit("declineGame");
        }
    }, 10_000);
    io.to(a.socketId).emit("gamePopup", { gamePopup: gamePopupp });
    io.to(b.socketId).emit("gamePopup", { gamePopup: gamePopupp });
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
            field: {
                hero: {
                    ...playerAHero,
                    health: {
                        current: 20,
                        default: 20
                    },
                    mana: {
                        current: 20,
                        default: 20
                    },
                    buffs: [],
                    debuffs: []
                },
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
            field: {
                hero: {
                    ...playerBHero,
                    health: {
                        current: 20,
                        default: 20
                    },
                    mana: {
                        current: 20,
                        default: 20
                    },
                    buffs: [],
                    debuffs: []
                },
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
    const { $games, $players } = mongo;
    const $player = await $players.findOne({ socketId });
    if (!$player) {
        return [, "Player not found, try relogging."];
    }
    const { name } = $player;
    const id = $player.gameId;
    const $game = await $games.findOne({ id });
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
    const fields = Object.keys(player.field);
    fields.forEach((field) => {
        const minion = player.field[field];
        if (minion && minion.type !== CardType.HERO) {
            list.push(minion);
        }
    });
    return list[randomInt(list.length)];
};

const isGameOver = async (game, animations) => {
    if (game.playerA.field.hero.health.current <= 0) {
        await endGame(game.id, game.playerB.name, animations);
        return true;
    }
    else if (game.playerB.field.hero.health.current <= 0) {
        await endGame(game.id, game.playerA.name, animations);
        return true;
    }
    return false;
};

const saveGame = async (game, animations) => {
    const { $games, $players } = mongo;
    const { io } = server;
    const { id, playerA, playerB } = game;
    const [$updateGame, $playerA, $playerB] = await Promise.all([
        $games.replaceOne({ id }, game),
        $players.findOne({
            name: playerA.name
        }),
        $players.findOne({
            name: playerB.name
        })
    ]);
    if (!$updateGame.modifiedCount || !$playerA || !$playerB) {
        return;
    }
    io.to($playerA.socketId).emit("reloadGameState", {
        game: generateGameView(game, $playerA.name),
        animations
    });
    io.to($playerB.socketId).emit("reloadGameState", {
        game: generateGameView(game, $playerB.name),
        animations
    });
};

const startGame = async (id, type, playerA, playerB) => {
    const { $games, $players } = mongo;
    const { io } = server;
    const [$playerA, $playerB] = await Promise.all([
        $players.findOneAndUpdate({
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
        $players.findOneAndUpdate({
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
    ]);
    if (!$playerA || !$playerB) {
        return;
    }
    const game = generateGame(id, type, $playerA, $playerB);
    const isInserted = await $games.insertOne(game);
    if (!isInserted.insertedId) {
        return;
    }
    io.to($playerA.socketId).emit("startGame", {
        playerA: {
            name: $playerA.name,
            avatarId: $playerA.avatarId,
            bannerId: $playerA.bannerId,
            level: $playerA.level,
            elo: $playerA.elo,
            experience: $playerA.experience,
            games: $playerA.games
        },
        playerB: {
            name: $playerB.name,
            avatarId: $playerB.avatarId,
            bannerId: $playerB.bannerId,
            level: $playerB.level,
            elo: $playerB.elo,
            experience: $playerB.experience,
            games: $playerB.games
        },
        game: generateGameView(game, $playerA.name)
    });
    io.to($playerB.socketId).emit("startGame", {
        playerA: {
            name: $playerA.name,
            avatarId: $playerA.avatarId,
            bannerId: $playerA.bannerId,
            level: $playerA.level,
            elo: $playerA.elo,
            experience: $playerA.experience,
            games: $playerA.games
        },
        playerB: {
            name: $playerB.name,
            avatarId: $playerB.avatarId,
            bannerId: $playerB.bannerId,
            level: $playerB.level,
            elo: $playerB.elo,
            experience: $playerB.experience,
            games: $playerB.games
        },
        game: generateGameView(game, $playerB.name)
    });
};

const gameHelpers = {
    effect,
    attackMinionSave,
    buildDeck,
    deductHealth,
    endGame,
    gamePopup,
    generateGame,
    generateGameView,
    getAdjacentMinions,
    getGame,
    getRandomMinion,
    insertBuff,
    insertDebuff,
    isGameOver,
    moveToGraveyard,
    saveGame,
    startGame,
};

const authenticate$1 = async (socketId, name) => {
    const { $chats, $games, $lobbies, $players } = mongo;
    const $player = await $players.findOneAndUpdate({ name }, [{
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
    if (!$player) {
        return [undefined, "Error updating player."];
    }
    const { lobbyId, gameId } = $player;
    let lobbyView;
    let gameView;
    if (lobbyId) {
        const id = lobbyId;
        const $lobby = await $lobbies.findOne({ id });
        if (!$lobby) {
            return [undefined, "You are currently in a lobby that cannot be found."];
        }
        const { host, challengee } = $lobby;
        lobbyView = { id, host, challengee };
    }
    if (gameId) {
        const id = gameId;
        const $game = await $games.findOne({ id });
        if (!$game) {
            return [undefined, "You are currently in a game that cannot be found."];
        }
        gameView = gameHelpers.generateGameView($game, $player.name);
    }
    const friendsView = [];
    for (const name of $player.social.friends) {
        const [friend, chat] = await Promise.all([
            $players.findOne({ name }),
            $chats.findOne({
                players: {
                    $all: [$player.name, name]
                }
            })
        ]);
        if (friend && chat) {
            const { avatarId, bannerId, experience, level, elo, status, games } = friend;
            const { lastSender, unseen, messages } = chat;
            friendsView.push({
                name, avatarId, bannerId, experience, level, elo, status, games, chat: {
                    lastSender,
                    unseen,
                    messages
                }
            });
        }
    }
    const playerView = {
        name: $player.name,
        address: $player.address,
        nonce: $player.nonce,
        avatarId: $player.avatarId,
        bannerId: $player.bannerId,
        experience: $player.experience,
        level: $player.level,
        elo: $player.elo,
        joinedAt: $player.joinedAt,
        status: $player.status,
        queueId: $player.queueId,
        deckId: $player.deckId,
        lobbyId: $player.lobbyId,
        gameId: $player.gameId,
        gamePopupId: $player.gamePopupId,
        social: {
            friends: friendsView,
            requests: $player.social.requests,
            blocked: $player.social.blocked
        },
        games: $player.games,
        decks: $player.decks.map((deck) => ({
            id: deck.id,
            name: deck.name,
            klass: deck.klass,
            cardsInDeck: deck.cards.reduce((acc, { amount }) => acc += amount, 0),
            average: {
                health: deck.cards.reduce((acc, deckCard) => {
                    const card = cards.find((card) => deckCard.id === card.id);
                    if (!card ||
                        card.type === CardType.HERO ||
                        card.type === CardType.MAGIC ||
                        card.type === CardType.TRAP) {
                        return acc;
                    }
                    return acc += card.health * deckCard.amount;
                }, 0) / deck.cards.reduce((acc, deckCard) => acc += deckCard.amount, 0) || 0,
                damage: deck.cards.reduce((acc, deckCard) => {
                    const card = cards.find((card) => deckCard.id === card.id);
                    if (!card ||
                        card.type === CardType.HERO ||
                        card.type === CardType.MAGIC ||
                        card.type === CardType.TRAP) {
                        return acc;
                    }
                    return acc += card.damage * deckCard.amount;
                }, 0) / deck.cards.reduce((acc, deckCard) => {
                    const card = cards.find((card) => deckCard.id === card.id);
                    if (!card || card.type !== CardType.MINION) {
                        return acc;
                    }
                    return acc += deckCard.amount;
                }, 0) || 0,
                manaCost: deck.cards.reduce((acc, deckCard) => {
                    const card = cards.find((card) => deckCard.id === card.id);
                    if (!card || card.type === CardType.HERO) {
                        return acc;
                    }
                    return acc += card.manaCost * deckCard.amount;
                }, 0) / deck.cards.reduce((acc, deckCard) => acc += deckCard.amount, 0) || 0
            },
            attribute: {
                minion: deck.cards.reduce((acc, deckCard) => {
                    const card = cards.find((card) => deckCard.id === card.id);
                    if (!card || card.type !== CardType.MINION) {
                        return acc;
                    }
                    return acc += deckCard.amount;
                }, 0),
                magic: deck.cards.reduce((acc, deckCard) => {
                    const card = cards.find((card) => deckCard.id === card.id);
                    if (!card || card.type !== CardType.MAGIC) {
                        return acc;
                    }
                    return acc += deckCard.amount;
                }, 0),
                trap: deck.cards.reduce((acc, deckCard) => {
                    const card = cards.find((card) => deckCard.id === card.id);
                    if (!card || card.type !== CardType.TRAP) {
                        return acc;
                    }
                    return acc += deckCard.amount;
                }, 0),
                neutral: deck.cards.reduce((acc, deckCard) => {
                    const card = cards.find((card) => deckCard.id === card.id);
                    if (!card || card.klass !== CardKlass.NEUTRAL) {
                        return acc;
                    }
                    return acc += deckCard.amount;
                }, 0),
                solid: deck.cards.reduce((acc, deckCard) => {
                    const card = cards.find((card) => deckCard.id === card.id);
                    if (!card || card.klass !== CardKlass.SOLID) {
                        return acc;
                    }
                    return acc += deckCard.amount;
                }, 0),
                liquid: deck.cards.reduce((acc, deckCard) => {
                    const card = cards.find((card) => deckCard.id === card.id);
                    if (!card || card.klass !== CardKlass.LIQUID) {
                        return acc;
                    }
                    return acc += deckCard.amount;
                }, 0),
                gas: deck.cards.reduce((acc, deckCard) => {
                    const card = cards.find((card) => deckCard.id === card.id);
                    if (!card || card.klass !== CardKlass.GAS) {
                        return acc;
                    }
                    return acc += deckCard.amount;
                }, 0),
                plasma: deck.cards.reduce((acc, deckCard) => {
                    const card = cards.find((card) => deckCard.id === card.id);
                    if (!card || card.klass !== CardKlass.PLASMA) {
                        return acc;
                    }
                    return acc += deckCard.amount;
                }, 0),
            },
            cards: deck.cards.map((deckCard) => {
                const { id, amount } = deckCard;
                const card = cards.find((card) => card.id === id);
                const cardView = cardsView.find((card) => card.id === id);
                if (!card || !cardView || card.type === CardType.HERO) {
                    return { id, name: "", type: 1, damage: 0, health: 0, manaCost: 0, amount: 1 };
                }
                const { klass, type, manaCost } = card;
                const { name } = cardView;
                if (card.type === CardType.MINION) {
                    const { health, damage } = card;
                    return { id, name, klass, type, health, damage, manaCost, amount };
                }
                else {
                    return { id, name, klass, type, manaCost, amount };
                }
            })
        })),
        skins: $player.skins,
        tutorial: $player.tutorial,
        tasks: $player.tasks,
        rewards: $player.rewards
    };
    const snapshots = await mongo.$supplySnapshots.find().toArray();
    return [{ lobbyView, gameView, playerView, snapshots }, ""];
};

const getSocketIds = async (players) => {
    return await mongo
        .$players
        .find({
        name: {
            $in: players
        }
    })
        .project({
        _id: 0,
        socketId: 1
    })
        .map(({ socketId }) => socketId)
        .toArray();
};

const isDeckValid = (playerDeck) => {
    // maybe check whether it includes a hero, since that is also invalid?
    // or do this check in saveDeck, and remove this function altogether?
    return playerDeck
        .cards
        .reduce((value, { amount }) => value += amount, 0) === 30;
};

const playerTemplate = (name, passwordHash, address) => ({
    socketId: "",
    passwordHash,
    address,
    nonce: 0,
    name,
    joinedAt: Date.now(),
    status: PlayerStatus.OFFLINE,
    experience: 0,
    level: 1,
    elo: 500,
    avatarId: 1000,
    bannerId: 2000,
    deckId: 0, // should be called deckIndex, because this is actually index.
    queueId: QueueId.NONE,
    lobbyId: 0,
    gameId: 0,
    gamePopupId: 0,
    games: {
        casual: { won: 0, lost: 0 },
        ranked: { won: 0, lost: 0 }
    },
    social: {
        friends: [],
        requests: [],
        blocked: []
    },
    tasks: {
        daily: false,
        dailyAlternative: 0,
        weekly: 0,
    },
    rewards: {
        ecr: "0",
        ees: "0"
    },
    tutorial: {
        deckBuilder: false,
        game: false,
        play: false,
        inventory: false
    },
    decks: [
        { id: 0, klass: 1, name: "Deck 1", cards: [] },
        { id: 1, klass: 2, name: "Deck 2", cards: [] },
        { id: 2, klass: 3, name: "Deck 3", cards: [] },
        { id: 3, klass: 4, name: "Deck 4", cards: [] }
    ],
    skins: cards.map((card) => ({
        cardId: card.id,
        skinId: parseInt(`1${card.id > 99 ? `${card.id}` : `0${card.id}`}00`)
    }))
});

const playerHelpers = { authenticate: authenticate$1, getSocketIds, isDeckValid, playerTemplate };

const authenticate = (socket, error) => {
    const socketId = socket.id;
    socket.on("authenticate", async (params) => {
        const decoded = jsonwebtoken.verify(params.token, "som");
        const { name } = decoded;
        const auth = await playerHelpers.authenticate(socketId, name);
        const [data, errorMessage] = auth;
        if (!data) {
            return error(errorMessage);
        }
        socket.emit("signin", { ...data, token: undefined });
    });
};

const disconnect = (socket, error) => {
    const socketId = socket.id;
    const { $players } = mongo;
    socket.on("disconnect", async () => {
        // console.log("DISCONNECT", socketId);
        const $playerUpdate = await $players.findOneAndUpdate({ socketId }, {
            $set: {
                socketId: "",
                status: PlayerStatus.OFFLINE
            }
        }, {
            returnDocument: "after"
        });
        console.log($playerUpdate?.status);
        if (!$playerUpdate) {
            return error("Error updating player.");
        }
        const { name, status, social } = $playerUpdate;
        const socketIds = await playerHelpers.getSocketIds(social.friends);
        // console.log(name, status);
        server.io.to(socketIds).emit("updateFriend", { name, status });
    });
};

const getNonce = (socket, error) => {
    const { $players } = mongo;
    socket.on("getNonce", async (params) => {
        const address = getAddress(params.address);
        if (!address) {
            return error("Invalid address.");
        }
        const $player = await $players.findOne({ address });
        if (!$player) {
            return error("Player not found.");
        }
        const { nonce } = $player;
        socket.emit("getNonce", { nonce });
    });
};

const signinMetamask = (socket, error) => {
    const socketId = socket.id;
    const { $players } = mongo;
    socket.on("signinMetamask", async (params) => {
        const { address, signature, rememberMe } = params;
        const $player = await $players.findOne({ address });
        if (!$player) {
            return error("Account not found.");
        }
        const recoveredAddress = verifyMessage(`signin${$player.nonce}`, signature);
        if (recoveredAddress !== $player.address) {
            return error("Invalid signature.");
        }
        const $playerUpdate = await $players.updateOne({ address }, {
            $set: {
                nonce: $player.nonce + 1
            }
        });
        if (!$playerUpdate.modifiedCount) {
            return error("Error updating account.");
        }
        const expiresIn = rememberMe ? "30d" : "2h";
        const { name } = $player;
        const token = jsonwebtoken.sign({ name }, "som", { expiresIn });
        const auth = await playerHelpers.authenticate(socketId, $player.name);
        const [data, errorMessage] = auth;
        if (!data) {
            return error(errorMessage);
        }
        socket.emit("signin", { ...data, token });
    });
};

const signinPassword = (socket, error) => {
    const socketId = socket.id;
    const { $players } = mongo;
    socket.on("signinPassword", async (params) => {
        const { name, password, rememberMe } = params;
        const $player = await $players.findOne({ name });
        console.log($player);
        if (!$player) {
            return error("Account not found.");
        }
        if (!$player.passwordHash && $player.address) {
            return error("Must login through metamask.");
        }
        const isCorrectPassword = await compare(password, $player.passwordHash);
        if (!isCorrectPassword) {
            return error("Invalid password.");
        }
        const expiresIn = rememberMe ? "30d" : "2h";
        const token = jsonwebtoken.sign({ name }, "som", { expiresIn });
        const auth = await playerHelpers.authenticate(socketId, $player.name);
        const [data, errorMessage] = auth;
        if (!data) {
            return error(errorMessage);
        }
        socket.emit("signin", { ...data, token });
    });
};

const signupMetamask = (socket, error) => {
    const { $players } = mongo;
    socket.on("signupMetamask", async (params) => {
        const { name, address, signature } = params;
        if (name.length < 3) {
            return error("Name minimum 3 characters.");
        }
        if (name.length > 16) {
            return error("Name maximum 16 characters.");
        }
        if (!isAddress(address)) {
            return error("Invalid address");
        }
        const $player = await $players.findOne({ name });
        const $player2 = await $players.findOne({ address });
        if ($player) {
            return error("Name taken.");
        }
        if ($player2) {
            return error("Address taken.");
        }
        const recoveredAddress = verifyMessage("signup", signature);
        if (recoveredAddress !== address) {
            return error("Invalid signature.");
        }
        const insertPlayer = await $players.insertOne(playerHelpers.playerTemplate(name, "", address));
        if (!insertPlayer.insertedId) {
            return error("Error creating account, please try again.");
        }
        socket.emit("notification", {
            color: "success",
            message: "Account created successfully."
        });
    });
};

const signupPassword = (socket, error) => {
    const { $players } = mongo;
    socket.on("signupPassword", async (params) => {
        const { name, password } = params;
        if (name.length < 3) {
            return error("Name minimum 3 characters.");
        }
        if (name.length > 16) {
            return error("Name maximum 16 characters.");
        }
        if (password.length < 6) {
            return error("Password minimum 6 characters.");
        }
        const $player = await $players.findOne({ name });
        if ($player) {
            return error("Name taken.");
        }
        const passwordHash = await hash(password, 12);
        const insertPlayer = await $players.insertOne(playerHelpers.playerTemplate(name, passwordHash, ""));
        if (!insertPlayer.insertedId) {
            return error("Error creating player, please try again.");
        }
        socket.emit("notification", {
            color: "success",
            message: "Account created successfully."
        });
    });
};

const auth = [
    authenticate,
    disconnect,
    getNonce,
    signinMetamask,
    signinPassword,
    signupMetamask,
    signupPassword
];

const acceptGame = (socket, error) => {
    const socketId = socket.id;
    const { $gamePopups, $players } = mongo;
    socket.on("acceptGame", async () => {
        const $player = await $players.findOne({ socketId });
        if (!$player) {
            return error("Player not found, try relogging.");
        }
        const id = $player.gamePopupId;
        const $gamePopup = await $gamePopups.findOne({ id });
        if (!$gamePopup) {
            return error("Game popup not found.");
        }
        const { type, playerA, playerB } = $gamePopup;
        if (playerA.name === $player.name) {
            if (playerA.hasAccepted) {
                return error("You already accepted this match.");
            }
            if (playerB.hasAccepted) {
                const $gamePopupDelete = await $gamePopups.deleteOne({ id });
                if (!$gamePopupDelete.deletedCount) {
                    return error("Error deleting game popup.");
                }
                await gameHelpers.startGame(id, type, playerA.name, playerB.name);
            }
            else {
                const [$gamePopupUpdate, $playerA, $playerB] = await Promise.all([
                    $gamePopups.updateOne({ id }, {
                        $set: {
                            "playerA.hasAccepted": true
                        }
                    }),
                    $players.findOne({
                        name: playerA.name
                    }),
                    $players.findOne({
                        name: playerB.name
                    })
                ]);
                if (!$gamePopupUpdate.modifiedCount || !$playerA || !$playerB) {
                    return error("Error fetching players in game popup.");
                }
                socket.emit("acceptGame", { who: "player" });
                server.io.to($playerB.socketId).emit("acceptGame", { who: "opponent" });
            }
        }
        else if (playerB.name === $player.name) {
            if (playerB.hasAccepted) {
                return error("You already accepted this match.");
            }
            if (playerA.hasAccepted) {
                const $gamePopupDelete = await $gamePopups.deleteOne({ id });
                if (!$gamePopupDelete.deletedCount) {
                    return error("Error deleting game popup.");
                }
                await gameHelpers.startGame(id, type, playerB.name, playerA.name);
            }
            else {
                const [$gamePopupUpdate, $playerA, $playerB] = await Promise.all([
                    $gamePopups.updateOne({ id }, {
                        $set: {
                            "playerB.hasAccepted": true
                        }
                    }),
                    $players.findOne({
                        name: playerA.name
                    }),
                    $players.findOne({
                        name: playerB.name
                    })
                ]);
                if (!$gamePopupUpdate.modifiedCount || !$playerA || !$playerB) {
                    return error("Error fetching players in game popup.");
                }
                socket.emit("acceptGame", { who: "player" });
                server.io.to($playerA.socketId).emit("acceptGame", { who: "opponent" });
            }
        }
    });
};

const closeLobby = (socket, error) => {
    const socketId = socket.id;
    const { $players, $lobbies } = mongo;
    socket.on("closeLobby", async () => {
        const $player = await $players.findOne({ socketId });
        if (!$player) {
            return error("Player not found, try relogging.");
        }
        const { name, lobbyId } = $player;
        if (!lobbyId) {
            return error("You are not in a lobby.");
        }
        const id = lobbyId;
        const $lobby = await $lobbies.findOne({ id });
        if (!$lobby) {
            return error("Lobby not found.");
        }
        const { host, challengee } = $lobby;
        if (host.name !== name) {
            return error("You are not the lobby host.");
        }
        const [$lobbyDelete, $playerUpdate, $challengeeUpdate] = await Promise.all([
            $lobbies.deleteOne({ id }),
            $players.updateOne({ socketId }, {
                $set: {
                    lobbyId: 0,
                    status: PlayerStatus.ONLINE
                }
            }),
            challengee && $players.findOneAndUpdate({
                name: challengee.name
            }, {
                $set: {
                    lobbyId: 0,
                    status: PlayerStatus.ONLINE
                }
            }, {
                returnDocument: "after"
            })
        ]);
        if (!$lobbyDelete.deletedCount) {
            return error("Error deleting lobby.");
        }
        if (!$playerUpdate.modifiedCount) {
            return error("Error updating host.");
        }
        if ($challengeeUpdate && !$challengeeUpdate) {
            return error("Error updating challengee.");
        }
        socket.emit("closeLobby");
        if (challengee) {
            const $challengee = await $players.findOneAndUpdate({
                name: challengee.name
            }, {
                $set: {
                    lobbyId: 0,
                    status: PlayerStatus.ONLINE
                }
            }, {
                returnDocument: "after"
            });
            if (!$challengee) {
                return error("Error updating challengee.");
            }
            server.io.to($challengee.socketId).emit("closeLobby");
        }
    });
};

const createLobby = (socket, error) => {
    const socketId = socket.id;
    const { $players, $lobbies } = mongo;
    socket.on("createLobby", async () => {
        const $player = await $players.findOne({ socketId });
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
        if (!playerHelpers.isDeckValid($player.decks[$player.deckId])) {
            return error("Invalid deck.");
        }
        const { name, experience, level, elo, avatarId, bannerId, games } = $player;
        const id = randomInt(1, 1000000001);
        const lobby = {
            id,
            host: { name, experience, level, elo, avatarId, bannerId, games },
            challengee: undefined
        };
        const [$lobbyInsert, $playerUpdate] = await Promise.all([
            $lobbies.insertOne(lobby),
            $players.updateOne({ socketId }, {
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
    const { $gamePopups, $players } = mongo;
    const { io } = server;
    socket.on("declineGame", async () => {
        const $player = await $players.findOne({ socketId });
        if (!$player) {
            return error("Player not found, try relogging.");
        }
        const id = $player.gamePopupId;
        const $gamePopup = await $gamePopups.findOne({ id });
        if (!$gamePopup) {
            return error("Game popup not found.");
        }
        const { playerA, playerB } = $gamePopup;
        const [$gamePopupDelete, $playerA, $playerB] = await Promise.all([
            $gamePopups.deleteOne({ id }),
            $players.findOneAndUpdate({
                name: playerA.name
            }, {
                $set: {
                    status: PlayerStatus.ONLINE,
                    gamePopupId: 0
                }
            }, {
                returnDocument: "after"
            }),
            $players.findOneAndUpdate({
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
        if (!$playerA) {
            return error("Player A in popup not found / updated.");
        }
        if (!$playerB) {
            return error("Player B in popup not found / updated.");
        }
        io.to([
            $playerA.socketId,
            $playerB.socketId
        ]).emit("declineGame");
    });
};

const defaultSkin = (socket, error) => {
    const socketId = socket.id;
    const { $players } = mongo;
    socket.on("defaultSkin", async (params) => {
        const $player = await $players.findOne({ socketId });
        if (!$player) {
            return error("Player not found, try relogging.");
        }
        const { cardId } = params;
        const $playerUpdate = await $players.updateOne({ socketId }, {
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
    const { $players } = mongo;
    socket.on("finishTutorial", async (params) => {
        const { tutorial } = params;
        if (tutorial !== "deckBuilder" &&
            tutorial !== "inventory" &&
            tutorial !== "play") {
            return error("Invalid tutorial.");
        }
        const $playerUpdate = await $players.updateOne({ socketId }, {
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
    const { $leaderboards } = mongo;
    socket.on("getLeaderboards", async () => {
        const $ = await $leaderboards.findOne({});
        if (!$) {
            socket.emit("getLeaderboards", { byLevel: [], byElo: [] });
        }
        else {
            const { level, elo } = $;
            socket.emit("getLeaderboards", { byLevel: level, byElo: elo });
        }
    });
};

const joinLobby = (socket, error) => {
    const socketId = socket.id;
    const { $lobbies, $players } = mongo;
    socket.on("joinLobby", async (params) => {
        const { id } = params;
        const [$player, $lobby] = await Promise.all([
            $players.findOne({ socketId }),
            $lobbies.findOne({ id })
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
        if ($lobby.challengee) {
            return error("Lobby is full.");
        }
        if (!playerHelpers.isDeckValid($player.decks[$player.deckId])) {
            return error("Invalid deck.");
        }
        const { name, experience, level, elo, avatarId, bannerId, games } = $player;
        const [$lobbyUpdate, $playerUpdate, $playerHost] = await Promise.all([
            $lobbies.findOneAndUpdate({ id }, {
                $set: {
                    challengee: { name, experience, level, elo, avatarId, bannerId, games }
                }
            }, {
                returnDocument: "after"
            }),
            $players.updateOne({ socketId }, {
                $set: {
                    lobbyId: id,
                    status: PlayerStatus.IN_LOBBY
                }
            }),
            $players.findOne({
                name: $lobby.host.name
            })
        ]);
        if (!$lobbyUpdate) {
            return error("Error updating lobby.");
        }
        if (!$playerUpdate.modifiedCount) {
            return error("Error updating player.");
        }
        if (!$playerHost) {
            return error("Lobby host not found.");
        }
        const { host, challengee } = $lobbyUpdate;
        const lobby = { id, host, challengee };
        socket.emit("joinLobbySender", { lobby });
        server.io.to($playerHost.socketId).emit("joinLobbyReceiver", { challengee });
    });
};

const joinQueue = (socket, error) => {
    const { $casualQueuePlayers, $players, $rankedQueuePlayers } = mongo;
    const socketId = socket.id;
    socket.on("joinQueue", async (params) => {
        const { queueId } = params;
        if (!(queueId in QueueId) || queueId === QueueId.NONE) {
            return error("Invalid queue selected.");
        }
        const $player = await $players.findOne({ socketId });
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
            const opponents = await $casualQueuePlayers.find().toArray();
            for (const opponent of opponents) { // maybe create an interval and loop every 20 seconds for matchmaking
                if (opponent.level < level - 100 || opponent.level < level + 100) {
                    const $casualQueuePlayerDelete = await $casualQueuePlayers.deleteOne({
                        name: opponent.name
                    });
                    const $playerUpdate = await $players.updateOne({
                        name: opponent.name
                    }, {
                        $set: {
                            queueId: QueueId.NONE
                        }
                    });
                    await $players.updateOne({
                        name
                    }, {
                        $set: {
                            queueId: QueueId.NONE
                        }
                    });
                    if (!$casualQueuePlayerDelete.deletedCount || !$playerUpdate.modifiedCount) {
                        return error("Failed removing player from queue after match found.");
                    }
                    await gameHelpers.gamePopup(GameType.CASUAL, opponent.name, name);
                    return;
                }
            }
            const $casualQueuePlayerInsert = await $casualQueuePlayers.insertOne({ name, level });
            if (!$casualQueuePlayerInsert.insertedId) {
                return error("Failed to insert player in the queue.");
            }
        }
        else if (queueId === QueueId.RANKED) {
            const opponents = await $rankedQueuePlayers.find().toArray();
            for (const opponent of opponents) {
                if (opponent.elo < elo - 11250 || opponent.elo < elo + 11250) {
                    const $casualQueuePlayerDelete = await $rankedQueuePlayers.deleteOne({
                        name: opponent.name
                    });
                    const $playerUpdate = await $players.updateOne({
                        name: opponent.name
                    }, {
                        $set: {
                            queueId: QueueId.NONE
                        }
                    });
                    await $players.updateOne({
                        name
                    }, {
                        $set: {
                            queueId: QueueId.NONE
                        }
                    });
                    if (!$casualQueuePlayerDelete.deletedCount || !$playerUpdate.modifiedCount) {
                        return error("Failed removing player from queue after match found.");
                    }
                    await gameHelpers.gamePopup(GameType.RANKED, opponent.name, name);
                    return;
                }
            }
            const inserted = await $rankedQueuePlayers.insertOne({ name, elo });
            if (!inserted.insertedId) {
                return error("Failed to insert player in the queue.");
            }
        }
        const $playerUpdate = await $players.updateOne({ socketId }, {
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
    const { $lobbies, $players } = mongo;
    socket.on("leaveLobby", async () => {
        const $player = await $players.findOne({ socketId });
        if (!$player) {
            return error("Player not found.");
        }
        if (!$player.lobbyId) {
            return error("You are not in a lobby.");
        }
        const id = $player.lobbyId;
        const $lobby = await $lobbies.findOne({ id });
        if (!$lobby) {
            return error("Lobby not found.");
        }
        if ($lobby.host.name === $player.name) {
            return error("Lobby host can't leave lobby.");
        }
        const [$lobbyUpdate, $playerUpdate, $playerHost] = await Promise.all([
            $lobbies.updateOne({ id }, {
                $set: {
                    challengee: undefined
                }
            }),
            $players.updateOne({ socketId }, {
                $set: {
                    lobbyId: 0,
                    status: PlayerStatus.ONLINE
                }
            }),
            $players.findOne({
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
        server.io.to($playerHost.socketId).emit("leaveLobbyReceiver");
    });
};

const leaveQueue = (socket, error) => {
    const socketId = socket.id;
    const { $casualQueuePlayers, $players, $rankedQueuePlayers } = mongo;
    socket.on("leaveQueue", async () => {
        const $player = await $players.findOne({ socketId });
        if (!$player) {
            return error("Player not found.");
        }
        if (!$player.queueId) {
            return error("You are not in a queue.");
        }
        const { name } = $player;
        if ($player.queueId === QueueId.CASUAL) {
            const [deleteCasualQueuePlayer, updatePlayer] = await Promise.all([
                $casualQueuePlayers.deleteOne({ name }),
                $players.updateOne({ name }, {
                    $set: {
                        status: PlayerStatus.ONLINE,
                        queueId: 0
                    }
                })
            ]);
            if (!deleteCasualQueuePlayer.deletedCount || !updatePlayer.modifiedCount) {
                return error("Error removing player from queue.");
            }
        }
        else if ($player.queueId === QueueId.RANKED) {
            const [deleteRankedQueuePlayer, updatePlayer] = await Promise.all([
                $rankedQueuePlayers.deleteOne({ name }),
                $players.updateOne({ name }, {
                    $set: {
                        status: PlayerStatus.ONLINE,
                        queueId: 0
                    }
                })
            ]);
            if (!deleteRankedQueuePlayer.deletedCount || !updatePlayer.modifiedCount) {
                return error("Error removing player from queue.");
            }
        }
        socket.emit("leaveQueue");
    });
};

const saveDeck = (socket, error) => {
    const socketId = socket.id;
    const { $players } = mongo;
    socket.on("saveDeck", async (params) => {
        const { deck } = params;
        if (deck.name.length >= 12) {
            return error("Maximum 12 characters length allowed for deck name.");
        }
        if (deck.klass < 1 || deck.klass > 4) { // prevent decimals?
            return error("Invalid class.");
        }
        const $player = await $players.findOne({ socketId });
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
        const $playerUpdate = await $players.updateOne({
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
        socket.emit("notification", {
            color: "success",
            message: "Deck saved successfully."
        });
    });
};

const selectDeck = (socket, error) => {
    const socketId = socket.id;
    const { $players } = mongo;
    socket.on("selectDeck", async (params) => {
        const { deckId } = params;
        if (deckId < 0 || deckId > 3) {
            return error("Invalid deck range.");
        }
        const $playerUpdate = await $players.updateOne({ socketId }, {
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
    const { $players } = mongo;
    socket.on("selectSkin", async (params) => {
        const { cardId, skinId } = params;
        // if (!item || item.type !== 2) {
        //   return error("Selected item isn't a skin.");
        // }
        // const balance = await contracts.skins.balanceOf($player.address, id);
        // if (balance.lte(0)) {
        //   return error("You do not own the skin.");
        // }
        const $playerUpdate = await $players.updateOne({
            socketId,
            "skins.cardId": cardId
        }, {
            $set: {
                "skins.$": { cardId, skinId }
            }
        });
        if (!$playerUpdate.modifiedCount) {
            // most likely failed because skins.$ object not found, in that case add
            // it instead.
            const $playerUpdate2 = await $players.updateOne({ socketId }, {
                $addToSet: {
                    skins: { cardId, skinId }
                }
            });
            if (!$playerUpdate2) {
                return error("Failed to set the skin.");
            }
        }
        socket.emit("selectSkin", { cardId, skinId });
    });
};

const startCustomGame = (socket, error) => {
    const socketId = socket.id;
    const { $lobbies, $players } = mongo;
    socket.on("startCustomGame", async () => {
        const $player = await $players.findOne({ socketId });
        if (!$player) {
            return error("Player not found, please relog.");
        }
        if (!$player.lobbyId) {
            return error("You are not in a lobby.");
        }
        const id = $player.lobbyId;
        const $lobby = await $lobbies.findOne({ id });
        if (!$lobby) {
            return error("Lobby not found.");
        }
        if ($player.name !== $lobby.host.name) {
            return error("You are not the host.");
        }
        const $lobbyDelete = await $lobbies.deleteOne({ id });
        if (!$lobbyDelete.deletedCount) {
            return error("Failed to delete lobby.");
        }
        const { host, challengee } = $lobby;
        await gameHelpers.startGame($lobby.id, GameType.CUSTOM, host.name, challengee.name);
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
    const { effect } = gameHelpers;
    socket.on("attackHero", async (params) => {
        const [getGameData, getGameError] = await gameHelpers.getGame(socketId);
        if (!getGameData) {
            return error(getGameError);
        }
        const { attacker } = params;
        const { $game, player, opponent } = getGameData;
        const playerMinion = player.field[attacker];
        const opponentHero = opponent.field.hero;
        const animations = [];
        if (!playerMinion) {
            return;
        }
        if (playerMinion.type === CardType.HERO) {
            return error("Heroes can't attack");
        }
        const fields = ["hero", "a", "b", "c", "d"];
        const selected = fields.find((field) => field === "hero");
        if (!selected) {
            return error("Error");
        }
        fields.splice(fields.indexOf(selected), 1);
        for (const field of fields) {
            const fieldCard = opponent.field[field];
            if (fieldCard) {
                const taunt = fieldCard.buffs.find((buff) => buff.id === EffectId.TAUNT);
                const marksmanship = playerMinion.buffs.find((buff) => buff.id === EffectId.MARKSMANSHIP);
                if (taunt && !marksmanship) {
                    return error("Cannot attack this minion, other has taunt.");
                }
            }
        }
        if (!playerMinion.canAttack) {
            const blazeBuff = playerMinion.buffs.find((buff) => buff.id === EffectId.BLAZE);
            if (blazeBuff && !blazeBuff.data.hasAttackedTwice) {
                blazeBuff.data.hasAttackedTwice = true;
            }
            else {
                return error("This card can't attack anymore this turn.");
            }
        }
        else {
            playerMinion.canAttack = false;
        }
        let isAttackNegated = false;
        const { trap } = opponent;
        const elusiveBuff = playerMinion.buffs.find((buff) => buff.id === EffectId.ELUSIVE);
        if (trap && trap.effect === EffectId.MIRRORS_EDGE && !elusiveBuff) {
            animations.push(...effect.mirrorsEdge({
                player,
                playerMinion,
                opponent,
                opponentTrap: trap
            }));
            if (await gameHelpers.isGameOver($game, animations)) {
                return;
            }
            isAttackNegated = true;
        }
        if (opponent.trap && opponent.trap.effect === EffectId.RICOCHET && !elusiveBuff) {
            animations.push(...effect.ricochet({
                player,
                playerMinion,
                opponent,
                opponentTrap: opponent.trap
            }));
            isAttackNegated = true;
        }
        if (trap && trap.effect === EffectId.RETRIBUTION) {
            gameHelpers.effect.retribution({ player, field: attacker });
        }
        if (trap && trap.effect === EffectId.FROSTBITE) {
            animations.push(...effect.frostbite({
                player,
                playerMinion,
                playerMinionField: attacker,
                opponent,
                opponentTrap: trap
            }));
        }
        if (trap && trap.effect === EffectId.RUSTY_NEEDLE) {
            gameHelpers.insertDebuff(playerMinion, EffectId.NEUROTOXIN);
        }
        if (trap && trap.effect === EffectId.NOXIOUS_FUMES) {
            const field = attacker;
            effect.noxiousFumes({ opponent: player, minion: playerMinion, field });
        }
        if (trap && trap.effect === EffectId.EXPLOSIVE) {
            const field = attacker;
            effect.explosive({ player, opponent, trap, field });
        }
        if (playerMinion.health && playerMinion.buffs.find((buff) => buff.id === EffectId.CORROSIVE_TOUCH)) {
            gameHelpers.effect.corrosiveTouch({ opponent });
        }
        if (playerMinion.health && playerMinion.buffs.find((buff) => buff.id === EffectId.RAMPAGE)) {
            effect.rampage({ minion: playerMinion });
        }
        if (playerMinion.health && playerMinion.buffs.find((buff) => buff.id === EffectId.BACKSTAB)) {
            effect.backstab({ player, opponent, playerMinion, playerMinionField: attacker });
        }
        if (!isAttackNegated) {
            animations.push({
                type: "SHAKE",
                playerA: player.name,
                playerANumber: 0,
                playerAField: attacker,
                playerB: opponent.name,
                playerBNumber: playerMinion.damage.current,
                playerBField: "hero"
            });
            opponentHero.health.current -= playerMinion.damage.current;
            animations.push({
                type: "HEALTH",
                field: "hero",
                name: opponent.name,
                increment: -playerMinion.damage.current
            });
        }
        if (await gameHelpers.isGameOver($game, animations)) {
            return;
        }
        await gameHelpers.attackMinionSave($game, animations);
    });
};

const attackMinion = (socket, error) => {
    const socketId = socket.id;
    const { effect } = gameHelpers;
    socket.on("attackMinion", async (params) => {
        const [getGameData, getGameError] = await gameHelpers.getGame(socketId);
        if (!getGameData) {
            return error(getGameError);
        }
        const { attacked, attacker } = params;
        if (attacked === "hero" || attacker === "hero") {
            return error("Cannot attack hero.");
        }
        const { $game, player, opponent } = getGameData;
        const playerMinion = player.field[attacker];
        const opponentMinion = opponent.field[attacked];
        const opponentTrap = opponent.trap;
        let animations = [];
        if (!playerMinion) {
            return error("Players minion not found.");
        }
        if (!opponentMinion) {
            return error("Opponents minion not found.");
        }
        // ---------------- TAUNT CHECK ----------------------
        const fields = ["hero", "a", "b", "c", "d"];
        const selected = fields.find((field) => field === attacked);
        if (!selected) {
            return error("Error");
        }
        fields.splice(fields.indexOf(selected), 1);
        let tauntFields = [];
        for (const field of fields) {
            const fieldCard = opponent.field[field];
            if (fieldCard) {
                const taunt = fieldCard.buffs.find((buff) => buff.id === EffectId.TAUNT);
                if (taunt) {
                    tauntFields.push(field);
                }
            }
        }
        console.log(!tauntFields.includes(attacked));
        // tauntFields = [a, c]
        if (tauntFields.length) {
            playerMinion.buffs.find((buff) => buff.id === EffectId.MARKSMANSHIP);
            if (tauntFields.includes(attacked)) {
                return error("Cannot attack this minion, other has taunt.");
            }
        }
        // -----------------------------------------------------
        if (opponentMinion.buffs.find((buff) => buff.id === EffectId.STEALTH) &&
            !playerMinion.buffs.find((buff) => buff.id === EffectId.SHADOWSTRIKE)) {
            return error("Can't attack minion with stealth.");
        }
        if (!playerMinion.canAttack) {
            const blazeBuff = playerMinion.buffs.find((buff) => buff.id === EffectId.BLAZE);
            if (blazeBuff && !blazeBuff.data.hasAttackedTwice) {
                blazeBuff.data.hasAttackedTwice = true;
            }
            else {
                return error("This card can't attack anymore this turn.");
            }
        }
        else {
            playerMinion.canAttack = false;
        }
        let isAttackNegated = false;
        const elusiveBuff = playerMinion.buffs.find((buff) => buff.id === EffectId.ELUSIVE);
        if (opponentTrap && opponentTrap.effect === EffectId.MIRRORS_EDGE && !elusiveBuff) {
            animations.push(...effect.mirrorsEdge({ player, playerMinion, opponent, opponentTrap }));
            if (await gameHelpers.isGameOver($game, animations)) {
                return;
            }
            isAttackNegated = true;
        }
        if (opponentTrap && opponentTrap.effect === EffectId.RICOCHET && !elusiveBuff) {
            animations.push(...effect.ricochet({ player, playerMinion, opponent, opponentMinionField: attacked, opponentTrap }));
            isAttackNegated = true;
        }
        if (opponentTrap && opponentTrap.effect === EffectId.FROSTBITE) {
            animations.push(...effect.frostbite({
                player,
                playerMinion,
                playerMinionField: attacker,
                opponent,
                opponentTrap
            }));
        }
        if (opponentTrap && opponentTrap.effect === EffectId.RUSTY_NEEDLE) {
            gameHelpers.insertDebuff(playerMinion, EffectId.NEUROTOXIN);
        }
        if (opponentTrap && opponentTrap.effect === EffectId.NOXIOUS_FUMES) {
            animations.push(...effect.noxiousFumes({
                player,
                playerMinion,
                playerMinionField: attacker,
                opponent,
                opponentTrap
            }));
        }
        if (opponentTrap && opponentTrap.effect === EffectId.EXPLOSIVE) {
            animations.push(...effect.explosive({
                player,
                playerMinionField: attacker,
                opponent,
                opponentTrap
            }));
        }
        if (opponentTrap && opponentTrap.effect === EffectId.CONSTRICTION) {
            animations.push(...effect.constriction({ player, playerMinion, opponent, opponentTrap, playerMinionField: attacker }));
        }
        if (playerMinion.buffs.find((buff) => buff.id === EffectId.POISONOUS_TOUCH)) {
            gameHelpers.insertDebuff(opponentMinion, EffectId.NEUROTOXIN);
        }
        if (playerMinion.buffs.find((buff) => buff.id === EffectId.CORROSIVE_TOUCH)) {
            gameHelpers.effect.corrosiveTouch({ opponent });
            if (await gameHelpers.isGameOver($game, animations)) {
                return;
            }
        }
        if (playerMinion.buffs.find((buff) => buff.id === EffectId.OVERPOWER)) {
            if (playerMinion.damage > opponentMinion.health) {
                gameHelpers.effect.overpower({ opponent, damage: playerMinion.damage.current - opponentMinion.health.current });
                if (await gameHelpers.isGameOver($game, animations)) {
                    return;
                }
            }
        }
        if (opponentMinion.buffs.find((buff) => buff.id === EffectId.POISONOUS_TOUCH)) {
            gameHelpers.insertDebuff(playerMinion, EffectId.NEUROTOXIN);
        }
        if (opponentMinion.buffs.find((buff) => buff.id === EffectId.CORROSIVE_TOUCH)) {
            gameHelpers.effect.corrosiveTouch({ opponent: player });
            if (await gameHelpers.isGameOver($game, animations)) {
                return;
            }
        }
        if (opponentMinion.buffs.find((buff) => buff.id === EffectId.OVERPOWER)) {
            if (opponentMinion.damage > playerMinion.health) {
                gameHelpers.effect.overpower({ opponent, damage: opponentMinion.damage.current - playerMinion.health.current });
                if (await gameHelpers.isGameOver($game, animations)) {
                    return;
                }
            }
        }
        if (!isAttackNegated) {
            // shake should play both animations simultaneously
            animations.push({
                type: "SHAKE",
                playerA: player.name,
                playerANumber: opponentMinion.damage.current,
                playerAField: attacker,
                playerB: opponent.name,
                playerBNumber: playerMinion.damage.current,
                playerBField: attacked
            });
            animations.push(...gameHelpers.deductHealth(player, playerMinion, opponentMinion.damage.current, attacker));
            animations.push(...gameHelpers.deductHealth(opponent, opponentMinion, playerMinion.damage.current, attacked));
        }
        if (playerMinion.health.current <= 0 || (playerMinion.health.current === 1 && opponentMinion.buffs.find((buff) => buff.id === EffectId.EXECUTE))) {
            if (player.trap && player.trap.effect === EffectId.LAST_STAND) ;
            else {
                const hasAcidicDeathBuff = playerMinion.buffs.find((buff) => buff.id === EffectId.ACIDIC_DEATH);
                const hasSelfDescturctDebuff = playerMinion.debuffs.find((debuff) => debuff.id === EffectId.SELF_DESTRUCT);
                if (player.trap && player.trap.effect === EffectId.REFLECTION) {
                    gameHelpers.effect.reflection({ player, opponent, trap: player.trap });
                }
                animations.push(...gameHelpers.moveToGraveyard(player, playerMinion, attacker));
                if (hasSelfDescturctDebuff) {
                    gameHelpers.effect.selfDestruct({ player });
                    if (await gameHelpers.isGameOver($game, animations)) {
                        return;
                    }
                }
                if (hasAcidicDeathBuff) {
                    effect.acidicDeath({ player, opponent });
                }
                Object.keys(player.field).forEach((key) => {
                    const minion = player.field[key];
                    if (!minion) {
                        return;
                    }
                    if (minion.buffs.find((buff) => buff.id === EffectId.RISING_FURY)) {
                        gameHelpers.effect.risingFury({ minionCard: minion });
                    }
                    if (minion.buffs.find((buff) => buff.id === EffectId.SACRIFICE)) {
                        if (playerMinion.klass === CardKlass.LIQUID) {
                            const minion = gameHelpers.getRandomMinion(player);
                            if (!minion) {
                                return;
                            }
                            minion.health.current += 3;
                        }
                    }
                });
            }
        }
        else {
            if (playerMinion.buffs.find((buff) => buff.id === EffectId.RAMPAGE)) {
                effect.rampage({ minion: playerMinion });
            }
        }
        if (opponentMinion.health.current <= 0 || (opponentMinion.health.current === 1 && playerMinion.buffs.find((buff) => buff.id === EffectId.EXECUTE))) {
            if (opponent.trap && opponent.trap.effect === EffectId.LAST_STAND) {
                animations.push(...gameHelpers.effect.lastStand({
                    opponent,
                    opponentMinion,
                    opponentMinionField: attacked,
                    opponentTrap: opponent.trap
                }));
            }
            else {
                const hasAcidicDeathBuff = playerMinion.buffs.find((buff) => buff.id === EffectId.ACIDIC_DEATH);
                const hasSelfDescturctDebuff = playerMinion.debuffs.find((debuff) => debuff.id === EffectId.SELF_DESTRUCT);
                if (opponent.trap && opponent.trap.effect === EffectId.REFLECTION) {
                    gameHelpers.effect.reflection({ player: opponent, opponent: player, trap: opponent.trap });
                }
                animations.push(...gameHelpers.moveToGraveyard(opponent, opponentMinion, attacked));
                if (hasSelfDescturctDebuff) {
                    gameHelpers.effect.selfDestruct({ player });
                    if (await gameHelpers.isGameOver($game, animations)) {
                        return;
                    }
                }
                if (hasAcidicDeathBuff) {
                    effect.acidicDeath({ player, opponent });
                }
            }
            Object.keys(opponent.field).forEach((key) => {
                const minion = opponent.field[key];
                if (!minion) {
                    return;
                }
                if (minion.buffs.find((buff) => buff.id === EffectId.RISING_FURY)) {
                    gameHelpers.effect.risingFury({ minionCard: minion });
                }
                if (minion.buffs.find((buff) => buff.id === EffectId.SACRIFICE)) {
                    if (opponentMinion.klass === CardKlass.LIQUID) {
                        const minion = gameHelpers.getRandomMinion(opponent);
                        if (!minion) {
                            return;
                        }
                        minion.health.current += 3;
                    }
                }
            });
        }
        else {
            if (opponentMinion.buffs.find((buff) => buff.id === EffectId.RAMPAGE)) {
                effect.rampage({ minion: opponentMinion });
            }
        }
        // $game.battleLogs.push(attacked, attacker, playerMinion.id, opponentMinion.id);
        await gameHelpers.attackMinionSave($game, animations);
    });
};

const endTurn = (socket, error) => {
    const socketId = socket.id;
    socket.on("endTurn", async () => {
        const [getGameData, getGameError] = await gameHelpers.getGame(socketId);
        const animations = [];
        if (!getGameData) {
            return error(getGameError);
        }
        const { $game, player, opponent } = getGameData;
        const card = opponent.deck.pop();
        if (!card) {
            return await gameHelpers.endGame($game.id, player.name);
        }
        opponent.hand.push(card);
        const manaDelta = 10 - opponent.field.hero.mana.current;
        player.field.hero.mana.current = 10;
        animations.push({
            type: "MANA_CAPACITY",
            field: "hero",
            name: opponent.name,
            increment: manaDelta
        });
        const playerMinionFields = Object.keys(player.field);
        playerMinionFields.forEach((field) => {
            const minion = player.field[field];
            if (!minion || minion.type === CardType.HERO || field === "hero") {
                return;
            }
            minion.canAttack = true;
            animations.push(...gameHelpers.effect.blaze({ player, playerMinion: minion, playerMinionField: field }));
            if (minion.buffs.find((buff) => buff.id === EffectId.REGENERATION)) {
                gameHelpers.effect.regeneration({ player });
            }
        });
        $game.currentPlayer = opponent.name;
        $game.currentTurn += 1;
        await gameHelpers.attackMinionSave($game, animations);
    });
};

const playMagic = (socket, error) => {
    const socketId = socket.id;
    const { effect } = gameHelpers;
    socket.on("playMagic", async (params) => {
        const [getGameData, getGameError] = await gameHelpers.getGame(socketId);
        const animations = [];
        if (!getGameData) {
            return error(getGameError);
        }
        const { gid, field, target } = params;
        const { $game, player, opponent } = getGameData;
        // if (field && opponent.field[field]?.buffs.find((buff) => buff.id === EffectId.ELUSIVE)) {
        //   return error("Selected card has Elusive buff.");
        // }
        const card = player.hand.find((card) => card.gid === gid);
        if (!card) {
            return error("Card not found in hand.");
        }
        if (card.type !== CardType.MAGIC) {
            return error("Selected card is not Magic.");
        }
        if (card.manaCost.current > player.field.hero.mana.current) {
            return error("Not enough mana.");
        }
        player.field.hero.mana.current -= card.manaCost.current;
        player.hand.splice(player.hand.indexOf(card), 1);
        player.graveyard.push(card);
        animations.push({
            type: "MAGIC",
            name: player.name,
            card: card
        }, {
            type: "MANA_CAPACITY",
            field: "hero",
            name: player.name,
            increment: -card.manaCost.current
        });
        const { trap } = opponent;
        if (trap && trap.effect === EffectId.SILENCE) {
            animations.push(...effect.silence({ opponent, trap }));
        }
        else {
            if (card.effect === EffectId.REBIRTH) {
                if (!target) {
                    return error("Target for revival not specified.");
                }
                if (!field) {
                    return error("Field for Special Summon not specified.");
                }
                if (field === "hero") {
                    return error("Cannot Summon on this field.");
                }
                if (player.field[field]) {
                    return error(`Minion already exists on the field ${field}.`);
                }
                const toRevive = player.graveyard.find((card) => card.gid === target);
                if (!toRevive) {
                    return error("Card with the given ID not found in the graveyard.");
                }
                if (toRevive.type !== CardType.MINION) {
                    return error("Selected card for revival must be a Minion.");
                }
                if (toRevive.effect === EffectId.ELUSIVE) {
                    return error("Rebirth negated.");
                }
                animations.push(...effect.rebirth({ player, minion: toRevive, field }));
            }
            if (card.effect === EffectId.DIMINISH) {
                if (!field) {
                    return error("Field for Effect not specified.");
                }
                if (field === "hero") {
                    return error("Cannot Summon on this field.");
                }
                const card = opponent.field[field];
                if (!card) {
                    return error(`Minion doesn't exist on the field ${field}.`);
                }
                const elusive = card.buffs.find((buff) => buff.id === EffectId.ELUSIVE);
                if (elusive) {
                    return error("Diminish negated.");
                }
                animations.push(...effect.diminish({
                    opponent,
                    opponentMinion: card,
                    opponentMinionField: field
                }));
            }
            if (card.effect === EffectId.RELOAD) {
                const drawnCard = player.deck.pop();
                if (!drawnCard) {
                    return error("You have no cards remaining to draw.");
                }
                effect.reload({ player, drawnCard });
            }
            if (card.effect === EffectId.VALOR) {
                animations.push(...effect.valor({ player, opponent }));
                if (await gameHelpers.isGameOver($game, animations)) {
                    return;
                }
            }
            if (card.effect === EffectId.SHELL) {
                animations.push(...effect.shell({ player }));
            }
            if (card.effect === EffectId.FORTITUDE) {
                if (!field) {
                    return error("Field not specified.");
                }
                if (field === "hero") {
                    return error("Hero not allowed.");
                }
                const playerMinion = player.field[field];
                if (!playerMinion) {
                    return error(`No minion on the ${field} field.`);
                }
                const playerMinionField = field;
                animations.push(...effect.fortitude({ player, playerMinion, playerMinionField }));
            }
            // IN DEVELOPMENT!
            if (card.effect === EffectId.ELECTRO_SHOCK) {
                const [success, message] = effect.electroShock({ player, opponent });
                if (!success) {
                    return error(message);
                }
            }
            if (card.effect === EffectId.CLEANSE) {
                const [success, message] = effect.cleanse({ player, field });
                if (!success) {
                    return error(message);
                }
            }
            if (card.effect === EffectId.TIDAL_WAVE) {
                const [success, message] = effect.tidalWave({ player });
                if (!success) {
                    return error(message);
                }
            }
            if (card.effect === EffectId.ACID_RAIN) {
                const [success, message] = effect.acidRain({ opponent });
                if (!success) {
                    return error(message);
                }
            }
            if (card.effect === EffectId.SMOKE_BOMB) {
                const [success, message] = effect.smokeBomb({ player });
                if (!success) {
                    return error(message);
                }
            }
            if (card.effect === EffectId.CONTAMINATED_AIR) {
                const [success, message] = effect.contaminatedAir({ player, opponent });
                if (!success) {
                    return error(message);
                }
            }
            if (card.effect === EffectId.IGNITE) {
                const [success, message] = effect.ignite({ player, opponent, field });
                if (!success) {
                    return error(message);
                }
            }
            if (card.effect === EffectId.CORRUPTION) {
                const [success, message] = effect.corruption({ player, field });
                if (!success) {
                    return error(message);
                }
            }
            if (card.effect === EffectId.HYSTERIA) {
                const [success, message] = effect.hysteria({ player, field });
                if (!success) {
                    return error(message);
                }
            }
        }
        $game.gameLogs.push({
            type: LogType.MAGIC,
            player: player.name,
            magicId: card.id
        });
        await gameHelpers.attackMinionSave($game, animations);
    });
};

const playMinion = (socket, error) => {
    const socketId = socket.id;
    const { effect } = gameHelpers;
    socket.on("playMinion", async (params) => {
        const animations = [];
        const [getGameData, getGameError] = await gameHelpers.getGame(socketId);
        if (!getGameData) {
            return error(getGameError);
        }
        const { $game, player, opponent } = getGameData;
        const { field, gid } = params;
        if (player.field[field]) {
            return error("Field already inhibits a Minion.");
        }
        const card = player.hand.find((card) => card.gid === gid);
        if (!card) {
            return error("Card not found in hand.");
        }
        if (card.type !== CardType.MINION) {
            return error("Selected card is not Minion.");
        }
        if (card.manaCost.current > player.field.hero.mana.current) {
            return error("Not enough mana.");
        }
        player.field.hero.mana.current -= card.manaCost.current;
        player.field[field] = card;
        const minion = player.field[field];
        if (!minion) {
            return error("Error summoning card.");
        }
        player.hand.splice(player.hand.indexOf(card), 1);
        animations.push({
            type: "SUMMON",
            name: player.name,
            field,
            minion,
            necromancyFixPositive: false
        }, {
            type: "MANA_CAPACITY",
            increment: -minion.manaCost.current,
            field: "hero",
            name: player.name
        });
        const { trap } = opponent;
        const isElusive = minion.effect === EffectId.ELUSIVE;
        // Step 1: Insert buffs / debuffs
        // Step 2: Check for on summon trap cards
        // Step 3: Trigger on summon effects
        // [1] INSERT BUFFS / DEBUFFS
        switch (minion.effect) {
            case EffectId.BLAZE: // Neutral
                const hasAttackedTwice = true;
                gameHelpers.insertBuff(minion, EffectId.BLAZE, { hasAttackedTwice });
                animations.push({
                    type: "FLOATING_TEXT",
                    field,
                    name: player.name,
                    text: "BLAZE"
                });
                break;
            case EffectId.ELUSIVE:
                gameHelpers.insertBuff(minion, EffectId.ELUSIVE);
                animations.push({
                    type: "FLOATING_TEXT",
                    field,
                    name: player.name,
                    text: "ELUSIVE"
                });
                break;
            case EffectId.REVENGE:
                gameHelpers.insertBuff(minion, EffectId.REVENGE);
                animations.push({
                    type: "FLOATING_TEXT",
                    field,
                    name: player.name,
                    text: "REVENGE"
                });
                break;
            case EffectId.UNITY: // Solid
                gameHelpers.insertBuff(minion, EffectId.UNITY);
                animations.push({
                    type: "FLOATING_TEXT",
                    field,
                    name: player.name,
                    text: "UNITY"
                });
                break;
            case EffectId.UNBREAKABLE:
                gameHelpers.insertBuff(minion, EffectId.UNBREAKABLE);
                animations.push({
                    type: "FLOATING_TEXT",
                    field,
                    name: player.name,
                    text: "UNBREAKABLE"
                });
                break;
            case EffectId.PROTECTOR:
                gameHelpers.insertBuff(minion, EffectId.TAUNT);
                animations.push({
                    type: "FLOATING_TEXT",
                    field,
                    name: player.name,
                    text: "TAUNT"
                });
                break;
            case EffectId.RISING_FURY: // Liquid
                gameHelpers.insertBuff(minion, EffectId.RISING_FURY);
                break;
            case EffectId.REGENERATION:
                gameHelpers.insertBuff(minion, EffectId.REGENERATION);
                break;
            case EffectId.SACRIFICE:
                gameHelpers.insertBuff(minion, EffectId.SACRIFICE);
                break;
            case EffectId.SHADOWSTRIKE:
                gameHelpers.insertBuff(minion, EffectId.SHADOWSTRIKE);
                break;
            case EffectId.LEECH:
                gameHelpers.insertBuff(minion, EffectId.LEECH);
                break;
            case EffectId.RESILIENT:
                gameHelpers.insertBuff(minion, EffectId.RESILIENT);
                break;
            // Gas
            case EffectId.ACIDIC_DEATH:
                gameHelpers.insertBuff(minion, EffectId.ACIDIC_DEATH);
                break;
            case EffectId.STEALTH:
                gameHelpers.insertBuff(minion, EffectId.STEALTH);
                break;
            case EffectId.POISONOUS_TOUCH:
                gameHelpers.insertBuff(minion, EffectId.POISONOUS_TOUCH);
                break;
            case EffectId.CORROSIVE_TOUCH:
                gameHelpers.insertBuff(minion, EffectId.CORROSIVE_TOUCH);
                break;
            // ---------- [ P L A S M A ] ----------
            case EffectId.SELF_DESTRUCT:
                gameHelpers.insertBuff(minion, EffectId.SELF_DESTRUCT);
                break;
            case EffectId.RAMPAGE:
                gameHelpers.insertBuff(minion, EffectId.RAMPAGE);
                break;
            case EffectId.BACKSTAB:
                gameHelpers.insertBuff(minion, EffectId.BACKSTAB);
                break;
            case EffectId.MARKSMANSHIP:
                gameHelpers.insertBuff(minion, EffectId.MARKSMANSHIP);
                break;
            case EffectId.OVERPOWER:
                gameHelpers.insertBuff(minion, EffectId.OVERPOWER);
                break;
            case EffectId.EXECUTE:
                gameHelpers.insertBuff(minion, EffectId.EXECUTE);
                break;
        }
        // [2] ON SUMMON TRAP TRIGGERS
        if (trap && !isElusive) {
            switch (trap.effect) {
                case EffectId.SMITE:
                    animations.push(...effect.smite({ player, opponent, minion, trap, field }));
                    break;
                case EffectId.BANISH:
                    effect.banish({
                        player,
                        opponent,
                        playerMinion: minion,
                        opponentTrap: trap,
                        playerMinionField: field
                    });
                    break;
                case EffectId.POISONED_GROUND:
                    effect.poisonedGround({ player: opponent, minion, trap });
                    break;
            }
        }
        else {
            // [3] TRIGGER ON SUMMON EFFECTS
            switch (minion.effect) {
                case EffectId.SHADOW_SURGE: // Neutral
                    animations.push(...effect.shadowSurge.onNormalSummon({
                        player,
                        playerMinion: minion,
                        playerMinionField: field
                    }));
                    break;
                case EffectId.QUICK_SHOT:
                    animations.push(...effect.quickShot({ opponent }));
                    break;
                case EffectId.NECROMANCY:
                    animations.push(...effect.necromancy({
                        player,
                        playerMinion: minion,
                        playerMinionField: field,
                        isPositive: false
                    }));
                    break;
                case EffectId.GLORY: // Solid
                    animations.push(...effect.glory({
                        player,
                        opponent,
                        minion,
                        playerMinionField: field,
                    }));
                    break;
                case EffectId.SPELLWEAVE:
                    animations.push(...effect.spellweave({
                        player,
                        playerMinion: minion,
                        playerMinionField: field
                    }));
                    break;
                case EffectId.SHIELDWALL:
                    animations.push(...effect.shieldwall({
                        player,
                        playerMinionField: field
                    }));
                    break;
                // ---------- [ G A S ] ----------
                case EffectId.TOXIC_SPRAY:
                    effect.toxicSpray({ opponent });
                    break;
                case EffectId.TOXIC_GAS:
                    effect.toxicGas({ opponent });
                    break;
            }
        }
        $game.gameLogs.push({
            type: LogType.SUMMON,
            field,
            player: player.name,
            minionId: minion.id
        });
        // await gameHelpers.saveGame($game, animations);
        await gameHelpers.attackMinionSave($game, animations);
    });
};

const playTrap = (socket, error) => {
    const socketId = socket.id;
    socket.on("playTrap", async (params) => {
        const [getGameData, getGameError] = await gameHelpers.getGame(socketId);
        const animations = [];
        if (!getGameData) {
            return error(getGameError);
        }
        const { $game, player } = getGameData;
        const { name, hand, trap } = player;
        const { gid } = params;
        if (trap) {
            return error("Trap Card is already set.");
        }
        const card = hand.find((card) => card.gid === gid);
        if (!card) {
            return error("Card not found in hand.");
        }
        if (card.type !== CardType.TRAP) {
            return error("Selected card is not Trap.");
        }
        if (card.manaCost.current > player.field.hero.mana.current) {
            return error("Not enough mana.");
        }
        player.field.hero.mana.current -= card.manaCost.current;
        hand.splice(hand.indexOf(card), 1);
        player.trap = card;
        animations.push({
            type: "TRAP_SET",
            name
        });
        // socket.emit("playTrap", {name});
        await gameHelpers.attackMinionSave($game, animations);
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
    const { $chats, $players } = mongo;
    socket.on("acceptFriend", async (params) => {
        const { name } = params;
        const $playerSenderUpdate = await $players.findOneAndUpdate({ socketId }, {
            $pull: {
                "social.requests": name
            },
            $push: {
                "social.friends": name
            }
        }, {
            returnDocument: "after"
        });
        if (!$playerSenderUpdate) {
            return error("Error updating sender.");
        }
        const $playerReceiverUpdate = await $players.findOneAndUpdate({ name }, {
            $push: {
                "social.friends": $playerSenderUpdate.name
            }
        }, {
            returnDocument: "after"
        });
        if (!$playerReceiverUpdate) {
            return error("Error updating receiver.");
        }
        const $chatInsert = await $chats.insertOne({
            players: [$playerSenderUpdate.name, $playerReceiverUpdate.name],
            lastSender: $playerSenderUpdate.name,
            unseen: 0,
            messages: []
        });
        if (!$chatInsert.insertedId) {
            return error("Error inserting chat.");
        }
        socket.emit("acceptFriendSender", {
            name: $playerReceiverUpdate.name,
            avatarId: $playerReceiverUpdate.avatarId,
            bannerId: $playerReceiverUpdate.bannerId,
            experience: $playerReceiverUpdate.experience,
            level: $playerReceiverUpdate.level,
            elo: $playerReceiverUpdate.elo,
            status: $playerReceiverUpdate.status,
            games: $playerReceiverUpdate.games,
            lastSender: $playerSenderUpdate.name
        });
        server.io.to($playerReceiverUpdate.socketId).emit("acceptFriendReceiver", {
            name: $playerSenderUpdate.name,
            avatarId: $playerSenderUpdate.avatarId,
            bannerId: $playerSenderUpdate.bannerId,
            experience: $playerSenderUpdate.experience,
            level: $playerSenderUpdate.level,
            elo: $playerSenderUpdate.elo,
            status: $playerSenderUpdate.status,
            games: $playerSenderUpdate.games,
        });
    });
};

const addFriend = (socket, error) => {
    const socketId = socket.id;
    const { $players } = mongo;
    socket.on("addFriend", async (params) => {
        const { name } = params;
        const [$playerSender, $playerReceiver] = await Promise.all([
            $players.findOne({ socketId }),
            $players.findOne({ name })
        ]);
        if (!$playerSender) {
            return error("Player sender not found.");
        }
        if (!$playerReceiver) {
            return error("Player receiver not found.");
        }
        if ($playerSender.name === name) {
            return error("You can't add yourself as a friend.");
        }
        if ($playerReceiver.social.blocked.includes($playerSender.name)) {
            return error("This player has blocked you.");
        }
        if ($playerSender.social.blocked.includes(name)) {
            return error("You have blocked this player.");
        }
        if ($playerReceiver.social.requests.includes($playerSender.name)) {
            return error("You have already sent the request to this player.");
        }
        if ($playerSender.social.requests.includes(name)) {
            return error("This player has already sent you the request.");
        }
        if ($playerSender.social.friends.includes(name)) {
            return error("This player is already your friend.");
        }
        const $playerUpdate = await $players.updateOne({ name }, {
            $push: {
                "social.requests": $playerSender.name
            }
        });
        if (!$playerUpdate.modifiedCount) {
            return error("Error updating player.");
        }
        socket.emit("notification", {
            color: "success",
            message: "Friend request sent."
        });
        server.io.to($playerReceiver.socketId).emit("addFriend", {
            name: $playerSender.name
        });
    });
};

const blockFriend = (socket, error) => {
    const socketId = socket.id;
    const { $chats, $players } = mongo;
    socket.on("blockFriend", async (params) => {
        const { name } = params;
        const $playerSenderUpdate = await $players.findOneAndUpdate({ socketId }, {
            $pull: {
                "social.friends": name
            },
            $push: {
                "social.blocked": name
            }
        });
        if (!$playerSenderUpdate) {
            return error("Sender not found.");
        }
        const $playerReceiverUpdate = await $players.findOneAndUpdate({ name }, {
            $pull: {
                "social.friends": $playerSenderUpdate.name
            }
        });
        if (!$playerReceiverUpdate) {
            return error("Receiver not found.");
        }
        const $chatDelete = await $chats.deleteOne({
            players: {
                $all: [$playerSenderUpdate.name, name]
            }
        });
        if (!$chatDelete.deletedCount) {
            return error("Error deleting chat.");
        }
        socket.emit("blockFriendSender", { name });
        server.io.to($playerReceiverUpdate.socketId).emit("blockFriendReceiver", {
            name: $playerSenderUpdate.name
        });
    });
};

const declineFriend = (socket, error) => {
    const socketId = socket.id;
    const { $players } = mongo;
    socket.on("declineFriend", async (params) => {
        const { name } = params;
        const $player = await $players.findOne({ socketId });
        if (!$player) {
            return error("Player not found, try relogging.");
        }
        const $playerUpdate = await $players.updateOne({
            name: $player.name
        }, {
            $pull: {
                "social.requests": name
            }
        });
        if (!$playerUpdate.modifiedCount) {
            return error("Failed to update account.");
        }
        socket.emit("declineFriend", { name });
    });
};

const readChatMessages = (socket, error) => {
    const socketId = socket.id;
    const { $chats, $players } = mongo;
    socket.on("readChatMessages", async (params) => {
        const { name } = params;
        const [$playerSender, $playerReceiver] = await Promise.all([
            $players.findOne({ socketId }),
            $players.findOne({ name })
        ]);
        if (!$playerSender) {
            return error("Player not found.");
        }
        if (!$playerReceiver) {
            return error("Receiver not found.");
        }
        const $chatUpdate = await $chats.updateOne({
            players: {
                $all: [$playerSender.name, name]
            }
        }, {
            $set: {
                unseen: 0
            }
        });
        if (!$chatUpdate) {
            return error("Error updating chat.");
        }
        socket.emit("readChatMessages", { name });
        server.io.to($playerReceiver.socketId).emit("readChatMessages", {
            name: $playerSender.name
        });
    });
};

const removeFriend = (socket, error) => {
    const socketId = socket.id;
    const { $chats, $players } = mongo;
    socket.on("removeFriend", async (params) => {
        const { name } = params;
        const [$playerSender, $playerReceiver] = await Promise.all([
            $players.findOne({ socketId }),
            $players.findOne({ name })
        ]);
        if (!$playerSender) {
            return error("Player sender not found.");
        }
        if (!$playerReceiver) {
            return error("Player receiver not found.");
        }
        const [$playerSenderUpdate, $playerReceiverUpdate, $chatDelete] = await Promise.all([
            $players.findOneAndUpdate({
                name: $playerSender.name
            }, {
                $pull: {
                    "social.friends": name
                }
            }, {
                returnDocument: "after"
            }),
            $players.findOneAndUpdate({ name }, {
                $pull: {
                    "social.friends": $playerSender.name
                }
            }, {
                returnDocument: "after"
            }),
            $chats.deleteOne({
                players: {
                    $all: [name, $playerSender.name]
                }
            })
        ]);
        if (!$playerSenderUpdate) {
            return error("Account sender not found.");
        }
        if (!$playerReceiverUpdate) {
            return error("Account receiver not found.");
        }
        if (!$chatDelete.deletedCount) {
            return error("Failed to delete chat.");
        }
        socket.emit("removeFriendSender", { name });
        server.io.to($playerReceiver.socketId).emit("removeFriendReceiver", {
            name: $playerSender.name
        });
    });
};

const sendChatMessage = (socket, error) => {
    const socketId = socket.id;
    const { $players, $chats } = mongo;
    socket.on("sendChatMessage", async (params) => {
        const { receiver, text } = params;
        if (text.length > 256) {
            return error("Message too long.");
        }
        const [$playerSender, $playerReceiver] = await Promise.all([
            $players.findOne({ socketId }),
            $players.findOne({
                name: receiver
            })
        ]);
        if (!$playerSender) {
            return error("Player sender not found, try relogging.");
        }
        if (!$playerReceiver) {
            return error("Player receiver not found, try relogging.");
        }
        if (!$playerSender.social.friends.includes(receiver)) {
            return error("This user isn't your friend.");
        }
        const $chat = await $chats.findOne({
            players: {
                $all: [$playerSender.name, receiver]
            }
        });
        if (!$chat) {
            return error("Chat not found.");
        }
        const date = Date.now();
        if ($chat.lastSender === $playerSender.name) {
            $chat.unseen += 1;
        }
        else {
            $chat.lastSender = $playerSender.name;
            $chat.unseen = 1;
        }
        $chat.messages.push({
            name: $playerSender.name,
            text,
            date
        });
        if ($chat.messages.length > 100) {
            $chat.messages.shift();
        }
        const $chatReplace = await $chats.replaceOne({
            players: {
                $all: [$playerSender.name, receiver]
            }
        }, $chat);
        if (!$chatReplace.modifiedCount) {
            return error("Error updating chat.");
        }
        const sender = $playerSender.name;
        socket.emit("sendChatMessageSender", { sender, receiver, text, date });
        server
            .io
            .to($playerReceiver.socketId)
            .emit("sendChatMessageReceiver", { sender, text, date });
    });
};

const setAvatar = (socket, error) => {
    const socketId = socket.id;
    const { $players } = mongo;
    socket.on("setAvatar", async (params) => {
        const { avatarId } = params;
        if (avatarId < 1000 || avatarId > 1999) {
            return error("Invalid avatar.");
        }
        const $player = await $players.findOne({ socketId });
        if (!$player) {
            return error("Player not found.");
        }
        if (avatarId === 1001 && $player.elo < 250) {
            return error("Can't select this avatar.");
        }
        if (avatarId === 1002 && $player.elo < 500) {
            return error("Can't select this avatar.");
        }
        if (avatarId === 1003 && $player.elo < 750) {
            return error("Can't select this avatar.");
        }
        const $playerUpdate = await $players.findOneAndUpdate({ socketId }, {
            $set: { avatarId }
        }, {
            returnDocument: "after"
        });
        if (!$playerUpdate) {
            return error("Failed to update player.");
        }
        const { name, social } = $playerUpdate;
        const socketIds = await playerHelpers.getSocketIds(social.friends);
        socket.emit("updatePlayer", { avatarId });
        server.io.to(socketIds).emit("updateFriend", { name, avatarId });
    });
};

const setBanner = (socket, error) => {
    const socketId = socket.id;
    const { $players } = mongo;
    socket.on("setBanner", async (params) => {
        const { bannerId } = params;
        if (bannerId < 2000 || bannerId > 2999) {
            return error("Invalid banner.");
        }
        // check whether player owns the avatar here!
        const $playerUpdate = await $players.findOneAndUpdate({ socketId }, {
            $set: { bannerId }
        }, {
            returnDocument: "after"
        });
        if (!$playerUpdate) {
            return error("Failed to update player.");
        }
        const { name, social } = $playerUpdate;
        const socketIds = await playerHelpers.getSocketIds(social.friends);
        socket.emit("updatePlayer", { bannerId });
        server.io.to(socketIds).emit("updateFriend", { name, bannerId });
    });
};

const unblockFriend = (socket, error) => {
    const socketId = socket.id;
    const { $players } = mongo;
    socket.on("unblockFriend", async (params) => {
        const { name } = params;
        const $playerUpdate = await $players.updateOne({ socketId }, {
            $pull: {
                "social.blocked": name
            }
        });
        if (!$playerUpdate.modifiedCount) {
            return error("Failed to update player.");
        }
        socket.emit("unblockFriend", { name });
    });
};

const updateFriend = (socket, error) => {
    const socketId = socket.id;
    const { $players } = mongo;
    socket.on("updateFriend", async () => {
        const $player = await $players.findOne({ socketId });
        if (!$player) {
            return error("Player not found.");
        }
        const { name, avatarId, bannerId, elo, level, experience, status, games } = $player;
        const friends = await playerHelpers.getSocketIds($player.social.friends);
        if (friends.length) {
            server.io.to(friends).emit("updateFriend", { name, avatarId, bannerId, elo, level, experience, status, games });
        }
    });
};

const sidenav = [
    acceptFriend,
    addFriend,
    blockFriend,
    declineFriend,
    readChatMessages,
    removeFriend,
    sendChatMessage,
    setAvatar,
    setBanner,
    unblockFriend,
    updateFriend
];

const requests = [...auth, ...client, ...game, ...sidenav];

process.on("unhandledRejection", (reason, promise) => {
    console.log(`Unhandled rejection: ${reason}`);
});
process.on("uncaughtException", (error, origin) => {
    console.log(`Uncaught Exception: ${error}`);
});
const cleanup = async () => {
    // await contracts.somGame["addItem"](101301n, 1n).catch(console.log);
    // await contracts.somGame["addItem"](101302n, 2n).catch(console.log);
    // await contracts.somGame["addItem"](101303n, 3n).catch(console.log);
    // await contracts.somGame["addItem"](101304n, 4n).catch(console.log);
    // await contracts.somGame["addItem"](101305n, 5n).catch(console.log);
    // await contracts.somGame["addItem"](101401n, 1n).catch(console.log);
    // await contracts.somGame["addItem"](101402n, 2n).catch(console.log);
    // await contracts.somGame["addItem"](101403n, 3n).catch(console.log);
    // await contracts.somGame["addItem"](101404n, 4n).catch(console.log);
    // await contracts.somGame["addItem"](101405n, 5n).catch(console.log);
    // await contracts.somGame["addItem"](101501n, 1n).catch(console.log);
    // await contracts.somGame["addItem"](101502n, 2n).catch(console.log);
    // await contracts.somGame["addItem"](101503n, 3n).catch(console.log);
    // await contracts.somGame["addItem"](101504n, 4n).catch(console.log);
    // await contracts.somGame["addItem"](101505n, 5n).catch(console.log);
    // remove all rankedQueuePlayers, casualQueuePlayers, and gamePopups when
    // restarting the server?
};
await cleanup();
server.app.use(express.static(path.join(process.cwd(), "frontend")));
server.app.get("/", (req, res) => res.sendFile(`${process.cwd()}/frontend/index.html`));
server.app.get("*", (req, res) => res.sendFile(`${process.cwd()}/frontend/index.html`));
server.io.on("connection", (socket) => {
    const error = (message) => {
        socket.emit("notification", {
            color: "warn",
            message
        });
        console.error(message);
    };
    // for token transfers, wallets already implement sending to address,
    // this allows players to send to "username"
    socket.on("getAddress", async ({ name }) => {
        const $player = await mongo.$players.findOne({ name });
        if (!$player) {
            return error("Player not found.");
        }
        if (!$player.address) {
            return error("This player hasn't connected an address yet.");
        }
        socket.emit("getAddress", { address: $player.address });
    });
    socket.on("claimRewards", async () => {
        const $player = await mongo.$players.findOne({ socketId: socket.id });
        if (!$player) {
            return error("Player not found.");
        }
        if (!$player.address) {
            return error("Can't claim, address not set.");
        }
        if (BigInt($player.rewards.ecr) < 1 && BigInt($player.rewards.ees) < 1) {
            return error("No rewards to claim");
        }
        const $playerUpdate = await mongo.$players.updateOne({ socketId: socket.id }, {
            $set: {
                "rewards.ees": "0",
                "rewards.ecr": "0"
            }
        });
        if (!$playerUpdate.modifiedCount) {
            return error("Error updating player.");
        }
        const tx = await contracts.somGame.claimRewards($player.address, BigInt($player.rewards.ees), BigInt($player.rewards.ecr)).catch(console.log);
        if (!tx) {
            return error("Couldn't push transaction, no tokens were minted.");
        }
        const fin = await tx.wait();
        if (!fin) {
            return error("Error transacting");
        }
        socket.emit("notification", { color: "success", message: "Claimed rewards." });
    });
    requests.forEach((request) => {
        request(socket, error);
    });
});
server.http.listen(process.env.PORT || 4201);
schedule("0 */24 * * *", async () => {
    for await (let $player of mongo.$players.find()) {
        if ($player.tasks.daily || $player.tasks.dailyAlternative >= 3) {
            $player.rewards.ecr = `${BigInt($player.rewards.ecr) + 1n * 10n ** 18n}`;
            $player.tasks.weekly += 1;
            if ($player.tasks.weekly >= 7) {
                $player.rewards.ecr = `${BigInt($player.rewards.ecr) + 3n * 10n ** 18n}`;
                $player.tasks.weekly = 0;
            }
        }
        else {
            $player.tasks.weekly = 0;
        }
        $player.tasks.daily = false;
        $player.tasks.dailyAlternative = 0;
        if ($player.elo > 250) {
            $player.elo -= 1;
        }
        if ($player.elo >= 250) { // silver
            $player.rewards.ees = `${BigInt($player.rewards.ees) + 1n * 10n ** 18n}`;
        }
        else if ($player.elo >= 500) { // gold
            $player.rewards.ees = `${BigInt($player.rewards.ees) + 3n * 10n ** 18n}`;
        }
        else if ($player.elo >= 750) { // master
            $player.rewards.ees = `${BigInt($player.rewards.ees) + 5n * 10n ** 18n}`;
        }
        await mongo.$players.replaceOne({ name: $player.name }, $player);
    }
    const [deployTimestamp, ees, ecr, enrg] = await Promise.all([
        contracts.somGame.deployTimestamp(),
        contracts.ethericEssence.totalSupply(),
        contracts.ethericCrystals.totalSupply(),
        contracts.ethericEnergy.totalSupply()
    ]);
    const POW = 10n ** 18n;
    const REWARD_PER_MS = 1000000n;
    const date = Date.now();
    const ecrStaked = (enrg * (1n * POW + ((BigInt(date) - deployTimestamp * 1000n) * REWARD_PER_MS))) / POW;
    const supply = ecr + ecrStaked;
    await Promise.all([
        mongo.$supplySnapshots.updateOne({
            name: "ees"
        }, {
            $push: {
                "snapshots": { date, supply: `${ees}` }
            }
        }),
        mongo.$supplySnapshots.updateOne({
            name: "ecr"
        }, {
            $push: {
                "snapshots": { date, supply: `${supply}` }
            }
        }),
        mongo.$supplySnapshots.updateOne({
            name: "enrg"
        }, {
            $push: {
                "snapshots": { date, supply: `${enrg}` }
            }
        })
    ]);
    const byLevel = (await mongo.$players
        .find()
        .limit(100)
        .sort({
        level: -1
    })
        .toArray()).map(({ name, elo, level, experience, avatarId, bannerId, games }) => ({ name, level, elo, experience, avatarId, bannerId, games }));
    const byElo = (await mongo.$players
        .find()
        .limit(100)
        .sort({
        elo: -1
    })
        .toArray()).map(($player) => {
        const { name, elo, level, experience, avatarId, bannerId, games } = $player;
        return { name, level, elo, experience, avatarId, bannerId, games };
    });
    await mongo.$leaderboards.updateOne({}, {
        $set: { level: byLevel, elo: byElo }
    });
    for (let { name } of byLevel) {
        const $player = await mongo.$players.findOne({ name });
        if ($player) {
            const newValue = `${BigInt($player.rewards.ecr) + 1n * 10n ** 18n}`;
            $player.rewards.ecr = newValue;
            await mongo.$players.replaceOne({ name }, $player);
        }
    }
    for (let { name } of byElo) {
        const $player = await mongo.$players.findOne({ name });
        if ($player) {
            const newValue = `${BigInt($player.rewards.ecr) + 3n * 10n ** 18n}`;
            $player.rewards.ecr = newValue;
            await mongo.$players.replaceOne({ name }, $player);
        }
    }
    server.io.emit("notification", {
        color: "success",
        message: "Leaderboards and tasks updated, rewards distributed!"
    });
});
//# sourceMappingURL=index.js.map
