import {EffectId} from "@som/shared/enums";
import type {FieldKeys, GamePlayer} from "@som/shared/types/mongo";
import type {Animations} from "@som/shared/types/game";

interface ToxicGas {
  opponent: GamePlayer;
}

const toxicGas = {
  onNormalSummon (params: ToxicGas): Animations {
    const {opponent} = params;
    const unitFields = Object.keys(opponent.field) as FieldKeys;
    const animations: Animations = [];

    for (const field of unitFields) {
      const unit = opponent.field[field];

      const hasElusiveBuff = unit?.buffs.find(
        (buff): boolean => buff.id === EffectId.ELUSIVE
      );

      if (!unit || hasElusiveBuff) {
        continue;
      }

      unit.debuffs.push({
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

    return animations;
  }
};

export {toxicGas};
