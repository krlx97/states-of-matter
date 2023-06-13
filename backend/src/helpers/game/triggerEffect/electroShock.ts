import type {Effect} from "@som/shared/types/backend";
import type {GamePlayer} from "@som/shared/types/backend/game";

interface ElectroShock {
  player: GamePlayer;
  opponent: GamePlayer;
}

const electroShock: Effect<ElectroShock> = (params) => {
  const {player, opponent} = params;
  const playerMinionFields = Object.keys(player.minion) as Array<keyof typeof player.minion>;
  const opponentMinionFields = Object.keys(opponent.minion) as Array<keyof typeof opponent.minion>;

  playerMinionFields.forEach((field) => {
    const minion = player.minion[field];

    if (minion) {
      minion.buffs = [];
      minion.debuffs = [];
    }
  });

  opponentMinionFields.forEach((field) => {
    const minion = opponent.minion[field];

    if (minion) {
      minion.buffs = [];
      minion.debuffs = [];
    }
  });

  return [true, ""];
};

export {electroShock};
