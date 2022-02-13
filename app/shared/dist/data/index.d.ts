interface Card {
    id: number;
    klass: number;
    type: number;
    name: string;
    damage?: number;
    health?: number;
    manaCost: number;
    effect: string;
}
interface Passive {
    name: string;
    amount: number;
    info: string;
}
interface Active {
    name: string;
    manaCost: number;
    info: string;
}
interface Special {
    effect: string;
    amount: number;
}
interface Hero {
    name: string;
    klass: number;
    damage: number;
    health: number;
    mana: number;
    passive: Passive;
    active: Active;
    special: Special;
}
import { CardKlass } from "../enums/index.js";
declare const cards: Array<Card>;
declare const heroes: Array<Hero>;
declare const passives: {
    klass: CardKlass;
    text: string;
}[];
export { cards, heroes, passives };
