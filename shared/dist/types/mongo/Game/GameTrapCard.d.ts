import type { GameBaseCard } from "./GameBaseCard.js";
import type { CardType } from "../../../enums/index.js";
interface Attribute {
    current: number;
    default: number;
}
interface GameTrapCard extends GameBaseCard {
    type: CardType.TRAP;
    manaCost: Attribute;
}
export type { GameTrapCard };
