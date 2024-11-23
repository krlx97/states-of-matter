import type {GameBaseCard} from "./GameBaseCard.js";
import type {Ability, CardType, EffectId} from "../../../enums/index.js";

interface Attribute {
  current: number;
  default: number;
}

interface GameHeroCard extends GameBaseCard {
  type: CardType.HERO;
  health: Attribute;
  mana: Attribute;
  ability: Ability;
  buffs: Array<{id: EffectId, data: any}>;
  debuffs: Array<{id: EffectId, data: any}>;
}

export type {GameHeroCard};
