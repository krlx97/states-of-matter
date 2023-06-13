import {EffectId} from "@som/shared/enums";
import {insertBuff} from "../insertBuff";
import type {Effect} from "@som/shared/types/backend";
import type {GamePlayer} from "@som/shared/types/backend/game";

interface SmokeBomb {
  player: GamePlayer;
}

const smokeBomb: Effect<SmokeBomb> = (params) => {
  const {player} = params;
  const minionKeys = Object.keys(player.minion) as Array<keyof typeof player.minion>;

  minionKeys.forEach((key) => {
    const minion = player.minion[key];

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
