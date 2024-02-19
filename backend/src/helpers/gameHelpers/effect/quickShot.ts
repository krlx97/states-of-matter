import {randomInt} from "crypto";
import {EffectId} from "@som/shared/enums";
import {deductHealth} from "../deductHealth";
import {moveToGraveyard} from "../moveToGraveyard";
import type {Animations} from "@som/shared/types/game";

import type {
  GameMinionCard,
  GamePlayer,
  MinionField,
  FieldKeys
} from "@som/shared/types/mongo";

interface QuickShot {
  opponent: GamePlayer;
}

const quickShot = {
  onNormalSummon (params: QuickShot): Animations {
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

      if (minion && hasElusiveBuff === undefined) {
        possibleMinions.push({minion, field});
      }
    });

    if (possibleMinions.length) {
      let randomMinion = randomInt(possibleMinions.length);
      let {minion, field} = possibleMinions[randomMinion];

      animations.push({
        type: "FLOATING_TEXT",
        field,
        name: opponent.name,
        text: "QUICK SHOT"
      }, ...deductHealth(opponent, minion, 2, field))

      if (minion.health.current <= 0) {
        animations.push(...moveToGraveyard(opponent, minion, field));
      }
    }

    return animations;
  }
};

export {quickShot};
