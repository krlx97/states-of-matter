import type {GameMinionCard} from "@som/shared/types/mongo";
import { insertBuff } from "../insertBuff";
import { insertDebuff } from "../insertDebuff";
import { EffectId } from "@som/shared/enums";

interface Necromancy {
  minion: GameMinionCard;
  isPositive: boolean;
}

const necromancy = (params: Necromancy) => {
  const {minion, isPositive} = params;

  if (isPositive) {
    minion.health += 2;
    minion.damage += 2;

    insertBuff(minion, EffectId.NECROMANCY, {
      health: 2,
      damage: 2
    });
  } else {
    minion.health -= 2;
    minion.damage -= 2;

    insertDebuff(minion, EffectId.NECROMANCY, {
      health: -2,
      damage: -2
    });
  }

  return [true, ""];
};

export {necromancy};
