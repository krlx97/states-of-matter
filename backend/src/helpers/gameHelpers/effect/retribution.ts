import type {Field, GameMinionCard, GamePlayer, GameTrapCard} from "@som/shared/types/mongo";
import { getAdjacentMinions } from "../getAdjacentMinions";

interface RisingFury {
  player: GamePlayer;
  field: Field;
}

const retribution = (params: RisingFury) => {
  const {player, field} = params;
  const adj = getAdjacentMinions(field);

  adj.forEach((field) => {
    const minj = player.field[field];
    if (!minj) return;
    minj.damage -= 2;
    if (minj.damage <= 0) {
      minj.damage = 0;
    }
  });

  return [true, ""];
};

export {retribution};
