import {randomInt} from "crypto";
import {EffectId} from "@som/shared/enums";
import {moveToGraveyard} from "../moveToGraveyard";
import type {Effect} from "@som/shared/types/backend";
import type {GameMinionCard, GamePlayer} from "@som/shared/types/backend/game";
import { deductHealth2 } from "../deductHealth2";

interface QuickShot {
  opponent: GamePlayer;
}

const quickShot: Effect<QuickShot> = (params) => {
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

    deductHealth2(opponent, minion, 2);

    if (minion.health <= 0) {
      moveToGraveyard(opponent, minion, key);
    }
  }

  return [true, ""];
};

export {quickShot};
