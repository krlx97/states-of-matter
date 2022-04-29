import {Effect} from "@som/shared/enums";
import type {GameMinion} from "@som/shared/dist/interfaces/mongo/Game";

export const charge = (minion: GameMinion): void => {
  if (minion.effects.includes(Effect.CHARGE) && !minion.hasTriggeredEffect) {
    minion.hasAttacked = false;
    minion.hasTriggeredEffect = true;
  }
};
