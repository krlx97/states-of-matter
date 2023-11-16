import type {GameCard} from "./GameCard.js";
import type {CardType} from "../../../enums/index.js";

interface Attribute {
  current: number;
  default: number;
}

interface GameTrapCard extends GameCard {
  type: CardType.TRAP;
  manaCost: Attribute;
}

export type {GameTrapCard};
