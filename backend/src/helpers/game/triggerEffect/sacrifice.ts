import type {Effect} from "@som/shared/types/backend";
import type {GamePlayer} from "@som/shared/types/backend/game";
import { getRandomMinion } from "../getRandomMinion";

interface Sacrifice {
  player: GamePlayer;
}

const sacrifice: Effect<Sacrifice> = (params) => {
  const {player} = params;
  const minion = getRandomMinion(player);

  if (!minion) {
    return [false, ""];
  }

  minion.health += 3;

  return [true, ""];
};

export {sacrifice};
