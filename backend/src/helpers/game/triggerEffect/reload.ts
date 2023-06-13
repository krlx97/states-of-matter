import type {Effect} from "@som/shared/types/backend";
import type {GamePlayer} from "@som/shared/types/backend/game";

interface Reload {
  player: GamePlayer;
}

const reload: Effect<Reload> = (params) => {
  const {player} = params;
  const drawnCard = player.deck.pop();

  if (!drawnCard) {
    return [false, "You have no cards remaining to draw."];
  }

  player.hand.push(drawnCard);

  return [true, ""];
};

export {reload};
