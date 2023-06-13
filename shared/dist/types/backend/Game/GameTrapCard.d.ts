import type { GameCard } from "./GameCard.js";
import type { CardType } from "../../../enums/index.js";
interface GameTrapCard extends GameCard {
    type: CardType.TRAP;
    manaCost: number;
}
export type { GameTrapCard };
