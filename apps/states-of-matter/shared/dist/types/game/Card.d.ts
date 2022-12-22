import type { Ability, CardId, CardKlass, CardType, EffectId, EffectType } from "../../enums/index.js";
interface Effect {
    id: EffectId;
    type: EffectType;
}
interface BaseCard {
    id: CardId;
    name: string;
    klass: CardKlass;
}
interface Hero extends BaseCard {
    type: CardType.HERO;
    health: number;
    mana: number;
    ability: Ability;
}
interface Minion extends BaseCard {
    type: CardType.MINION;
    health: number;
    damage: number;
    manaCost: number;
    effect: Effect;
}
interface Magic extends BaseCard {
    type: CardType.MAGIC;
    manaCost: number;
    effect: Effect;
}
interface Trap extends BaseCard {
    type: CardType.TRAP;
    manaCost: number;
    effect: Effect;
}
declare type Card = Hero | Minion | Magic | Trap;
declare type Cards = Array<Card>;
export type { Hero, Card, Cards };
