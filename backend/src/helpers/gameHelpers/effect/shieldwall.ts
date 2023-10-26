import {EffectId} from "@som/shared/enums";
import {getAdjacentMinions} from "../getAdjacentMinions";
import {insertBuff} from "../insertBuff";
import type {GamePlayer, MinionField} from "@som/shared/types/mongo";

interface Shieldwall {
  player: GamePlayer;
  field: MinionField;
}

const shieldwall = (params: Shieldwall): void => {
  const {player, field} = params;
  const fields = getAdjacentMinions(field);

  fields.forEach((field) => {
    const minion = player.field[field as keyof typeof player.field];

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
