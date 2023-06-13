import {EffectId} from "@som/shared/enums";
import type {Effect} from "@som/shared/types/backend";
import type {Field, GameMinionCard, GamePlayer} from "@som/shared/types/backend/game";
import { deductHealth2 } from "../deductHealth2";
import { moveToGraveyard } from "../moveToGraveyard";

interface NoxiousFumes {
  opponent: GamePlayer;
  minion: GameMinionCard;
  field: Field;
}

const noxiousFumes: Effect<NoxiousFumes> = (params) => {
  const {opponent, minion, field} = params;
  const minionKeys = Object.keys(opponent.minion) as Array<keyof typeof opponent.minion>;
  let damage = 0;

  minionKeys.forEach((key) => {
    const minion = opponent.minion[key];

    if (minion) {
      const hasElusiveBuff = minion.buffs.find((buff) => buff.id === EffectId.ELUSIVE);

      if (!hasElusiveBuff) {
        const hasNeurotoxinDebuff = minion.debuffs.find((debuff) => debuff.id === EffectId.NEUROTOXIN);

        if (hasNeurotoxinDebuff) {
          damage += 1;
        }
      }
    }
  });

  deductHealth2(opponent, minion, damage);

  if (minion.health <= 0) {
    moveToGraveyard(opponent, minion, field);
  }

  return [true, ""];
};

export {noxiousFumes};
