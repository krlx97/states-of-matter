import {getRandomMinion} from "../getRandomMinion";
import type {GamePlayer} from "@som/shared/types/mongo";

interface Sacrifice {
  player: GamePlayer;
}

const sacrifice = (params: Sacrifice) => {
  const {player} = params;
  const minion = getRandomMinion(player);

  if (!minion) {
    return [false, ""];
  }

  minion.health += 3;

  return [true, ""];
};

export {sacrifice};
