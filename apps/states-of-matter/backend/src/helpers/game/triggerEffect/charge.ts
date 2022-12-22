import {EffectId} from "@som/shared/enums";
import type {GameMinion} from "models/game";

const charge = (minion: GameMinion): void => {
  if (!minion.hasTriggeredEffect && minion.effect === EffectId.CHARGE) {
    minion.canAttack = true;
    minion.hasTriggeredEffect = true;
  }
};

export {charge};
