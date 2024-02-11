import {CardType, EffectId} from "@som/shared/enums";
import {insertDebuff} from "../insertDebuff";
import type {GamePlayer} from "@som/shared/types/mongo";

interface ContaminatedAir {
  player: GamePlayer;
  opponent: GamePlayer;
}

const contaminatedAir = (params: ContaminatedAir) => {
  const {player, opponent} = params;
  const minionKeys = Object.keys(player.field) as Array<keyof typeof player.field>;
  const opponentMinionKeys = Object.keys(player.field) as Array<keyof typeof player.field>;

  minionKeys.forEach((key) => {
    const minion = player.field[key];

    if (minion && minion.type !== CardType.HERO) {
      const hasElusiveBuff = minion.buffs.find((buff) => buff.id === EffectId.ELUSIVE);

      if (!hasElusiveBuff) {
        if (minion.damage.current > 0) {
          minion.damage.current -= 1;
        }

        insertDebuff(minion, EffectId.CONTAMINATED_AIR);
      }
    }
  });

  opponentMinionKeys.forEach((key) => {
    const minion = opponent.field[key];

    if (minion && minion.type !== CardType.HERO) {
      const hasElusiveBuff = minion.buffs.find((buff) => buff.id === EffectId.ELUSIVE);

      if (!hasElusiveBuff) {
        if (minion.damage.current > 0) {
          minion.damage.current -= 1;
        }

        insertDebuff(minion, EffectId.CONTAMINATED_AIR);
      }
    }
  });

  return [true, ""];
};

export {contaminatedAir};
