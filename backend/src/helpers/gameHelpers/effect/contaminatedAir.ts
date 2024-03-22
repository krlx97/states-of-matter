import {CardType, EffectId} from "@som/shared/enums";
import type {Animations} from "@som/shared/types/game";
import type {GamePlayer} from "@som/shared/types/mongo";

interface ContaminatedAir {
  player: GamePlayer;
  opponent: GamePlayer;
}

const contaminatedAir = (params: ContaminatedAir): Animations => {
  const {player, opponent} = params;
  const animations: Animations = [];
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

        minion.debuffs.push({
          id: EffectId.CONTAMINATED_AIR,
          data: {}
        });

        animations.push({
          type: "FLOATING_TEXT",
          name: player.name,
          field: key,
          text: "Contaminated air"
        });
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

        minion.debuffs.push({
          id: EffectId.CONTAMINATED_AIR,
          data: {}
        });

        animations.push({
          type: "FLOATING_TEXT",
          name: opponent.name,
          field: key,
          text: "Contaminated air"
        });
      }
    }
  });

  return animations;
};

export {contaminatedAir};
