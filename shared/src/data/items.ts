import {CardId} from "../enums/index.js";

enum ItemType {AVATAR, BANNER, SKIN};
enum ItemRarity {COMMON, UNCOMMON, RARE, EPIC, LEGENDARY, MYTHIC};

interface Item {
  id: number;
  name: string;
  rarity: ItemRarity;
}

interface Avatar extends Item {
  type: ItemType.AVATAR;
  disenchantReward: number;
}

interface Banner extends Item {
  type: ItemType.BANNER;
  disenchantReward: number;
}

interface Skin extends Item {
  type: ItemType.SKIN;
  disenchantReward: number;
  cardId: number;
}

type Items = Array<Avatar | Banner | Skin>;

const items: Items = [{
  id: 100,
  name: "Bronze Avatar",
  type: ItemType.AVATAR,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0
}, {
  id: 101,
  name: "Silver Avatar",
  type: ItemType.AVATAR,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0
}, {
  id: 102,
  name: "Gold Avatar",
  type: ItemType.AVATAR,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0
}, {
  id: 103,
  name: "Master Avatar",
  type: ItemType.AVATAR,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0
}, {
  id: 200,
  name: "Bronze Banner",
  type: ItemType.BANNER,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0
}, {
  id: 201,
  name: "Silver Banner",
  type: ItemType.BANNER,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0
}, {
  id: 202,
  name: "Gold Banner",
  type: ItemType.BANNER,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0
}, {
  id: 203,
  name: "Master Banner",
  type: ItemType.BANNER,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0
}, {
  id: 10110,
  name: "Seafarer",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.SEAFARER
}, {
  id: 10111,
  name: "Seafarer",
  type: ItemType.SKIN,
  rarity: ItemRarity.UNCOMMON,
  disenchantReward: 100,
  cardId: CardId.SEAFARER
}, {
  id: 10112,
  name: "Seafarer",
  type: ItemType.SKIN,
  rarity: ItemRarity.RARE,
  disenchantReward: 500,
  cardId: CardId.SEAFARER
}, {
  id: 10113,
  name: "Seafarer",
  type: ItemType.SKIN,
  rarity: ItemRarity.EPIC,
  disenchantReward: 2500,
  cardId: CardId.SEAFARER
}, {
  id: 10114,
  name: "Seafarer",
  type: ItemType.SKIN,
  rarity: ItemRarity.LEGENDARY,
  disenchantReward: 12500,
  cardId: CardId.SEAFARER
}, {
  id: 10120,
  name: "Avet",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.AVET
}, {
  id: 10121,
  name: "Avet",
  type: ItemType.SKIN,
  rarity: ItemRarity.UNCOMMON,
  disenchantReward: 100,
  cardId: CardId.AVET
}, {
  id: 10122,
  name: "Avet",
  type: ItemType.SKIN,
  rarity: ItemRarity.RARE,
  disenchantReward: 500,
  cardId: CardId.AVET
}, {
  id: 10123,
  name: "Avet",
  type: ItemType.SKIN,
  rarity: ItemRarity.EPIC,
  disenchantReward: 2500,
  cardId: CardId.AVET
}, {
  id: 10124,
  name: "Avet",
  type: ItemType.SKIN,
  rarity: ItemRarity.LEGENDARY,
  disenchantReward: 12500,
  cardId: CardId.AVET
}, {
  id: 10130,
  name: "Guiding Lights",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.GUIDING_LIGHTS
}, {
  id: 10131,
  name: "Guiding Lights",
  type: ItemType.SKIN,
  rarity: ItemRarity.UNCOMMON,
  disenchantReward: 100,
  cardId: CardId.GUIDING_LIGHTS
}, {
  id: 10132,
  name: "Guiding Lights",
  type: ItemType.SKIN,
  rarity: ItemRarity.RARE,
  disenchantReward: 500,
  cardId: CardId.GUIDING_LIGHTS
}, {
  id: 10133,
  name: "Guiding Lights",
  type: ItemType.SKIN,
  rarity: ItemRarity.EPIC,
  disenchantReward: 2500,
  cardId: CardId.GUIDING_LIGHTS
}, {
  id: 10134,
  name: "Guiding Lights",
  type: ItemType.SKIN,
  rarity: ItemRarity.LEGENDARY,
  disenchantReward: 12500,
  cardId: CardId.GUIDING_LIGHTS
}, {
  id: 10140,
  name: "Vessels",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.VESSELS
}, {
  id: 10150,
  name: "Sleeper",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.SLEEPER
}, {
  id: 10160,
  name: "Pilgrims",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.PILGRIMS
}, {
  id: 10300,
  name: "Gravecall",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.GRAVECALL
}, {
  id: 10310,
  name: "Cross",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.CROSS
}, {
  id: 10320,
  name: "Gambit",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.GAMBIT
}, {
  id: 10400,
  name: "Reflection",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.REFLECTION
}, {
  id: 10410,
  name: "Discuss",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.DISCUS
}, {
  id: 10420,
  name: "Spellbane",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.SPELLBANE
}, {
  id: 10500,
  name: "Boedicea",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.BOEDICEA
}, {
  id: 10610,
  name: "Dendrites",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.DENDRITES
}, {
  id: 10620,
  name: "Gnomes",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.GNOMES
}, {
  id: 10630,
  name: "Mud Spirit",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.MUD_SPIRIT
}, {
  id: 10640,
  name: "Peacemaker",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.PEACEMAKER
}, {
  id: 10650,
  name: "Golemica",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.GOLEMICA
}, {
  id: 10660,
  name: "Cave Lion",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.CAVE_LION
}, {
  id: 10800,
  name: "Pact",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.PACT
}, {
  id: 10810,
  name: "Anvil",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.ANVIL
}, {
  id: 10820,
  name: "Quicksand",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.QUICK_SAND
}, {
  id: 10900,
  name: "Wormhole",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.WORMHOLE
}, {
  id: 10910,
  name: "Cage",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.CAGE
}, {
  id: 10920,
  name: "Fury",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.FURY
}, {
  id: 11000,
  name: "Liquid Hero",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.LIQUID_HERO
}, {
  id: 11110,
  name: "Liquid 1",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.LIQUID_1
}, {
  id: 11120,
  name: "Liquid 2",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.LIQUID_2
}, {
  id: 11130,
  name: "Liquid 3",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.LIQUID_3
}, {
  id: 11140,
  name: "Liquid 4",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.LIQUID_4
}, {
  id: 11150,
  name: "Liquid 5",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.LIQUID_5
}, {
  id: 11160,
  name: "Liquid 6",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.LIQUID_6
}, {
  id: 11300,
  name: "Liquid 7",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.LIQUID_7
}, {
  id: 11310,
  name: "Liquid 8",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.LIQUID_8
}, {
  id: 11320,
  name: "Liquid 9",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.LIQUID_9
}, {
  id: 11400,
  name: "Liquid 10",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.LIQUID_10
}, {
  id: 11410,
  name: "Liquid 11",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.LIQUID_11
}, {
  id: 11420,
  name: "Liquid 12",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.LIQUID_12
}, {
  id: 11500,
  name: "Gas Hero",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.GAS_HERO
}, {
  id: 11610,
  name: "Gas 1",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.GAS_1
}, {
  id: 11620,
  name: "Gas 2",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.GAS_2
}, {
  id: 11630,
  name: "Gas 3",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.GAS_3
}, {
  id: 11640,
  name: "Gas 4",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.GAS_4
}, {
  id: 11650,
  name: "Gas 5",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.GAS_5
}, {
  id: 11660,
  name: "Gas 6",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.GAS_6
}, {
  id: 11800,
  name: "Gas 7",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.GAS_7
}, {
  id: 11810,
  name: "Gas 8",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.GAS_8
}, {
  id: 11820,
  name: "Gas 9",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.GAS_9
}, {
  id: 11900,
  name: "Gas 10",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.GAS_10
}, {
  id: 11910,
  name: "Gas 11",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.GAS_11
}, {
  id: 11920,
  name: "Gas 12",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.GAS_12
}, {
  id: 12000,
  name: "Plasma Hero",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.PLASMA_HERO
}, {
  id: 12110,
  name: "Plasma 1",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.PLASMA_1
}, {
  id: 12120,
  name: "Plasma 2",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.PLASMA_2
}, {
  id: 12130,
  name: "Plasma 3",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.PLASMA_3
}, {
  id: 12140,
  name: "Plasma 4",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.PLASMA_4
}, {
  id: 12150,
  name: "Plasma 5",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.PLASMA_5
}, {
  id: 12160,
  name: "Plasma 6",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.PLASMA_6
}, {
  id: 12300,
  name: "Plasma 7",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.PLASMA_7
}, {
  id: 12310,
  name: "Plasma 8",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.PLASMA_8
}, {
  id: 12320,
  name: "Plasma 9",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.PLASMA_9
}, {
  id: 12400,
  name: "Plasma 10",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.PLASMA_10
}, {
  id: 12410,
  name: "Plasma 11",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.PLASMA_11
}, {
  id: 12420,
  name: "Plasma 12",
  type: ItemType.SKIN,
  rarity: ItemRarity.COMMON,
  disenchantReward: 0,
  cardId: CardId.PLASMA_12
}];

export {items};
