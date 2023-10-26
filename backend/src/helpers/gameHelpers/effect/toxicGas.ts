import {EffectId} from "@som/shared/enums";
import {insertBuff} from "../insertBuff";
import type {GamePlayer} from "@som/shared/types/mongo";

interface ToxicGas {
  opponent: GamePlayer;
}

const toxicGas = (params: ToxicGas) => {
  const {opponent} = params;
  const minionKeys = Object.keys(opponent.field) as Array<keyof typeof opponent.field>;

  minionKeys.forEach((key) => {
    const minion = opponent.field[key];

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
