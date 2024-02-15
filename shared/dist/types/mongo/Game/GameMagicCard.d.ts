import type { GameBaseCard } from "./GameBaseCard.js";
import type { CardType } from "../../../enums/index.js";
interface Attribute {
    current: number;
    default: number;
}
interface GameMagicCard extends GameBaseCard {
    type: CardType.MAGIC;
    manaCost: Attribute;
}
export type { GameMagicCard };
