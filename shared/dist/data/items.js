import { CardId } from "../enums/index.js";
var ItemType;
(function (ItemType) {
    ItemType[ItemType["AVATAR"] = 0] = "AVATAR";
    ItemType[ItemType["BANNER"] = 1] = "BANNER";
    ItemType[ItemType["SKIN"] = 2] = "SKIN";
})(ItemType || (ItemType = {}));
;
var ItemRarity;
(function (ItemRarity) {
    ItemRarity[ItemRarity["COMMON"] = 0] = "COMMON";
    ItemRarity[ItemRarity["UNCOMMON"] = 1] = "UNCOMMON";
    ItemRarity[ItemRarity["RARE"] = 2] = "RARE";
    ItemRarity[ItemRarity["EPIC"] = 3] = "EPIC";
    ItemRarity[ItemRarity["LEGENDARY"] = 4] = "LEGENDARY";
    ItemRarity[ItemRarity["MYTHIC"] = 5] = "MYTHIC";
})(ItemRarity || (ItemRarity = {}));
;
// 1 Chests (singular)
// 1000-1999 Avatars (4digit)
// 2000-2999 Banners (4digit)
// 100000-199999 Skins (6 digit)
const items = [{
        id: 1000,
        name: "Bronze Avatar",
        type: ItemType.AVATAR,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0
    }, {
        id: 1001,
        name: "Silver Avatar",
        type: ItemType.AVATAR,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0
    }, {
        id: 1002,
        name: "Gold Avatar",
        type: ItemType.AVATAR,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0
    }, {
        id: 1003,
        name: "Master Avatar",
        type: ItemType.AVATAR,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0
    }, {
        id: 2000,
        name: "Bronze Banner",
        type: ItemType.BANNER,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0
    }, {
        id: 2001,
        name: "Silver Banner",
        type: ItemType.BANNER,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0
    }, {
        id: 2002,
        name: "Gold Banner",
        type: ItemType.BANNER,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0
    }, {
        id: 2003,
        name: "Master Banner",
        type: ItemType.BANNER,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0
    }, {
        id: 101300,
        name: "Seafarer",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.SEAFARER
    }, {
        id: 101301,
        name: "Seafarer",
        type: ItemType.SKIN,
        rarity: ItemRarity.UNCOMMON,
        disenchantReward: 100,
        cardId: CardId.SEAFARER
    }, {
        id: 101302,
        name: "Seafarer",
        type: ItemType.SKIN,
        rarity: ItemRarity.RARE,
        disenchantReward: 500,
        cardId: CardId.SEAFARER
    }, {
        id: 101303,
        name: "Seafarer",
        type: ItemType.SKIN,
        rarity: ItemRarity.EPIC,
        disenchantReward: 2500,
        cardId: CardId.SEAFARER
    }, {
        id: 101304,
        name: "Seafarer",
        type: ItemType.SKIN,
        rarity: ItemRarity.LEGENDARY,
        disenchantReward: 12500,
        cardId: CardId.SEAFARER
    }, {
        id: 101305,
        name: "Seafarer",
        type: ItemType.SKIN,
        rarity: ItemRarity.MYTHIC,
        disenchantReward: 62500,
        cardId: CardId.SEAFARER
    }, {
        id: 101400,
        name: "Avet",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.AVET
    }, {
        id: 101401,
        name: "Avet",
        type: ItemType.SKIN,
        rarity: ItemRarity.UNCOMMON,
        disenchantReward: 100,
        cardId: CardId.AVET
    }, {
        id: 101402,
        name: "Avet",
        type: ItemType.SKIN,
        rarity: ItemRarity.RARE,
        disenchantReward: 500,
        cardId: CardId.AVET
    }, {
        id: 101403,
        name: "Avet",
        type: ItemType.SKIN,
        rarity: ItemRarity.EPIC,
        disenchantReward: 2500,
        cardId: CardId.AVET
    }, {
        id: 101404,
        name: "Avet",
        type: ItemType.SKIN,
        rarity: ItemRarity.LEGENDARY,
        disenchantReward: 12500,
        cardId: CardId.AVET
    }, {
        id: 101405,
        name: "Avet",
        type: ItemType.SKIN,
        rarity: ItemRarity.MYTHIC,
        disenchantReward: 62500,
        cardId: CardId.AVET
    }, {
        id: 101500,
        name: "Guiding Lights",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.GUIDING_LIGHTS
    }, {
        id: 101501,
        name: "Guiding Lights",
        type: ItemType.SKIN,
        rarity: ItemRarity.UNCOMMON,
        disenchantReward: 100,
        cardId: CardId.GUIDING_LIGHTS
    }, {
        id: 101502,
        name: "Guiding Lights",
        type: ItemType.SKIN,
        rarity: ItemRarity.RARE,
        disenchantReward: 500,
        cardId: CardId.GUIDING_LIGHTS
    }, {
        id: 101503,
        name: "Guiding Lights",
        type: ItemType.SKIN,
        rarity: ItemRarity.EPIC,
        disenchantReward: 2500,
        cardId: CardId.GUIDING_LIGHTS
    }, {
        id: 101504,
        name: "Guiding Lights",
        type: ItemType.SKIN,
        rarity: ItemRarity.LEGENDARY,
        disenchantReward: 12500,
        cardId: CardId.GUIDING_LIGHTS
    }, {
        id: 101505,
        name: "Guiding Lights",
        type: ItemType.SKIN,
        rarity: ItemRarity.MYTHIC,
        disenchantReward: 62500,
        cardId: CardId.GUIDING_LIGHTS
    }, {
        id: 101600,
        name: "Vessels",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.VESSELS
    }, {
        id: 101700,
        name: "Sleeper",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.SLEEPER
    }, {
        id: 101800,
        name: "Pilgrims",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.PILGRIMS
    }, {
        id: 103000,
        name: "Gravecall",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.GRAVECALL
    }, {
        id: 103100,
        name: "Cross",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.CROSS
    }, {
        id: 103200,
        name: "Gambit",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.GAMBIT
    }, {
        id: 104000,
        name: "Reflection",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.REFLECTION
    }, {
        id: 104100,
        name: "Discuss",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.DISCUS
    }, {
        id: 104200,
        name: "Spellbane",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.SPELLBANE
    }, {
        id: 105000,
        name: "Boedicea",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.BOEDICEA
    }, {
        id: 106300,
        name: "Dendrites",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.DENDRITES
    }, {
        id: 106400,
        name: "Gnomes",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.GNOMES
    }, {
        id: 106500,
        name: "Mud Spirit",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.MUD_SPIRIT
    }, {
        id: 106600,
        name: "Peacemaker",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.PEACEMAKER
    }, {
        id: 106700,
        name: "Golemica",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.GOLEMICA
    }, {
        id: 106800,
        name: "Cave Lion",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.CAVE_LION
    }, {
        id: 108000,
        name: "Pact",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.PACT
    }, {
        id: 108100,
        name: "Anvil",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.ANVIL
    }, {
        id: 108200,
        name: "Quicksand",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.QUICK_SAND
    }, {
        id: 109000,
        name: "Wormhole",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.WORMHOLE
    }, {
        id: 109100,
        name: "Cage",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.CAGE
    }, {
        id: 109200,
        name: "Fury",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.FURY
    },
    {
        id: 110000,
        name: "Liquid Hero",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.LIQUID_HERO
    }, {
        id: 111300,
        name: "Liquid 1",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.LIQUID_1
    }, {
        id: 111400,
        name: "Liquid 2",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.LIQUID_2
    }, {
        id: 111500,
        name: "Liquid 3",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.LIQUID_3
    }, {
        id: 111600,
        name: "Liquid 4",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.LIQUID_4
    }, {
        id: 111700,
        name: "Liquid 5",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.LIQUID_5
    }, {
        id: 111800,
        name: "Liquid 6",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.LIQUID_6
    }, {
        id: 113000,
        name: "Liquid 7",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.LIQUID_7
    }, {
        id: 113100,
        name: "Liquid 8",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.LIQUID_8
    }, {
        id: 113200,
        name: "Liquid 9",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.LIQUID_9
    }, {
        id: 114000,
        name: "Liquid 10",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.LIQUID_10
    }, {
        id: 114100,
        name: "Liquid 11",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.LIQUID_11
    }, {
        id: 114200,
        name: "Liquid 12",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.LIQUID_12
    },
    {
        id: 115000,
        name: "Gas Hero",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.GAS_HERO
    }, {
        id: 116300,
        name: "Gas 1",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.GAS_1
    }, {
        id: 116400,
        name: "Gas 2",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.GAS_2
    }, {
        id: 116500,
        name: "Gas 3",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.GAS_3
    }, {
        id: 116600,
        name: "Gas 4",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.GAS_4
    }, {
        id: 116700,
        name: "Gas 5",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.GAS_5
    }, {
        id: 116800,
        name: "Gas 6",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.GAS_6
    }, {
        id: 118000,
        name: "Gas 7",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.GAS_7
    }, {
        id: 118100,
        name: "Gas 8",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.GAS_8
    }, {
        id: 118200,
        name: "Gas 9",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.GAS_9
    }, {
        id: 119000,
        name: "Gas 10",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.GAS_10
    }, {
        id: 119100,
        name: "Gas 11",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.GAS_11
    }, {
        id: 119200,
        name: "Gas 12",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.GAS_12
    },
    {
        id: 120000,
        name: "Plasma Hero",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.PLASMA_HERO
    }, {
        id: 121300,
        name: "Plasma 1",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.PLASMA_1
    }, {
        id: 121400,
        name: "Plasma 2",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.PLASMA_2
    }, {
        id: 121500,
        name: "Plasma 3",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.PLASMA_3
    }, {
        id: 121600,
        name: "Plasma 4",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.PLASMA_4
    }, {
        id: 121700,
        name: "Plasma 5",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.PLASMA_5
    }, {
        id: 121800,
        name: "Plasma 6",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.PLASMA_6
    }, {
        id: 123000,
        name: "Plasma 7",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.PLASMA_7
    }, {
        id: 123100,
        name: "Plasma 8",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.PLASMA_8
    }, {
        id: 123200,
        name: "Plasma 9",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.PLASMA_9
    }, {
        id: 124000,
        name: "Plasma 10",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.PLASMA_10
    }, {
        id: 124100,
        name: "Plasma 11",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.PLASMA_11
    }, {
        id: 124200,
        name: "Plasma 12",
        type: ItemType.SKIN,
        rarity: ItemRarity.COMMON,
        disenchantReward: 0,
        cardId: CardId.PLASMA_12
    }
];
export { items };
