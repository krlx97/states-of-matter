import type {GamePlayer} from "@som/shared/types/mongo";

interface ElectroShock {
  player: GamePlayer;
  opponent: GamePlayer;
}

const electroShock = (params: ElectroShock) => {
  const {player, opponent} = params;
  const playerMinionFields = Object.keys(player.field) as Array<keyof typeof player.field>;
  const opponentMinionFields = Object.keys(opponent.field) as Array<keyof typeof opponent.field>;

  playerMinionFields.forEach((field) => {
    const minion = player.field[field];

    if (minion) {
      minion.buffs = [];
      minion.debuffs = [];
    }
  });

  opponentMinionFields.forEach((field) => {
    const minion = opponent.field[field];

    if (minion) {
      minion.buffs = [];
      minion.debuffs = [];
    }
  });

  return [true, ""];
};

export {electroShock};
