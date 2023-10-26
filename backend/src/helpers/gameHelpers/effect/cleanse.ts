import type {Field, GamePlayer} from "@som/shared/types/mongo";

interface Cleanse {
  player: GamePlayer;
  field: Field | undefined;
}

const cleanse = (params: Cleanse) => {
  const {player, field} = params;

  if (!field) {
    return [false, "Field not specified."];
  }

  const minion = player.field[field];

  if (!minion) {
    return [false, `No minion on the ${field} field.`];
  }

  minion.debuffs = [];

  return [true, ""];
};

export {cleanse};
