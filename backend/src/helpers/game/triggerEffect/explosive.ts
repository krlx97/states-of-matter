import type {Effect} from "@som/shared/types/backend";
import type {Field, GamePlayer, GameTrapCard} from "@som/shared/types/backend/game";
import { getAdjacentMinions } from "../getAdjacentMinions";
import { moveToGraveyard } from "../moveToGraveyard";

interface Explosive {
  player: GamePlayer;
  opponent: GamePlayer;
  trap: GameTrapCard;
  field: Field;
}

const explosive: Effect<Explosive> = (params) => {
  const {player, opponent, trap, field} = params;

  const fields = getAdjacentMinions(field) as Field[];

  fields.forEach((field) => {
    const minion = player.minion[field];

    if (minion) {
      minion.health -= 2;
      if (minion.health <= 0) {
        moveToGraveyard(player, minion, field);
      }
    }
  });

  opponent.graveyard.push(trap);
  opponent.trap = undefined;

  return [true, "Last stand triggered"];
};

export {explosive};
