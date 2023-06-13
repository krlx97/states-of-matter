import type { GameCard } from "./GameCard.js";
import type { CardType } from "../../../enums/index.js";
interface GameMagicCard extends GameCard {
    type: CardType.MAGIC;
    manaCost: number;
}
export type { GameMagicCard };
