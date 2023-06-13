import type {Effect} from "@som/shared/types/backend";
import type {GameMinionCard} from "@som/shared/types/backend/game";

interface Necromancy {
  minion: GameMinionCard;
  isPositive: boolean;
}

const necromancy: Effect<Necromancy> = (params) => {
  const {minion, isPositive} = params;

  if (isPositive) {
    minion.health += 2;
    minion.damage += 2;
  } else {
    minion.health -= 2;
    minion.damage -= 2;
  }

  return [true, ""];
};

export {necromancy};
