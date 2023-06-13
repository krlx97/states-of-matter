import {EffectId} from "@som/shared/enums";
import {insertDebuff} from "../insertDebuff";
import type {Effect} from "@som/shared/types/backend";
import type {GamePlayer} from "@som/shared/types/backend/game";

interface ContaminatedAir {
  player: GamePlayer;
  opponent: GamePlayer;
}

const contaminatedAir: Effect<ContaminatedAir> = (params) => {
  const {player, opponent} = params;
  const minionKeys = Object.keys(player.minion) as Array<keyof typeof player.minion>;
  const opponentMinionKeys = Object.keys(player.minion) as Array<keyof typeof player.minion>;

  minionKeys.forEach((key) => {
    const minion = player.minion[key];

    if (minion) {
      const hasElusiveBuff = minion.buffs.find((buff) => buff.id === EffectId.ELUSIVE);

      if (!hasElusiveBuff) {
        if (minion.damage > 0) {
          minion.damage -= 1;
        }

        insertDebuff(minion, EffectId.CONTAMINATED_AIR);
      }
    }
  });

  opponentMinionKeys.forEach((key) => {
    const minion = opponent.minion[key];

    if (minion) {
      const hasElusiveBuff = minion.buffs.find((buff) => buff.id === EffectId.ELUSIVE);

      if (!hasElusiveBuff) {
        if (minion.damage > 0) {
          minion.damage -= 1;
        }

        insertDebuff(minion, EffectId.CONTAMINATED_AIR);
      }
    }
  });

  return [true, ""];
};

export {contaminatedAir};
