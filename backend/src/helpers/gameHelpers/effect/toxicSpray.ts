import {randomInt} from "crypto";
import { CardType, EffectId } from "@som/shared/enums";
import { moveToGraveyard } from "../moveToGraveyard";
import { deductHealth } from "../deductHealth";
import { insertDebuff } from "../insertDebuff";
import type {GameMinionCard, GamePlayer} from "@som/shared/types/mongo";

interface ToxicSpray {
  opponent: GamePlayer;
}

const toxicSpray = (params: ToxicSpray) => {
  const {opponent} = params;
  const possibleMinions: Array<{minion: GameMinionCard, key: keyof typeof opponent.field}> = [];
  const minionKeys = Object.keys(opponent.field) as Array<keyof typeof opponent.field>;

  minionKeys.forEach((key) => {
    const minion = opponent.field[key];

    if (minion && minion.type !== CardType.HERO) {
      const hasElusiveBuff = minion.buffs.find((buff) => buff.id === EffectId.ELUSIVE);

      if (!hasElusiveBuff) {
        possibleMinions.push({minion, key});
      }
    }
  });

  if (possibleMinions.length) {
    let randomMinion = randomInt(possibleMinions.length);
    let {minion, key} = possibleMinions[randomMinion];

    deductHealth(opponent, minion, 1, key);
    insertDebuff(minion, EffectId.NEUROTOXIN);

    if (minion.health.current <= 0) {
      moveToGraveyard(opponent, minion, key);
    }
  }

  return [true, ""];
};

export {toxicSpray};
