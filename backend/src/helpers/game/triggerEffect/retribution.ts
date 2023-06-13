import type {Effect} from "@som/shared/types/backend";
import type {Field, GameMinionCard, GamePlayer, GameTrapCard} from "@som/shared/types/backend/game";
import { getAdjacentMinions } from "../getAdjacentMinions";

interface RisingFury {
  player: GamePlayer;
  field: Field;
}

const retribution: Effect<RisingFury> = (params) => {
  const {player, field} = params;
  const adj = getAdjacentMinions(field);

  adj.forEach((field) => {
    const minj = player.minion[field];
    if (!minj) return;
    minj.damage -= 2;
    if (minj.damage <= 0) {
      minj.damage = 0;
    }
  });

  return [true, ""];
};

export {retribution};
