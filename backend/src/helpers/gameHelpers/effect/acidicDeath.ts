import {CardType, EffectId} from "@som/shared/enums";
import {lastStand} from "./lastStand";
import {selfDestruct} from "./selfDestruct";
import {moveToGraveyard} from "../moveToGraveyard";
import {deductHealth} from "../deductHealth";
import {isGameOver} from "../isGameOver";
import type {Animations} from "@som/shared/types/game";
import type {GamePlayer} from "@som/shared/types/mongo";

interface AcidicDeath {
  player: GamePlayer;
  opponent: GamePlayer;
}

const acidicDeath = (params: AcidicDeath): Animations => {
  const {player, opponent} = params;
  const playerMinionKeys = Object.keys(player.field) as Array<keyof typeof player.field>;
  const opponentMinionKeys = Object.keys(opponent.field) as Array<keyof typeof opponent.field>;
  const animations: Animations = [];

  playerMinionKeys.forEach((key) => {
    const minion = player.field[key];

    if (!minion || minion.type === CardType.HERO) { return; }

    animations.push(...deductHealth(player, minion, 1));

    if (minion.health.current <= 0) {
      const {trap} = player;

      if (trap && trap.effect === EffectId.LAST_STAND) {
        lastStand({minion, opponent: player, trap})
      } else {
        const hasAcidicDeathBuff = minion.buffs.find((buff) => buff.id === EffectId.ACIDIC_DEATH);

        moveToGraveyard(player, minion, key);

        if (hasAcidicDeathBuff) {
          animations.push(...acidicDeath({player, opponent}));
        }
      }
    }
  });

  opponentMinionKeys.forEach((key) => {
    const minion = opponent.field[key];

    if (!minion || minion.type === CardType.HERO) { return; }

    animations.push(...deductHealth(opponent, minion, 1));

    if (minion.health.current <= 0) {
      const {trap} = opponent;

      if (trap && trap.effect === EffectId.LAST_STAND) {
        lastStand({minion, opponent, trap})
      } else {
        const hasAcidicDeathBuff = minion.buffs.find((buff) => buff.id === EffectId.ACIDIC_DEATH);
        const hasSelfDescturctDebuff = minion.debuffs.find((debuff) => debuff.id === EffectId.SELF_DESTRUCT);

        moveToGraveyard(opponent, minion, key);

        if (hasSelfDescturctDebuff) {
          selfDestruct({player}); // check for endgame? find a better way to call onDeath effects?
        }

        if (hasAcidicDeathBuff) {
          acidicDeath({player, opponent});
        }
      }
    }
  });

  return animations;
};

export {acidicDeath};
