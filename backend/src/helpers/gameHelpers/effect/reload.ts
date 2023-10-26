import type {GamePlayer} from "@som/shared/types/mongo";

interface Reload {
  player: GamePlayer;
}

const reload = (params: Reload) => {
  const {player} = params;
  const drawnCard = player.deck.pop();

  if (!drawnCard) {
    return [false, "You have no cards remaining to draw."];
  }

  player.hand.push(drawnCard);

  return [true, ""];
};

export {reload};
