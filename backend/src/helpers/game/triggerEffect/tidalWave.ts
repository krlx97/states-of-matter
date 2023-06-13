import type {Effect} from "@som/shared/types/backend";
import type {GamePlayer} from "@som/shared/types/backend/game";

interface TidalWave {
  player: GamePlayer;
}

const tidalWave: Effect<TidalWave> = (params) => {
  const {player} = params;
  const playerMinionFields = Object.keys(player.minion) as Array<keyof typeof player.minion>;

  playerMinionFields.forEach((field) => {
    const minion = player.minion[field];

    if (minion) {
      minion.health += 3;
    }
  });

  return [true, ""];
};

export {tidalWave};
