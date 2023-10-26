import {EffectId} from "@som/shared/enums";
import {insertBuff} from "../insertBuff";
import type {GamePlayer} from "@som/shared/types/mongo";

interface SmokeBomb {
  player: GamePlayer;
}

const smokeBomb = (params: SmokeBomb) => {
  const {player} = params;
  const minionKeys = Object.keys(player.field) as Array<keyof typeof player.field>;

  minionKeys.forEach((key) => {
    const minion = player.field[key];

    if (minion) {
      const hasElusiveBuff = minion.buffs.find((buff) => buff.id === EffectId.ELUSIVE);

      if (!hasElusiveBuff) {
        insertBuff(minion, EffectId.STEALTH);
      }
    }
  });

  return [true, ""];
};

export {smokeBomb};
