import {randomInt} from "crypto";
import {EffectId} from "@som/shared/enums";
import {deductHealth} from "../deductHealth";
import {moveToGraveyard} from "../moveToGraveyard";
import type {Animations} from "@som/shared/types/game";

import type {
  FieldKeys,
  GameMinionCard,
  GamePlayer,
  MinionField
} from "@som/shared/types/mongo";

interface OnNormalSummon {
  opponent: GamePlayer;
}

const toxicSpray = {
  onNormalSummon (params: OnNormalSummon): Animations {
    const {opponent} = params;

    interface PossibleMinion {
      minion: GameMinionCard;
      field: MinionField;
    }

    type PossibleMinions = Array<PossibleMinion>;

    const possibleMinions: PossibleMinions = [];
    const minionFields = Object.keys(opponent.field) as FieldKeys;
    const animations: Animations = [];

    minionFields.forEach((field): void => {
      if (field === "hero") {
        return;
      }

      const minion = opponent.field[field];
      const hasElusiveBuff = minion?.buffs.find(
        (buff): boolean => buff.id === EffectId.ELUSIVE
      );

      if (minion && !hasElusiveBuff) {
        possibleMinions.push({minion, field});
      }
    });

    if (possibleMinions.length) {
      const randomMinion = randomInt(possibleMinions.length);
      const {minion, field} = possibleMinions[randomMinion];

      animations.push({
        type: "FLOATING_TEXT",
        field,
        name: opponent.name,
        text: "TOXIC SPRAY"
      }, ...deductHealth(opponent, minion, 1, field));

      if (minion.health.current <= 0) {
        animations.push(...moveToGraveyard(opponent, minion, field));
      } else {
        minion.debuffs.push({
          id: EffectId.NEUROTOXIN,
          data: {}
        });

        animations.push({
          type: "FLOATING_TEXT",
          field,
          name: opponent.name,
          text: "NEUROTOXIN"
        });
      }
    }

    return animations;
  }
};

export {toxicSpray};
