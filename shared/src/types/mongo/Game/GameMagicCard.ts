import type {GameCard} from "./GameCard.js";
import type {CardType} from "../../../enums/index.js";

interface Attribute {
  current: number;
  default: number;
}

interface GameMagicCard extends GameCard {
  type: CardType.MAGIC;
  manaCost: Attribute;
}

export type {GameMagicCard};
