import { CardKlass, Effect } from "../enums/index.js";
interface Card {
    id: number;
    klass: number;
    type: number;
    name: string;
    damage?: number;
    health?: number;
    manaCost: number;
    lore: string;
    effects: Array<number>;
}
interface Hero {
    name: string;
    klass: number;
    health: number;
    mana: number;
    effects: Array<number>;
}
export declare const effectInfo: Map<Effect, string>;
declare const cards: Array<Card>;
declare const heroes: Array<Hero>;
declare const passives: {
    klass: CardKlass;
    text: string;
}[];
export { cards, heroes, passives };
