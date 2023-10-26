import {EffectId} from "@som/shared/enums";
import {insertBuff} from "../insertBuff";
import type {GamePlayer} from "@som/shared/types/mongo";

interface Shell {
  player: GamePlayer;
}

const shell = (params: Shell): any => {
  const {player} = params;
  const keys = Object.keys(player.field) as Array<keyof typeof player.field>;

  keys.forEach((field) => {
    const minion = player.field[field];

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

export {shell};
