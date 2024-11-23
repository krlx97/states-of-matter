import type {GamePlayer} from "@som/shared/types/mongo";

interface TidalWave {
  player: GamePlayer;
}

const tidalWave = (params: TidalWave) => {
  const {player} = params;
  const playerMinionFields = Object.keys(player.field) as Array<keyof typeof player.field>;

  playerMinionFields.forEach((field) => {
    const minion = player.field[field];

    if (minion) {
      minion.health += 3;
    }
  });

  return [true, ""];
};

export {tidalWave};
