declare enum ItemType {
    AVATAR = 0,
    BANNER = 1,
    SKIN = 2
}
declare enum ItemRarity {
    COMMON = 0,
    UNCOMMON = 1,
    RARE = 2,
    EPIC = 3,
    LEGENDARY = 4,
    MYTHIC = 5
}
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
declare const items: Items;
export { items };
