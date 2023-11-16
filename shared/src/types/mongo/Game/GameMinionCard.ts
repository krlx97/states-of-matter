import type {GameCard} from "./GameCard.js";
import type {CardType, EffectId} from "../../../enums/index.js";

interface Attribute {
  current: number;
  default: number;
}

interface GameMinionCard extends GameCard {
  type: CardType.MINION;
  health: Attribute;
  damage: Attribute;
  manaCost: Attribute;
  // health: number;
  // damage: number;
  // manaCost: number;
  // maxHealth: number;
  canAttack: boolean;
  buffs: Array<{id: EffectId, data: any}>;
  debuffs: Array<{id: EffectId, data: any}>;
}

export type {GameMinionCard};
