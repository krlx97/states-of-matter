import {randomInt} from "crypto";
import type {Effect} from "@som/shared/types/backend";
import type {GameMinionCard, GamePlayer} from "@som/shared/types/backend/game";
import { EffectId } from "@som/shared/enums";
import { moveToGraveyard } from "../moveToGraveyard";
import { deductHealth } from "../deductHealth";
import { deductHealth2 } from "../deductHealth2";
import { insertDebuff } from "../insertDebuff";

interface ToxicSpray {
  opponent: GamePlayer;
}

const toxicSpray: Effect<ToxicSpray> = (params) => {
  const {opponent} = params;
  const possibleMinions: Array<{minion: GameMinionCard, key: keyof typeof opponent.minion}> = [];
  const minionKeys = Object.keys(opponent.minion) as Array<keyof typeof opponent.minion>;

  minionKeys.forEach((key) => {
    const minion = opponent.minion[key];

    if (minion) {
      const hasElusiveBuff = minion.buffs.find((buff) => buff.id === EffectId.ELUSIVE);

      if (!hasElusiveBuff) {
        possibleMinions.push({minion, key});
      }
    }
  });

  if (possibleMinions.length) {
    let randomMinion = randomInt(possibleMinions.length);
    let {minion, key} = possibleMinions[randomMinion];

    deductHealth2(opponent, minion, 1);
    insertDebuff(minion, EffectId.NEUROTOXIN);

    if (minion.health <= 0) {
      moveToGraveyard(opponent, minion, key);
    }
  }

  return [true, ""];
};

export {toxicSpray};
