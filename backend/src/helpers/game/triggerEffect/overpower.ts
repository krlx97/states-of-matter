import type {Effect} from "@som/shared/types/backend";
import type {GameMinionCard, GamePlayer} from "@som/shared/types/backend/game";

interface Overpower {
  opponent: GamePlayer;
  damage: number;
}

const overpower: Effect<Overpower> = (params) => {
  const {opponent, damage} = params;
  opponent.hero.health -= damage;
  return [true, ""];
};

export {overpower};
