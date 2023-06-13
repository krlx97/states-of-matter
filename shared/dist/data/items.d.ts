declare enum ItemType {
    CHEST = 0,
    SHARD = 1,
    SKIN = 2
}
declare enum ItemRarity {
    UNCOMMON = 0,
    RARE = 1,
    EPIC = 2
}
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
declare const items: Items;
export { items };
