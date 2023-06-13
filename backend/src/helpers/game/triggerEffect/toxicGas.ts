import {EffectId} from "@som/shared/enums";
import type {Effect} from "@som/shared/types/backend";
import type {GamePlayer} from "@som/shared/types/backend/game";
import { insertBuff } from "../insertBuff";

interface ToxicGas {
  opponent: GamePlayer;
}

const toxicGas: Effect<ToxicGas> = (params) => {
  const {opponent} = params;
  const minionKeys = Object.keys(opponent.minion) as Array<keyof typeof opponent.minion>;

  minionKeys.forEach((key) => {
    const minion = opponent.minion[key];

    if (minion) {
      const hasElusiveBuff = minion.buffs.find((buff) => buff.id === EffectId.ELUSIVE);

      if (!hasElusiveBuff) {
        insertBuff(minion, EffectId.NEUROTOXIN);
      }
    }
  });

  return [true, ""];
};

export {toxicGas};
