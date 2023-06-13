import {EffectId} from "@som/shared/enums";
import type {Effect} from "@som/shared/types/backend";
import type {GameMinionCard, GamePlayer} from "@som/shared/types/backend/game";
import { randomInt } from "crypto";
import { insertDebuff } from "../insertDebuff";

interface AcidRain {
  opponent: GamePlayer;
}

const acidRain: Effect<AcidRain> = (params) => {
  const {opponent} = params;
  const minionKeys = Object.keys(opponent.minion) as Array<keyof typeof opponent.minion>;
  const possibleMinions: Array<GameMinionCard> = [];

  minionKeys.forEach((key) => {
    const minion = opponent.minion[key];

    if (minion) {
      const hasElusiveBuff = minion.buffs.find((buff) => buff.id === EffectId.ELUSIVE);

      if (!hasElusiveBuff) {
        possibleMinions.push(minion);
      }
    }
  });

  const minion1 = possibleMinions[randomInt(possibleMinions.length)];
  const minion2 = possibleMinions[randomInt(possibleMinions.length)];

  insertDebuff(minion1, EffectId.NEUROTOXIN);
  insertDebuff(minion2, EffectId.NEUROTOXIN);

  return [true, ""];
};

export {acidRain};
