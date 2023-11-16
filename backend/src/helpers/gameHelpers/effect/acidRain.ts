import {CardType, EffectId} from "@som/shared/enums";
import {randomInt} from "crypto";
import {insertDebuff} from "../insertDebuff";
import type {GameMinionCard, GamePlayer} from "@som/shared/types/mongo";
import type {Animations} from "@som/shared/types/game";

interface AcidRain {
  opponent: GamePlayer;
}

const acidRain = (params: AcidRain): Animations => {
  const {opponent} = params;
  const animations: Animations = [];
  const minionKeys = Object.keys(opponent.field) as Array<keyof typeof opponent.field>;
  const possibleMinions: Array<GameMinionCard> = [];

  minionKeys.forEach((key): void => {
    const minion = opponent.field[key];

    if (minion && minion.type !== CardType.HERO) {
      const hasElusiveBuff = minion
        .buffs
        .find((buff): boolean => buff.id === EffectId.ELUSIVE);

      if (!hasElusiveBuff) {
        possibleMinions.push(minion);
      }
    }
  });

  const minion1 = possibleMinions[randomInt(possibleMinions.length)];
  const minion2 = possibleMinions[randomInt(possibleMinions.length)];

  insertDebuff(minion1, EffectId.NEUROTOXIN);
  insertDebuff(minion2, EffectId.NEUROTOXIN);

  return animations;
};

export {acidRain};
