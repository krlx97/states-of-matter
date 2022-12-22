import {EffectId} from "@som/shared/enums";
import type {GameMinion} from "models/game";

const multiStrike = (minion: GameMinion): void => {
  if (minion.effect === EffectId.MULTI_STRIKE && !minion.hasTriggeredEffect) {
    minion.canAttack = true;
    minion.hasTriggeredEffect = true;
  }
};

export {multiStrike};
