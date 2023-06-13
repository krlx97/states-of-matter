import {EffectId} from "@som/shared/enums";
import {getAdjacentMinions} from "../getAdjacentMinions";
import {insertBuff} from "../insertBuff";
import type {Field, GamePlayer} from "@som/shared/types/backend/game";

interface Shieldwall {
  player: GamePlayer;
  field: Field;
}

const shieldwall = (params: Shieldwall): void => {
  const {player, field} = params;
  const fields = getAdjacentMinions(field);

  fields.forEach((field) => {
    const minion = player.minion[field as keyof typeof player.minion];

    if (minion) {
      const shieldBuff = minion.buffs.find((buff) => buff.id === EffectId.SHIELD);
      const unbreakableBuff = minion.buffs.find((buff) => buff.id === EffectId.UNBREAKABLE);
      const amount = unbreakableBuff ? 2 : 1;

      if (shieldBuff) {
        shieldBuff.data.amount += amount;
      } else {
        insertBuff(minion, EffectId.SHIELD, {amount});
      }
    }
  });
};

export {shieldwall};
