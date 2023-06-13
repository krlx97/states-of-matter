enum ItemType {CHEST, SHARD, SKIN};
enum ItemRarity {UNCOMMON, RARE, EPIC};

interface Item {
  id: number;
  name: string;
}

interface Chest extends Item {
  type: ItemType.CHEST;
}

interface Shard extends Item {
  type: ItemType.SHARD;
  rarity: ItemRarity;
  craftPrice: number;
}

interface Skin extends Item {
  type: ItemType.SKIN;
  rarity: ItemRarity;
  disenchantReward: number;
  cardId: number;
}

type Items = Array<Chest | Shard | Skin>;

const items: Items = [{
  id: 10,
  name: "Mega Chest",
  type: ItemType.CHEST,
}, {
  id: 11,
  name: "Dev Chest",
  type: ItemType.CHEST,
}, {
  id: 1000,
  name: "Seafarer Uncommon",
  type: ItemType.SKIN,
  rarity: ItemRarity.UNCOMMON,
  disenchantReward: 100,
  cardId: 6
}, {
  id: 1001,
  name: "Seafarer Uncommon Shard",
  type: ItemType.SHARD,
  rarity: ItemRarity.UNCOMMON,
  craftPrice: 50
}, {
  id: 1002,
  name: "Seafarer Rare",
  type: ItemType.SKIN,
  rarity: ItemRarity.RARE,
  disenchantReward: 1000,
  cardId: 6
}, {
  id: 1003,
  name: "Seafarer Rare Shard",
  type: ItemType.SHARD,
  rarity: ItemRarity.RARE,
  craftPrice: 500
}, {
  id: 1004,
  name: "Seafarer Epic",
  type: ItemType.SKIN,
  rarity: ItemRarity.EPIC,
  disenchantReward: 10000,
  cardId: 6
}, {
  id: 1005,
  name: "Seafarer Epic Shard",
  type: ItemType.SHARD,
  rarity: ItemRarity.EPIC,
  craftPrice: 5000
}, {
  id: 1006,
  name: "Avet Uncommon",
  type: ItemType.SKIN,
  rarity: ItemRarity.UNCOMMON,
  disenchantReward: 100,
  cardId: 7
}, {
  id: 1007,
  name: "Avet Uncommon Shard",
  type: ItemType.SHARD,
  rarity: ItemRarity.UNCOMMON,
  craftPrice: 50
}, {
  id: 1008,
  name: "Avet Rare",
  type: ItemType.SKIN,
  rarity: ItemRarity.RARE,
  disenchantReward: 1000,
  cardId: 7
}, {
  id: 1009,
  name: "Avet Rare Shard",
  type: ItemType.SHARD,
  rarity: ItemRarity.RARE,
  craftPrice: 500
}, {
  id: 1010,
  name: "Avet Epic",
  type: ItemType.SKIN,
  rarity: ItemRarity.EPIC,
  disenchantReward: 10000,
  cardId: 7
}, {
  id: 1011,
  name: "Avet Epic Shard",
  type: ItemType.SHARD,
  rarity: ItemRarity.EPIC,
  craftPrice: 5000
}, {
  id: 1012,
  name: "Guiding Lights Uncommon",
  type: ItemType.SKIN,
  rarity: ItemRarity.UNCOMMON,
  disenchantReward: 100,
  cardId: 8
}, {
  id: 1013,
  name: "Guiding Lights Uncommon Shard",
  type: ItemType.SHARD,
  rarity: ItemRarity.UNCOMMON,
  craftPrice: 50
}, {
  id: 1014,
  name: "Guiding Lights Rare",
  type: ItemType.SKIN,
  rarity: ItemRarity.RARE,
  disenchantReward: 1000,
  cardId: 8
}, {
  id: 1015,
  name: "Guiding Lights Rare Shard",
  type: ItemType.SHARD,
  rarity: ItemRarity.RARE,
  craftPrice: 500
}, {
  id: 1016,
  name: "Guiding Lights Epic",
  type: ItemType.SKIN,
  rarity: ItemRarity.EPIC,
  disenchantReward: 10000,
  cardId: 8
}, {
  id: 1017,
  name: "Guiding Lights Epic Shard",
  type: ItemType.SHARD,
  rarity: ItemRarity.EPIC,
  craftPrice: 5000
}];

export {items};
