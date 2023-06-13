import {EffectId} from "@som/shared/enums";
import type {Effect} from "@som/shared/types/backend";
import type {GamePlayer} from "@som/shared/types/backend/game";
import {lastStand} from "./lastStand";
import {moveToGraveyard} from "../moveToGraveyard";
import {deductHealth2} from "../deductHealth2";
import { selfDestruct } from "./selfDestruct";
import { isGameOver } from "../isGameOver";

interface AcidicDeath {
  player: GamePlayer;
  opponent: GamePlayer;
}

const acidicDeath: Effect<AcidicDeath> = (params) => {
  const {player, opponent} = params;
  const playerMinionKeys = Object.keys(player.minion) as Array<keyof typeof player.minion>;
  const opponentMinionKeys = Object.keys(opponent.minion) as Array<keyof typeof opponent.minion>;

  playerMinionKeys.forEach((key) => {
    const minion = player.minion[key];

    if (!minion) { return; }

    deductHealth2(player, minion, 1);

    if (minion.health <= 0) {
      const {trap} = player;

      if (trap && trap.effect === EffectId.LAST_STAND) {
        lastStand({minion, opponent: player, trap})
      } else {
        const hasAcidicDeathBuff = minion.buffs.find((buff) => buff.id === EffectId.ACIDIC_DEATH);

        moveToGraveyard(player, minion, key);

        if (hasAcidicDeathBuff) {
          acidicDeath({player, opponent});
        }
      }
    }
  });

  opponentMinionKeys.forEach((key) => {
    const minion = opponent.minion[key];

    if (!minion) { return; }

    deductHealth2(opponent, minion, 1);

    if (minion.health <= 0) {
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

  return [true, "Acidic Death triggered."];
};

export {acidicDeath};
