import type { Ability, CardId, CardKlass, CardType, EffectId } from "../../enums/index.js";
interface BaseCard {
    id: CardId;
    klass: CardKlass;
    effect: EffectId;
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
}
interface Magic extends BaseCard {
    type: CardType.MAGIC;
    manaCost: number;
}
interface Trap extends BaseCard {
    type: CardType.TRAP;
    manaCost: number;
}
type Card = Hero | Minion | Magic | Trap;
type Cards = Array<Card>;
export type { BaseCard, Hero, Card, Cards };
