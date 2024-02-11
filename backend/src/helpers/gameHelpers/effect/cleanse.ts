import { Animations } from "@som/shared/types/game";
import type {Field, GamePlayer} from "@som/shared/types/mongo";

interface Cleanse {
  player: GamePlayer;
  field: Field | undefined;
}

const cleanse = (params: Cleanse): Animations => {
  const {player, field} = params;

  if (!field) {
    return [];
  }

  const minion = player.field[field];

  if (!minion) {
    return [];
  }

  minion.debuffs = [];

  return [{
    type: "FLOATING_TEXT",
    field,
    name: player.name,
    text: "CLEANSE"
  }];
};

export {cleanse};
