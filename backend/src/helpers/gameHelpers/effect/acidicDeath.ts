import {CardType, EffectId} from "@som/shared/enums";
import {lastStand} from "./lastStand";
import {selfDestruct} from "./selfDestruct";
import {moveToGraveyard} from "../moveToGraveyard";
import {deductHealth} from "../deductHealth";
import type {Animations} from "@som/shared/types/game";
import type {FieldKeys, GameMinionCard, GamePlayer, MinionField} from "@som/shared/types/mongo";

interface AcidicDeathOnNormalSummon {
  player: GamePlayer;
  playerMinion: GameMinionCard;
  playerMinionField: MinionField;
}

interface AcidicDeath {
  player: GamePlayer;
  opponent: GamePlayer;
}

const acidicDeath = {
  onNormalSummon (params: AcidicDeathOnNormalSummon): Animations {
    const {player, playerMinion, playerMinionField} = params;
    const animations: Animations = [];

    playerMinion.buffs.push({
      id: EffectId.ACIDIC_DEATH,
      data: {}
    });

    animations.push({
      type: "FLOATING_TEXT",
      field: playerMinionField,
      name: player.name,
      text: "ACIDIC DEATH"
    });

    return animations;
  },
  onDeath (params: AcidicDeath): Animations {
    const {player, opponent} = params;
    const playerMinionKeys = Object.keys(player.field) as FieldKeys;
    const opponentMinionKeys = Object.keys(opponent.field) as FieldKeys;
    const animations: Animations = [];

    playerMinionKeys.forEach((key): void => {
      if (key === "hero") {
        return;
      }

      const minion = player.field[key];

      if (!minion) {
        return;
      }

      animations.push(...deductHealth(player, minion, 1, key));

      if (minion.health.current <= 0) {
        const {trap} = player;

        if (trap && trap.effect === EffectId.LAST_STAND) {
          animations.push(...lastStand({
            opponent: player,
            opponentMinion: minion,
            opponentMinionField: key,
            opponentTrap: trap
          }));
        } else {
          const hasAcidicDeathBuff = minion.buffs.find(
            (buff): boolean => buff.id === EffectId.ACIDIC_DEATH
          );

          animations.push(...moveToGraveyard(player, minion, key));

          if (hasAcidicDeathBuff) {
            animations.push(...acidicDeath.onDeath({player, opponent}));
          }
        }
      }
    });

    opponentMinionKeys.forEach((key): void => {
      if (key === "hero") {
        return;
      }

      const minion = opponent.field[key];

      if (!minion) {
        return;
      }

      animations.push(...deductHealth(opponent, minion, 1, key));

      if (minion.health.current <= 0) {
        const {trap} = opponent;

        if (trap && trap.effect === EffectId.LAST_STAND) {
          animations.push(...lastStand({
            opponent,
            opponentMinion: minion,
            opponentMinionField: key,
            opponentTrap: trap
          }));
        } else {
          const hasAcidicDeathBuff = minion.buffs.find(
            (buff): boolean => buff.id === EffectId.ACIDIC_DEATH
          );
          // const hasSelfDescturctDebuff = minion.debuffs.find((debuff) => debuff.id === EffectId.SELF_DESTRUCT);

          animations.push(...moveToGraveyard(opponent, minion, key));

          // if (hasSelfDescturctDebuff) {
            // check for endgame? find a better way to call onDeath effects?
            // animations.push(...selfDestruct({player}));
          // }

          if (hasAcidicDeathBuff) {
            animations.push(...acidicDeath.onDeath({player, opponent}));
          }
        }
      }
    });

    return animations;
  }
};

export {acidicDeath};
