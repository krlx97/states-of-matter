import { Wallet, Contract, verifyMessage } from 'ethers';
import SomGame from '@som/contracts/SomGame/artifacts/SomGame.json' assert { type: 'json' };
import SomSkins from '@som/contracts/SomTokens/artifacts/SomTokens.json' assert { type: 'json' };
import { MongoClient } from 'mongodb';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { cards, cardsView, items } from '@som/shared/data';
import { EffectId, CardType, PlayerStatus, GameType, QueueId, CardKlass, LogType } from '@som/shared/enums';
import { randomInt } from 'crypto';
import jwt from 'jsonwebtoken';
import { compare, hash } from 'bcrypt';

// const provider = new JsonRpcProvider("https://testnet.telos.net", undefined, {
//   batchMaxCount: 1
// });
const provider = undefined;
const signer = new Wallet("0x36558f992d19662cdea021407513e14f83f47917ba0a28fd879ff148afd0edd2", provider);
const gameKey = "0xA1584c8E3e572101D0D28A9ebb1784Af9f0fBCd4";
const skinsKey = "0x759F6751A243cc8EacC959bd10A910831A670720";
const game$1 = new Contract(gameKey, SomGame.abi, signer);
const skins = new Contract(skinsKey, SomSkins.abi, signer);
const contracts = { game: game$1, skins };

const mongoClient = await MongoClient.connect("mongodb://127.0.0.1:27017");
const eternitas = mongoClient.db("eternitas");
const som = mongoClient.db("som");
const mongo = {
    $accounts: eternitas.collection("accounts"),
    $chats: eternitas.collection("chats"),
    $casualQueuePlayers: som.collection("casualQueuePlayers"),
    $games: som.collection("games"),
    $gamePopups: som.collection("gamePopups"),
    $lobbies: som.collection("lobbies"),
    $marketItems: som.collection("marketItems"),
    $players: som.collection("players"),
    $rankedQueuePlayers: som.collection("rankedQueuePlayers")
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

const lastStand = (params) => {
    const { minion, opponent, trap } = params;
    minion.health = 1;
    minion.buffs.push({ id: EffectId.TAUNT, data: {} });
    opponent.graveyard.push(trap);
    opponent.trap = undefined;
    return [true, "Last stand triggered"];
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
        return [false, "No copy of the card found."];
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
    return [true, ``];
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
    params.minion.damage += 3;
    params.player.graveyard.push(params.trap);
    params.player.trap = undefined;
    return [true, ""];
};

const deductHealth = (player, minion, damage) => {
    const shieldBuff = minion.buffs.find((buff) => buff.id === EffectId.SHIELD);
    const animations = [];
    if (shieldBuff) { // has shield
        const amt = shieldBuff.data.amount;
        if (amt > damage) { // shield reduced
            shieldBuff.data.amount -= damage;
            animations.push({
                type: "FLOATING_TEXT",
                field: "a",
                name: player.name,
                text: `-${damage} Shield`
            });
        }
        else if (amt <= damage) { // shield broken
            if (player.trap && player.trap.effect === EffectId.HEART_OF_STEEL) {
                heartOfSteel({ minion, player, trap: player.trap });
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
            const index = minion.buffs.indexOf(shieldBuff);
            minion.buffs.splice(index, 1);
        }
    }
    else { // no shield
        if (minion.buffs.find((buff) => buff.id === EffectId.RESILIENT)) {
            minion.health.current -= 1;
        }
        else {
            minion.health.current -= damage;
        }
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
        animations.push(...deductHealth(player, minion, 1));
        if (minion.health.current <= 0) {
            const { trap } = player;
            if (trap && trap.effect === EffectId.LAST_STAND) {
                lastStand({ minion, opponent: player, trap });
            }
            else {
                const hasAcidicDeathBuff = minion.buffs.find((buff) => buff.id === EffectId.ACIDIC_DEATH);
                moveToGraveyard(player, minion, key);
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
        animations.push(...deductHealth(opponent, minion, 1));
        if (minion.health.current <= 0) {
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
    return animations;
};

const banish = (params) => {
    const { player, opponent, minion, trap, field } = params;
    player.field[field] = undefined;
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
    const card = opponent.field[field];
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
        deductHealth(opponent, Minion, 2);
        if (minion.health <= 0) {
            moveToGraveyard(opponent, Minion, key);
            insertBuff(minion, EffectId.TAUNT); // refactor this, minion = player, Minion = opponent
        }
    }
    return [true, ""];
};

const mirrorsEdge = (params) => {
    const { player, playerMinion, opponent, opponentTrap } = params;
    player.field.hero.health -= playerMinion.damage;
    opponent.graveyard.push(opponentTrap);
    opponent.trap = undefined;
    return [{
            type: "TRAP",
            id: opponentTrap.id
        }, {
            type: "DAMAGE",
            field: "hero",
            damageTaken: playerMinion.damage,
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
    const blazeBuff = params.minion.buffs.find((buff) => buff.id === EffectId.BLAZE);
    if (!blazeBuff) {
        return [false, "Blaze buff not found."];
    }
    blazeBuff.data.hasAttackedTwice = false;
    return [true, ""];
};

const insertDebuff = (card, id, data = {}) => {
    card.debuffs.push({ id, data });
    return [true, "Debuff added."];
};

const necromancy = (params) => {
    const { minion, isPositive } = params;
    if (isPositive) {
        minion.health += 2;
        minion.damage += 2;
        insertBuff(minion, EffectId.NECROMANCY, {
            health: 2,
            damage: 2
        });
    }
    else {
        minion.health -= 2;
        minion.damage -= 2;
        insertDebuff(minion, EffectId.NECROMANCY, {
            health: -2,
            damage: -2
        });
    }
    return [true, ""];
};

const quickShot = (params) => {
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
        deductHealth(opponent, minion, 2);
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
    if (player.field[field]) {
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
    player.field[field] = toRevive;
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
    const { player, playerMinion, opponent, opponentTrap } = params;
    const animations = [];
    const possibleMinions = [];
    const minionKeys = Object.keys(player.field);
    minionKeys.forEach((key) => {
        const minion = player.field[key];
        if (minion) {
            const hasElusiveBuff = minion.buffs.find((buff) => buff.id === EffectId.ELUSIVE);
            if (!hasElusiveBuff) {
                possibleMinions.push({ minion, key });
            }
        }
    });
    // animations.push({
    //   type: "TRAP",
    //   id: opponentTrap.id,
    //   name: opponent.name
    // });
    if (possibleMinions.length) {
        let randomMinion = randomInt(possibleMinions.length);
        let { minion, key } = possibleMinions[randomMinion];
        deductHealth(player, minion, playerMinion.damage);
        animations.push({
            type: "FLOATING_TEXT",
            field: key,
            name: player.name,
            text: "Ricochet"
        }, {
            type: "DAMAGE",
            damageTaken: playerMinion.damage,
            field: key,
            name: player.name
        });
        if (minion.health <= 0) {
            moveToGraveyard(player, minion, key);
            animations.push({
                type: "DEATH",
                field: key,
                name: player.name
            });
        }
    }
    opponent.graveyard.push(opponentTrap);
    opponent.trap = undefined;
    return animations;
};

const shell = (params) => {
    const { player } = params;
    const keys = Object.keys(player.field);
    keys.forEach((field) => {
        const minion = player.field[field];
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
        const minion = player.field[field];
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
        deductHealth(opponent, minion, 1);
        insertDebuff(minion, EffectId.NEUROTOXIN);
        if (minion.health <= 0) {
            moveToGraveyard(opponent, minion, key);
        }
    }
    return [true, ""];
};

const valor = (params) => {
    const { opponent } = params;
    const minionKeys = Object.keys(opponent.field);
    let totalDamage = 0;
    minionKeys.forEach((key) => {
        const minion = opponent.field[key];
        if (minion) {
            const shieldBuff = minion.buffs.find((buff) => buff.id === EffectId.SHIELD);
            if (shieldBuff) {
                totalDamage += shieldBuff.data.amount;
                minion.buffs.splice(minion.buffs.indexOf(shieldBuff, 1));
            }
        }
    });
    opponent.field.hero.health -= totalDamage;
    return [true, ""];
};

const fortitude = (params) => {
    const { player, field } = params;
    if (!field) {
        return [false, "Field not specified."];
    }
    const minion = player.field[field];
    if (!minion || minion.type === CardType.HERO) {
        return [false, `No minion on the ${field} field.`];
    }
    deductHealth(player, minion, 1);
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
        return [false, "Field not specified."];
    }
    const minion = player.field[field];
    if (!minion) {
        return [false, `No minion on the ${field} field.`];
    }
    minion.debuffs = [];
    return [true, ""];
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
    opponent.field.hero.health -= damageToHero;
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
                if (minion.damage > 0) {
                    minion.damage -= 1;
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
    deductHealth(player, playerMinion, damage);
    animations.push({
        type: "FLOATING_TEXT",
        field: playerMinionField,
        name: player.name,
        text: "Noxious Fumes"
    }, {
        type: "DAMAGE",
        damageTaken: damage,
        field: playerMinionField,
        name: player.name
    });
    if (playerMinion.health <= 0) {
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
    const { opponent, minion } = params;
    opponent.field.hero.mana -= 1;
    minion.damage += 2;
    return [true, ""];
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
    const { player, playerMinion, opponent, opponentTrap } = params;
    const fields = Object.keys(player.field);
    const sum = fields.reduce((amount, field) => {
        const minion = player.field[field];
        return minion && minion.buffs.find((buff) => buff.id === EffectId.OVERCHARGE) ? amount + 1 : amount;
    }, 0);
    if (playerMinion.damage >= sum) {
        playerMinion.damage -= sum;
    }
    else {
        playerMinion.damage = 0;
    }
    opponent.graveyard.push(opponentTrap);
    opponent.trap = undefined;
    return [true, "Last stand triggered"];
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
    // await $games.replaceOne({id: $game.id}, $game);
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
                // maxHealth: health,
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

const endGame = async (gameId, winnerName) => {
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
            elo: $game.type === GameType.RANKED ? 20 : 0
        });
        io.to($playerA.socketId).emit("gameEnded", {
            isWinner: false,
            gameType: $game.type,
            experience: 90 + $game.currentTurn,
            elo: $game.type === GameType.RANKED ? -20 : 0
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
    const inserted = await $gamePopups.insertOne({
        id,
        type,
        playerA: {
            name: a.name,
            avatarId: 1,
            level: a.level,
            elo: a.elo,
            hasAccepted: false
        },
        playerB: {
            name: b.name,
            avatarId: 1,
            level: b.level,
            elo: b.elo,
            hasAccepted: false
        }
    });
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
    io.to(a.socketId).emit("gamePopup");
    io.to(b.socketId).emit("gamePopup");
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
                    maxHealth: 20,
                    maxMana: 10,
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
                    maxHealth: 20,
                    maxMana: 10,
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

const isGameOver = async (game) => {
    if (game.playerA.field.hero.health <= 0) {
        await endGame(game.id, game.playerB.name);
        return true;
    }
    else if (game.playerB.field.hero.health <= 0) {
        await endGame(game.id, game.playerA.name);
        return true;
    }
    return false;
};

const saveGame = async (game) => {
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
        game: generateGameView(game, $playerA.name)
    });
    io.to($playerB.socketId).emit("reloadGameState", {
        game: generateGameView(game, $playerB.name)
    });
};

const startGame = async (id, type, playerA, playerB) => {
    const { $accounts, $games, $players } = mongo;
    const { io } = server;
    const [$playerA, $playerB, $accountA, $accountB] = await Promise.all([
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
        $accounts.findOne({
            name: playerA
        }),
        $accounts.findOne({
            name: playerB
        }),
    ]);
    if (!$playerA || !$playerB || !$accountA || !$accountB) {
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
            avatarId: $accountA.avatarId,
            level: $playerA.level,
            elo: $playerA.elo
        },
        playerB: {
            name: $playerB.name,
            avatarId: $accountB.avatarId,
            level: $playerB.level,
            elo: $playerB.elo
        },
        game: generateGameView(game, $playerA.name)
    });
    io.to($playerB.socketId).emit("startGame", {
        playerA: {
            name: $playerA.name,
            avatarId: $accountA.avatarId,
            level: $playerA.level,
            elo: $playerA.elo
        },
        playerB: {
            name: $playerB.name,
            avatarId: $accountB.avatarId,
            level: $playerB.level,
            elo: $playerB.elo
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

const getSocketIds = async (players) => {
    return await mongo
        .$players
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

const playerHelpers = { getSocketIds, isDeckValid };

const authenticate = (socket, error) => {
    const socketId = socket.id;
    const { $accounts, $chats, $games, $lobbies, $players } = mongo;
    socket.on("authenticate", async (params) => {
        const { token } = params;
        const decoded = jwt.verify(token, "som");
        const { name } = decoded;
        const $account = await $accounts.findOne({ name });
        if (!$account) {
            return error("Account not found.");
        }
        const $player = await $players.findOneAndUpdate({ name: $account.name }, [{
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
            return error("Error updating player.");
        }
        const friendsView = [];
        for (const friendname of $account.social.friends) {
            const [friend, friendAcc, chat] = await Promise.all([
                $players.findOne({
                    name: friendname
                }),
                $accounts.findOne({
                    name: friendname
                }),
                $chats.findOne({
                    players: {
                        $all: [$player.name, friendname]
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
        const { lobbyId, gameId } = $player;
        let lobbyView;
        let gameView;
        if (lobbyId) {
            const $lobby = await $lobbies.findOne({ id: lobbyId });
            if (!$lobby) {
                return error("You are currently in a lobby that cannot be found. (Contact dev)");
            }
            const { id, host, challengee } = $lobby;
            lobbyView = { id, host, challengee };
        }
        else if (gameId) {
            const $game = await $games.findOne({ id: gameId });
            if (!$game) {
                return error("You are currently in a game that cannot be found. (Contact dev)");
            }
            gameView = gameHelpers.generateGameView($game, $player.name);
        }
        const accountView = {
            name: $account.name,
            address: $account.address,
            nonce: $account.nonce + 1,
            avatarId: $account.avatarId,
            bannerId: $account.bannerId,
            social: {
                friends: friendsView,
                requests: $account.social.requests,
                blocked: $account.social.blocked,
                chat: {
                    name: "",
                    status: 0,
                    avatarId: 0,
                    messages: [],
                    isOpen: false
                }
            }
        };
        const playerView = {
            name: $player.name,
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
            games: $player.games,
            decks: $player.decks.map((deck) => ({
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
            })),
            skins: $player.skins,
            tutorial: $player.tutorial
        };
        socket.emit("signin", {
            accountView,
            gameView,
            lobbyView,
            playerView
        });
    });
};

const disconnect = (socket, error) => {
    const socketId = socket.id;
    const { $accounts, $players } = mongo;
    socket.on("disconnect", async () => {
        const $playerUpdate = await $players.findOneAndUpdate({ socketId }, {
            $set: {
                socketId: "",
                status: PlayerStatus.OFFLINE
            }
        }, {
            returnDocument: "after"
        });
        if (!$playerUpdate) {
            return error("Error updating player.");
        }
        const { name, status } = $playerUpdate;
        const $account = await $accounts.findOne({ name });
        if (!$account) {
            return error("Account not found.");
        }
        const socketIds = await playerHelpers.getSocketIds($account.social.friends);
        server.io.to(socketIds).emit("updateFriend", { name, status });
    });
};

const getNonce = (socket, error) => {
    const { $accounts } = mongo;
    socket.on("getNonce", async (params) => {
        const { address } = params;
        const $account = await $accounts.findOne({ address });
        if (!$account) {
            return error("Account not found.");
        }
        const { nonce } = $account;
        socket.emit("getNonce", { nonce });
    });
};

const signinMetamask = (socket, error) => {
    const socketId = socket.id;
    const { $accounts, $chats, $games, $lobbies, $players } = mongo;
    socket.on("signinMetamask", async (params) => {
        const { address, signature, rememberMe } = params;
        const acc = await $accounts.findOne({ address });
        if (!acc) {
            return error("Account not found.");
        }
        const recoveredAddress = verifyMessage(`signin${acc.nonce}`, signature);
        if (recoveredAddress !== acc.address) {
            return error("Invalid signature.");
        }
        const $accountUpdate = await $accounts.updateOne({ address }, {
            $set: {
                nonce: acc.nonce + 1
            }
        });
        if (!$accountUpdate.modifiedCount) {
            return error("Error updating account.");
        }
        let token;
        if (rememberMe) {
            token = jwt.sign({ name: acc.name }, "som", {
                expiresIn: "30d"
            });
        }
        const $player = await $players.findOneAndUpdate({ name: acc.name }, [{
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
            return error("Error updating player.");
        }
        const friendsView = [];
        for (const friendname of acc.social.friends) {
            const [friend, friendAcc, chat] = await Promise.all([
                $players.findOne({
                    name: friendname
                }),
                $accounts.findOne({
                    name: friendname
                }),
                $chats.findOne({
                    players: {
                        $all: [$player.name, friendname]
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
        const { lobbyId, gameId } = $player;
        let lobbyView;
        let gameView;
        if (lobbyId) {
            const $lobby = await $lobbies.findOne({ id: lobbyId });
            if (!$lobby) {
                return error("You are currently in a lobby that cannot be found. (Contact dev)");
            }
            const { id, host, challengee } = $lobby;
            lobbyView = { id, host, challengee };
        }
        else if (gameId) {
            const $game = await $games.findOne({ id: gameId });
            if (!$game) {
                return error("You are currently in a game that cannot be found. (Contact dev)");
            }
            gameView = gameHelpers.generateGameView($game, $player.name);
        }
        const accountView = {
            name: acc.name,
            address: acc.address,
            nonce: acc.nonce + 1,
            avatarId: acc.avatarId,
            bannerId: acc.bannerId,
            social: {
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
            }
        };
        const playerView = {
            name: $player.name,
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
            games: $player.games,
            decks: $player.decks.map((deck) => ({
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
            })),
            skins: $player.skins,
            tutorial: $player.tutorial
        };
        socket.emit("signin", {
            accountView,
            gameView,
            lobbyView,
            playerView,
            token
        });
    });
};

const signinPassword = (socket, error) => {
    const socketId = socket.id;
    const { $accounts, $chats, $games, $lobbies, $players } = mongo;
    socket.on("signinPassword", async (params) => {
        const { name, password, rememberMe } = params;
        let lobby, game;
        const acc = await $accounts.findOne({ name });
        if (!acc) {
            return error(`Account ${name} not found.`);
        }
        if (!acc.passwordHash) {
            return error("Must login through metamask.");
        }
        const isCorrectPassword = await compare(password, acc.passwordHash);
        if (!isCorrectPassword) {
            return error("Invalid password.");
        }
        let token;
        if (rememberMe) {
            token = jwt.sign({ name }, "som", {
                expiresIn: "30d"
            });
        }
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
            return error("Error updating player.");
        }
        const friendsView = [];
        for (const friendname of acc.social.friends) {
            const [friend, friendAcc, chat] = await Promise.all([
                $players.findOne({
                    name: friendname
                }),
                $accounts.findOne({
                    name: friendname
                }),
                $chats.findOne({
                    players: {
                        $all: [$player.name, friendname]
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
        const { lobbyId, gameId } = $player;
        let gameView;
        let lobbyView;
        if (lobbyId) {
            lobby = await $lobbies.findOne({ id: lobbyId });
            if (!lobby) {
                return error("You are currently in a lobby that cannot be found. (Contact dev)");
            }
            lobbyView = lobby;
        }
        else if (gameId) {
            game = await $games.findOne({ id: gameId });
            if (!game) {
                return error("You are currently in a game that cannot be found. (Contact dev)");
            }
            gameView = gameHelpers.generateGameView(game, $player.name);
        }
        const accountView = {
            name,
            address: acc.address,
            nonce: acc.nonce,
            avatarId: acc.avatarId,
            bannerId: acc.bannerId,
            social
        };
        const playerView = {
            name: $player.name,
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
            games: $player.games,
            decks: $player.decks.map((deck) => ({
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
            })),
            skins: $player.skins,
            tutorial: $player.tutorial
        };
        socket.emit("signin", {
            accountView,
            playerView,
            lobbyView,
            gameView,
            token
        });
    });
};

const signupMetamask = (socket, error) => {
    const { $accounts, $players } = mongo;
    socket.on("signupMetamask", async (params) => {
        const { name, address, signature } = params;
        if (name.length < 3) {
            return error("Minimum 3 characters.");
        }
        if (name.length > 16) {
            return error("Maximum 16 characters.");
        }
        const $account = await $accounts.findOne({ name });
        if ($account) {
            return error("Name taken.");
        }
        const recoveredAddress = verifyMessage("signup", signature);
        if (recoveredAddress !== address) {
            return error("Invalid signature.");
        }
        const [insertAccount, insertPlayer] = await Promise.all([
            $accounts.insertOne({
                name,
                passwordHash: "",
                address,
                nonce: 0,
                avatarId: 0,
                bannerId: 0,
                social: {
                    friends: [],
                    requests: [],
                    blocked: []
                }
            }),
            $players.insertOne({
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
                    inventory: false
                }
            })
        ]);
        if (!insertAccount.insertedId) {
            if (insertPlayer.insertedId) {
                await $players.deleteOne({
                    _id: insertPlayer.insertedId
                });
            }
            return error("Error creating account, please try again.");
        }
        if (!insertPlayer.insertedId) {
            if (insertAccount.insertedId) {
                await $accounts.deleteOne({
                    _id: insertAccount.insertedId
                });
            }
            return error("Error creating player, please try again.");
        }
        socket.emit("notification", "Account created successfully.");
    });
};

const signupPassword = (socket, error) => {
    const { $accounts, $players } = mongo;
    socket.on("signupPassword", async (params) => {
        const { name, password } = params;
        if (name.length < 3) {
            return error("Minimum 3 characters.");
        }
        if (name.length > 16) {
            return error("Maximum 16 characters.");
        }
        const $account = await $accounts.findOne({ name });
        if ($account) {
            return error("Name taken.");
        }
        const passwordHash = await hash(password, 12);
        const [insertAccount, insertPlayer] = await Promise.all([
            $accounts.insertOne({
                name,
                passwordHash,
                address: "",
                nonce: 0,
                avatarId: 0,
                bannerId: 0,
                social: {
                    friends: [],
                    requests: [],
                    blocked: []
                }
            }),
            $players.insertOne({
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
                    inventory: false
                }
            })
        ]);
        if (!insertAccount.insertedId) {
            if (insertPlayer.insertedId) {
                await $players.deleteOne({
                    _id: insertPlayer.insertedId
                });
            }
            return error("Error creating account, please try again.");
        }
        if (!insertPlayer.insertedId) {
            if (insertAccount.insertedId) {
                await $accounts.deleteOne({
                    _id: insertAccount.insertedId
                });
            }
            return error("Error creating player, please try again.");
        }
        socket.emit("notification", "Account created successfully.");
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
        if (playerA.hasAccepted || playerB.hasAccepted) {
            const $gamePopupDelete = await $gamePopups.deleteOne({ id });
            if (!$gamePopupDelete.deletedCount) {
                return error("Error deleting game popup.");
            }
            await gameHelpers.startGame(id, type, playerA.name, playerB.name);
        }
        else {
            if (playerA.name === $player.name) {
                playerA.hasAccepted = true;
            }
            else if (playerB.name === $player.name) {
                playerB.hasAccepted = true;
            }
            const [$playerA, $playerB, $gamePopupReplace] = await Promise.all([
                $players.findOne({
                    name: playerA.name
                }),
                $players.findOne({
                    name: playerB.name
                }),
                $gamePopups.replaceOne({ id }, $gamePopup)
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
            server.io.to([$playerA.socketId, $playerB.socketId]).emit("acceptGame");
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
            challengee.name && $players.findOneAndUpdate({
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
        if (challengee.name) {
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
    const { $accounts, $players, $lobbies } = mongo;
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
        const { name } = $player;
        const $account = await $accounts.findOne({ name });
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
    const { $accounts, $players } = mongo;
    socket.on("getLeaderboards", async () => {
        const byLevel = (await $players
            .find()
            .limit(100)
            .sort({
            level: -1
        })
            .toArray()).map(({ name, level }) => ({ name, level, avatarId: 1 }));
        for (let i = 0; i < byLevel.length; i += 1) {
            const $account = await $accounts.findOne({ name: byLevel[i].name });
            if (!$account) {
                return;
            }
            const { avatarId } = $account;
            byLevel[i].avatarId = avatarId;
        }
        const byElo = (await $players
            .find()
            .limit(100)
            .sort({
            elo: -1
        })
            .toArray()).map(({ name, elo }) => ({ name, elo, avatarId: 1 }));
        for (let i = 0; i < byElo.length; i += 1) {
            const $account = await $accounts.findOne({ name: byElo[i].name });
            if (!$account) {
                return;
            }
            const { avatarId } = $account;
            byElo[i].avatarId = avatarId;
        }
        socket.emit("getLeaderboards", { byLevel, byElo });
    });
};

const joinLobby = (socket, error) => {
    const socketId = socket.id;
    const { $accounts, $lobbies, $players } = mongo;
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
        if ($lobby.challengee.name) {
            return error("Lobby is full.");
        }
        if (!playerHelpers.isDeckValid($player.decks[$player.deckId])) {
            return error("Invalid deck.");
        }
        const { name } = $player;
        const $account = await $accounts.findOne({ name });
        if (!$account) {
            return error("Eternitas account not found for player.");
        }
        const { avatarId } = $account;
        const [$lobbyUpdate, $playerUpdate, $playerHost] = await Promise.all([
            $lobbies.findOneAndUpdate({ id }, {
                $set: {
                    challengee: { name, avatarId }
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
                    challengee: {
                        name: "",
                        avatarId: 0
                    }
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
        socket.emit("notification", "Deck saved successfully.");
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
    const { $accounts, $players } = mongo;
    socket.on("selectSkin", async (params) => {
        const $player = await $players.findOne({ socketId });
        if (!$player) {
            return error("Player not found.");
        }
        const { name } = $player;
        const $account = await $accounts.findOne({ name });
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
        const $playerUpdate = await $players.updateOne({
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
            const $playerUpdate2 = await $players.updateOne({ socketId }, {
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
        const playerMinion = player.minion[attacker];
        const opponentHero = opponent.hero;
        const animations = [];
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
            animations.push(...effect.mirrorsEdge({
                player,
                playerMinion,
                opponent,
                opponentTrap: trap
            }));
            if (await gameHelpers.isGameOver($game)) {
                return;
            }
        }
        if (opponent.trap && opponent.trap.effect === EffectId.RICOCHET) {
            animations.push(...effect.ricochet({
                player,
                playerMinion,
                opponent,
                opponentTrap: opponent.trap
            }));
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
            effect.backstab({ opponent, minion: playerMinion }); // only trigger, handle animation here
        }
        opponentHero.health -= playerMinion.damage;
        if (await gameHelpers.isGameOver($game)) {
            return;
        }
        await gameHelpers.saveGame($game);
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
        const fields = ["hero", "a", "b", "c", "d"];
        const selected = fields.find((field) => field === attacked);
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
        let isAttackNegated = false;
        if (opponentTrap && opponentTrap.effect === EffectId.MIRRORS_EDGE) {
            animations.push(...effect.mirrorsEdge({ player, playerMinion, opponent, opponentTrap }));
            if (await gameHelpers.isGameOver($game)) {
                return;
            }
            isAttackNegated = true;
        }
        if (opponentTrap && opponentTrap.effect === EffectId.RICOCHET) {
            animations.push(...effect.ricochet({ player, playerMinion, opponent, opponentTrap }));
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
            animations.push(...effect.constriction({ player, playerMinion, opponent, opponentTrap }));
        }
        if (playerMinion.buffs.find((buff) => buff.id === EffectId.POISONOUS_TOUCH)) {
            gameHelpers.insertDebuff(opponentMinion, EffectId.NEUROTOXIN);
        }
        if (playerMinion.buffs.find((buff) => buff.id === EffectId.CORROSIVE_TOUCH)) {
            gameHelpers.effect.corrosiveTouch({ opponent });
            if (await gameHelpers.isGameOver($game)) {
                return;
            }
        }
        if (playerMinion.buffs.find((buff) => buff.id === EffectId.OVERPOWER)) {
            if (playerMinion.damage > opponentMinion.health) {
                gameHelpers.effect.overpower({ opponent, damage: playerMinion.damage - opponentMinion.health });
                if (await gameHelpers.isGameOver($game)) {
                    return;
                }
            }
        }
        if (opponentMinion.buffs.find((buff) => buff.id === EffectId.POISONOUS_TOUCH)) {
            gameHelpers.insertDebuff(playerMinion, EffectId.NEUROTOXIN);
        }
        if (opponentMinion.buffs.find((buff) => buff.id === EffectId.CORROSIVE_TOUCH)) {
            gameHelpers.effect.corrosiveTouch({ opponent: player });
            if (await gameHelpers.isGameOver($game)) {
                return;
            }
        }
        if (opponentMinion.buffs.find((buff) => buff.id === EffectId.OVERPOWER)) {
            if (opponentMinion.damage > playerMinion.health) {
                gameHelpers.effect.overpower({ opponent, damage: opponentMinion.damage - playerMinion.health });
                if (await gameHelpers.isGameOver($game)) {
                    return;
                }
            }
        }
        if (!isAttackNegated) {
            gameHelpers.deductHealth(player, playerMinion, opponentMinion.damage);
            animations.push({
                type: "DAMAGE",
                field: attacker,
                damageTaken: opponentMinion.damage,
                name: player.name
            });
            gameHelpers.deductHealth(opponent, opponentMinion, playerMinion.damage);
            animations.push({
                type: "DAMAGE",
                field: attacked,
                damageTaken: playerMinion.damage,
                name: opponent.name
            });
        }
        if (playerMinion.health <= 0 || (playerMinion.health === 1 && opponentMinion.buffs.find((buff) => buff.id === EffectId.EXECUTE))) {
            if (player.trap && player.trap.effect === EffectId.LAST_STAND) {
                gameHelpers.effect.lastStand({ minion: playerMinion, opponent: player, trap: player.trap });
            }
            else {
                const hasAcidicDeathBuff = playerMinion.buffs.find((buff) => buff.id === EffectId.ACIDIC_DEATH);
                const hasSelfDescturctDebuff = playerMinion.debuffs.find((debuff) => debuff.id === EffectId.SELF_DESTRUCT);
                if (player.trap && player.trap.effect === EffectId.REFLECTION) {
                    gameHelpers.effect.reflection({ player, opponent, trap: player.trap });
                }
                gameHelpers.moveToGraveyard(player, playerMinion, attacker);
                animations.push({
                    type: "DEATH",
                    field: attacker,
                    name: player.name
                });
                if (hasSelfDescturctDebuff) {
                    gameHelpers.effect.selfDestruct({ player });
                    if (await gameHelpers.isGameOver($game)) {
                        return;
                    }
                }
                if (hasAcidicDeathBuff) {
                    effect.acidicDeath({ player, opponent });
                }
                Object.keys(player.minion).forEach((key) => {
                    const minion = player.minion[key];
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
                            minion.health += 3;
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
        if (opponentMinion.health <= 0 || (opponentMinion.health === 1 && playerMinion.buffs.find((buff) => buff.id === EffectId.EXECUTE))) {
            if (opponent.trap && opponent.trap.effect === EffectId.LAST_STAND) {
                gameHelpers.effect.lastStand({ minion: opponentMinion, opponent, trap: opponent.trap });
            }
            else {
                const hasAcidicDeathBuff = playerMinion.buffs.find((buff) => buff.id === EffectId.ACIDIC_DEATH);
                const hasSelfDescturctDebuff = playerMinion.debuffs.find((debuff) => debuff.id === EffectId.SELF_DESTRUCT);
                if (opponent.trap && opponent.trap.effect === EffectId.REFLECTION) {
                    gameHelpers.effect.reflection({ player: opponent, opponent: player, trap: opponent.trap });
                }
                gameHelpers.moveToGraveyard(opponent, opponentMinion, attacked);
                animations.push({
                    type: "DEATH",
                    field: attacked,
                    name: opponent.name
                });
                if (hasSelfDescturctDebuff) {
                    gameHelpers.effect.selfDestruct({ player });
                    if (await gameHelpers.isGameOver($game)) {
                        return;
                    }
                }
                if (hasAcidicDeathBuff) {
                    effect.acidicDeath({ player, opponent });
                }
            }
            Object.keys(opponent.minion).forEach((key) => {
                const minion = opponent.minion[key];
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
                        minion.health += 3;
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
        if (!getGameData) {
            return error(getGameError);
        }
        const { $game, player, opponent } = getGameData;
        const card = opponent.deck.pop();
        if (!card) {
            return await gameHelpers.endGame($game.id, player.name);
        }
        opponent.hand.push(card);
        player.field.hero.mana = 10;
        const playerMinionFields = Object.keys(player.field);
        playerMinionFields.forEach((field) => {
            const minion = player.field[field];
            if (!minion || minion.type === CardType.HERO) {
                return;
            }
            minion.canAttack = true;
            gameHelpers.effect.blaze({ minion });
            if (minion.buffs.find((buff) => buff.id === EffectId.REGENERATION)) {
                gameHelpers.effect.regeneration({ player });
            }
        });
        $game.currentPlayer = opponent.name;
        $game.currentTurn += 1;
        await gameHelpers.saveGame($game);
    });
};

const playMagic = (socket, error) => {
    const socketId = socket.id;
    const { effect } = gameHelpers;
    socket.on("playMagic", async (params) => {
        const [getGameData, getGameError] = await gameHelpers.getGame(socketId);
        if (!getGameData) {
            return error(getGameError);
        }
        const { gid, field, target } = params;
        const { $game, player, opponent } = getGameData;
        if (field && opponent.field[field]?.buffs.find((buff) => buff.id === EffectId.ELUSIVE)) {
            return error("Selected card has Elusive buff.");
        }
        const card = player.hand.find((card) => card.gid === gid);
        if (!card) {
            return error("Card not found in hand.");
        }
        if (card.type !== CardType.MAGIC) {
            return error("Selected card is not Magic.");
        }
        if (card.manaCost > player.field.hero.mana) {
            return error("Not enough mana.");
        }
        player.field.hero.mana -= card.manaCost;
        player.hand.splice(player.hand.indexOf(card), 1);
        player.graveyard.push(card);
        const { trap } = opponent;
        if (trap && trap.effect === EffectId.SILENCE) {
            effect.silence({ opponent, trap });
        }
        else {
            if (card.effect === EffectId.REBIRTH) {
                const [success, message] = effect.rebirth({ player, target, field });
                if (!success) {
                    return error(message);
                }
            }
            if (card.effect === EffectId.DIMINISH) {
                const [success, message] = effect.diminish({ opponent, field });
                if (!success) {
                    return error(message);
                }
            }
            if (card.effect === EffectId.RELOAD) {
                effect.reload({ player });
            }
            if (card.effect === EffectId.VALOR) {
                const [success, message] = effect.valor({ opponent });
                if (!success) {
                    return error(message);
                }
                else {
                    if (await gameHelpers.isGameOver($game)) {
                        return;
                    }
                }
            }
            if (card.effect === EffectId.SHELL) {
                const [success, message] = effect.shell({ player });
                if (!success) {
                    return error(message);
                }
            }
            if (card.effect === EffectId.FORTITUDE) {
                const [success, message] = effect.fortitude({ player, field });
                if (!success) {
                    return error(message);
                }
            }
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
        await gameHelpers.saveGame($game);
    });
};

const playMinion = (socket, error) => {
    const socketId = socket.id;
    const { effect } = gameHelpers;
    socket.on("playMinion", async (params) => {
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
        if (card.manaCost > player.hero.mana) {
            return error("Not enough mana.");
        }
        player.field.hero.mana -= card.manaCost;
        player.field[field] = card;
        const minion = player.field[field];
        if (!minion) {
            return error("Error summoning card.");
        }
        player.hand.splice(player.hand.indexOf(card), 1);
        const { trap } = opponent;
        const isElusive = minion.effect === EffectId.ELUSIVE;
        // Step 1: Insert buffs / debuffs
        // Step 2: Check for on summon trap cards
        // Step 3: Trigger on summon effects
        // [1] INSERT BUFFS / DEBUFFS
        switch (minion.effect) {
            // Neutral
            case EffectId.BLAZE:
                const hasAttackedTwice = true;
                gameHelpers.insertBuff(minion, EffectId.BLAZE, { hasAttackedTwice });
                break;
            case EffectId.ELUSIVE:
                gameHelpers.insertBuff(minion, EffectId.ELUSIVE);
                break;
            case EffectId.REVENGE:
                gameHelpers.insertBuff(minion, EffectId.REVENGE);
                break;
            // Solid
            case EffectId.UNITY:
                gameHelpers.insertBuff(minion, EffectId.UNITY);
                break;
            case EffectId.UNBREAKABLE:
                gameHelpers.insertBuff(minion, EffectId.UNBREAKABLE);
                break;
            case EffectId.PROTECTOR:
                gameHelpers.insertBuff(minion, EffectId.TAUNT);
                break;
            // ---------- [ L I Q U I D ] ----------
            case EffectId.RISING_FURY:
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
                    effect.smite({ player, opponent, minion, trap, field });
                    break;
                case EffectId.BANISH:
                    effect.banish({ player, opponent, minion, trap, field });
                    break;
                case EffectId.POISONED_GROUND:
                    effect.poisonedGround({ player: opponent, minion, trap });
                    break;
            }
        }
        else {
            // [3] TRIGGER ON SUMMON EFFECTS
            switch (minion.effect) {
                // ---------- [ N E U T R A L ] ----------
                case EffectId.SHADOW_SURGE:
                    effect.shadowSurge({ minion });
                    break;
                case EffectId.QUICK_SHOT:
                    effect.quickShot({ opponent });
                    break;
                case EffectId.NECROMANCY:
                    effect.necromancy({ minion, isPositive: false });
                    break;
                // ---------- [ S O L I D ] ----------
                case EffectId.GLORY:
                    effect.glory({ opponent, minion });
                    break;
                case EffectId.SPELLWEAVE:
                    effect.spellweave({ player, minion });
                    break;
                case EffectId.SHIELDWALL:
                    effect.shieldwall({ player, field });
                    break;
                // ---------- [ G A S ] ----------
                case EffectId.TOXIC_SPRAY:
                    effect.toxicSpray({ opponent });
                    break;
                case EffectId.TOXIC_GAS:
                    effect.toxicGas({ opponent });
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
        await gameHelpers.saveGame($game);
    });
};

const playTrap = (socket, error) => {
    const socketId = socket.id;
    socket.on("playTrap", async (params) => {
        const [getGameData, getGameError] = await gameHelpers.getGame(socketId);
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
        if (card.manaCost > player.field.hero.mana) {
            return error("Not enough mana.");
        }
        player.field.hero.mana -= card.manaCost;
        hand.splice(hand.indexOf(card), 1);
        player.trap = card;
        socket.emit("playTrap", { name });
        await gameHelpers.saveGame($game);
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
    const { $accounts, $chats, $players } = mongo;
    socket.on("acceptFriend", async (params) => {
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
        const [$accountSender, $accountReceiver, $chatInsert] = await Promise.all([
            $accounts.findOneAndUpdate({
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
            $accounts.findOneAndUpdate({ name }, {
                $push: {
                    "social.friends": $playerSender.name
                }
            }, {
                returnDocument: "after"
            }),
            $chats.insertOne({
                players: [$playerSender.name, $playerReceiver.name],
                messages: []
            })
        ]);
        if (!$accountSender) {
            return error("Account sender not found.");
        }
        if (!$accountReceiver) {
            return error("Account receiver not found.");
        }
        if (!$chatInsert.insertedId) {
            return error("Failed to insert chat.");
        }
        socket.emit("acceptFriendSender", {
            name: $playerReceiver.name,
            avatarId: $accountReceiver.avatarId,
            status: $playerReceiver.status
        });
        server.io.to($playerReceiver.socketId).emit("acceptFriendReceiver", {
            name: $playerSender.name,
            avatarId: $accountSender.avatarId,
            status: $playerSender.status
        });
    });
};

const addFriend = (socket, error) => {
    const socketId = socket.id;
    const { $accounts, $players } = mongo;
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
        const [$accountSender, $accountReceiver] = await Promise.all([
            $accounts.findOne({ name: $playerSender.name }),
            $accounts.findOne({ name: $playerReceiver.name })
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
        const $playerUpdate = await $accounts.updateOne({ name }, {
            $push: {
                "social.requests": $accountSender.name
            }
        });
        if (!$playerUpdate.modifiedCount) {
            return error("Error updating player.");
        }
        socket.emit("notification", "Friend request sent.");
        server.io.to($playerReceiver.socketId).emit("addFriend", {
            name: $accountSender.name
        });
    });
};

const blockFriend = (socket, error) => {
    const socketId = socket.id;
    const { $accounts, $chats, $players } = mongo;
    socket.on("blockFriend", async (params) => {
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
        const [$accountSenderUpdate, $accountReceiverUpdate, $chatDelete] = await Promise.all([
            $accounts.updateOne({
                name: $playerSender.name
            }, {
                $pull: {
                    "social.friends": $playerReceiver.name
                },
                $push: {
                    "social.blocked": $playerReceiver.name
                }
            }),
            $accounts.updateOne({
                name: $playerReceiver.name
            }, {
                $pull: {
                    "social.friends": $playerSender.name
                }
            }),
            $chats.deleteOne({
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
        server.io.to($playerReceiver.socketId).emit("blockFriendReceiver", {
            name: $playerSender.username
        });
    });
};

const declineFriend = (socket, error) => {
    const socketId = socket.id;
    const { $accounts, $players } = mongo;
    socket.on("declineFriend", async (params) => {
        const { name } = params;
        const $player = await $players.findOne({ socketId });
        if (!$player) {
            return error("Player not found, try relogging.");
        }
        const $accountUpdate = await $accounts.updateOne({
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
    const { $accounts, $chats, $players } = mongo;
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
        const [$accountSenderUpdate, $accountReceiverUpdate, $chatDelete] = await Promise.all([
            $accounts.findOneAndUpdate({
                name: $playerSender.name
            }, {
                $pull: {
                    "social.friends": name
                }
            }, {
                returnDocument: "after"
            }),
            $accounts.findOneAndUpdate({ name }, {
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
        if (!$accountSenderUpdate) {
            return error("Account sender not found.");
        }
        if (!$accountReceiverUpdate) {
            return error("Account receiver not found.");
        }
        if (!$chatDelete.deletedCount) {
            return error("Failed to delete chat.");
        }
        socket.emit("removeFriendSender", { name });
        server.io.to($playerReceiver.socketId).emit("removeFriendReceiver", {
            name: $accountSenderUpdate.name
        });
    });
};

const sendChatMessage = (socket, error) => {
    const socketId = socket.id;
    const { $accounts, $players, $chats } = mongo;
    const { io } = server;
    socket.on("sendChatMessage", async (params) => {
        const { receiver, text } = params;
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
        const $account = await $accounts.findOne({
            name: $playerSender.name
        });
        if (!$account) {
            return error("Account not found.");
        }
        if (!$account.social.friends.includes(receiver)) {
            return error("This user isn't your friend.");
        }
        const date = new Date();
        const $chatUpdate = await $chats.updateOne({
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
        socket.emit("sendChatMessageSender", {
            sender: $playerSender.name,
            receiver,
            text,
            date
        });
        io.to($playerReceiver.socketId).emit("sendChatMessageReceiver", {
            sender: $playerSender.name,
            text,
            date
        });
    });
};

const setAvatar = (socket, error) => {
    const socketId = socket.id;
    const { $accounts, $players } = mongo;
    socket.on("setAvatar", async (params) => {
        const { avatarId } = params;
        if (avatarId < 0 || avatarId > 4) {
            return error("Invalid avatar.");
        }
        const $player = await $players.findOne({ socketId });
        if (!$player) {
            return error("Player not found, try relogging.");
        }
        const $accountUpdate = await $accounts.findOneAndUpdate({
            name: $player.name
        }, {
            $set: { avatarId }
        }, {
            returnDocument: "after"
        });
        if (!$accountUpdate) {
            return error("Failed to update account.");
        }
        const { name, social } = $accountUpdate;
        const socketIds = await playerHelpers.getSocketIds(social.friends);
        socket.emit("setAvatarSender", { avatarId });
        server.io.to(socketIds).emit("setAvatarReceiver", { name, avatarId });
    });
};

const unblockFriend = (socket, error) => {
    const socketId = socket.id;
    const { $accounts, $players } = mongo;
    socket.on("unblockFriend", async (params) => {
        const { name } = params;
        const $player = await $players.findOne({ socketId });
        if (!$player) {
            return error("Player not found, try relogging.");
        }
        const $accountUpdate = await $accounts.updateOne({ name: $player.name }, {
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

const updateStatus = (socket, error) => {
    const socketId = socket.id;
    const { $accounts, $players } = mongo;
    socket.on("updateFriend", async () => {
        const $player = await $players.findOne({ socketId });
        if (!$player) {
            return error("Player not found.");
        }
        const $account = await $accounts.findOne({ name: $player.name });
        if (!$account) {
            return error("Player account not found.");
        }
        const { name, status } = $player;
        const socketIds = await playerHelpers.getSocketIds($account.social.friends);
        if (socketIds.length) {
            server.io.to(socketIds).emit("updateFriend", { name, status });
        }
    });
};

const sidenav = [
    acceptFriend,
    addFriend,
    blockFriend,
    declineFriend,
    removeFriend,
    sendChatMessage,
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
    const $account = await mongo.$accounts.findOne({
        publicKey: seller.toLowerCase()
    });
    if (!$account) {
        console.log("Item seller account not found, listing anyway...");
    }
    await mongo.$marketItems.insertOne({
        sellerName: $account ? $account.name : "Not a player",
        sellerAddress: seller.toLowerCase(),
        listingId: listingId.toString(),
        skinId: skinId.toString(),
        amount: amount.toString(),
        price: price.toString()
    });
});
contracts.game.on("CancelItem", async (listingId) => {
    const $marketItemDelete = await mongo.$marketItems.deleteOne({
        listingId: listingId.toString()
    });
    if (!$marketItemDelete) {
        console.log(`Error deleting item ${listingId} from market`);
    }
});
// contracts.game.on("stake", async () => {
//   const accounts = await mongo.accounts.find().toArray();
//   for (const account of accounts) {
//     if (!account.publicKey) {
//       return "Metamask account not binded, can't receive rewards.";
//     }
//     const total = await contracts.game.total();
//     const playerChain = await contracts.game.players(account.publicKey);
//     const rewardPerStaked = (total.rewards.pool * (10 ** 18)) / total.staked(1);
//     const playerReward = (player.staked / (10 ** DECIMALS)) * rewardPerStaked;
//     await contracts.game.distributeRewards(account.publicKey);
//   }
// });
contracts.game.on("BuyItem", async (listingId, amount) => {
    const $item = await mongo.$marketItems.findOne({
        listingId: listingId.toString()
    });
    if (!$item) {
        return;
    }
    // if (BigInt($item.amount) - amount < 0n) {
    //   await mongo.marketItems.deleteOne({
    //     listingId: listingId.toString()
    //   });
    // } else {
    //   await mongo.marketItems.replaceOne({
    //     listingId: listingId.toString()
    //   }, {
    //     ...$item,
    //     amount: utils.formatUnits($item.amount.sub(amount), 0)
    //   });
    // }
});
server.io.on("connection", (socket) => {
    const error = (message) => {
        socket.emit("notification", message);
        console.error(message);
    };
    // put this in separate request file.
    socket.on("getMarketItems", async () => {
        const items = await mongo.$marketItems.find().limit(100).toArray();
        socket.emit("getMarketItems", { items });
    });
    requests.forEach((request) => {
        request(socket, error);
    });
});
server.http.listen(process.env.PORT || 4201);
//# sourceMappingURL=index.js.map
