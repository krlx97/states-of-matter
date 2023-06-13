import type {Effect} from "@som/shared/types/backend";
import type {GamePlayer, GameTrapCard} from "@som/shared/types/backend/game";

interface Silence {
  opponent: GamePlayer;
  trap: GameTrapCard;
}

const silence: Effect<Silence> = (params) => {
  const {opponent, trap} = params;

  opponent.graveyard.push(trap);
  opponent.trap = undefined;

  return [true, ""]
};

export {silence};
