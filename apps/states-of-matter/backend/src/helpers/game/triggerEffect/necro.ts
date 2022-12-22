import {EffectId} from "@som/shared/enums";
import type {GameMinion} from "models/game";

const necro = (minion: GameMinion): void => {
  if (minion.effect === EffectId.NECRO && !minion.hasTriggeredEffect) {
    minion.health -= 2;
    minion.damage -= 2;
    minion.hasTriggeredEffect = true;
  }
};

export {necro};
