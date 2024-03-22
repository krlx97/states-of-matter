import {CardType, EffectId} from "@som/shared/enums";
import {randomInt} from "crypto";
import type {GameMinionCard, GamePlayer} from "@som/shared/types/mongo";
import type {Animations} from "@som/shared/types/game";

interface AcidRain {
  opponent: GamePlayer;
}

const acidRain = (params: AcidRain): Animations => {
  const {opponent} = params;
  const animations: Animations = [];
  const minionKeys = Object.keys(opponent.field) as Array<keyof typeof opponent.field>;
  const possibleMinions: Array<any> = [];

  minionKeys.forEach((key): void => {
    const minion = opponent.field[key];

    if (minion && minion.type !== CardType.HERO) {
      const hasElusiveBuff = minion
        .buffs
        .find((buff): boolean => buff.id === EffectId.ELUSIVE);

      if (!hasElusiveBuff) {
        possibleMinions.push({minion, key});
      }
    }
  });

  const minion1 = possibleMinions[randomInt(possibleMinions.length)];
  const minion2 = possibleMinions[randomInt(possibleMinions.length)];

  minion1.minion.debuffs.push({
    id: EffectId.NEUROTOXIN,
    data: {},
  });

  minion2.minion.debuffs.push({
    id: EffectId.NEUROTOXIN,
    data: {},
  });

  animations.push({
    type: "FLOATING_TEXT",
    name: opponent.name,
    field: minion1.key,
    text: "Neurotoxin"
  }, {
    type: "FLOATING_TEXT",
    name: opponent.name,
    field: minion2.key,
    text: "Neurotoxin"
  });

  return animations;
};

export {acidRain};
