import type {Effect} from "@som/shared/types/backend";
import type {Field, GamePlayer} from "@som/shared/types/backend/game";

interface Cleanse {
  player: GamePlayer;
  field: Field | undefined;
}

const cleanse: Effect<Cleanse> = (params) => {
  const {player, field} = params;

  if (!field) {
    return [false, "Field not specified."];
  }

  const minion = player.minion[field];

  if (!minion) {
    return [false, `No minion on the ${field} field.`];
  }

  minion.debuffs = [];

  return [true, ""];
};

export {cleanse};
