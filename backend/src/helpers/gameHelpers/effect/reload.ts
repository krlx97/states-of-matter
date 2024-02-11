import type {Animations} from "@som/shared/types/game";
import type {GameCard, GamePlayer} from "@som/shared/types/mongo";

interface Reload {
  player: GamePlayer;
  drawnCard: GameCard;
}

const reload = (params: Reload): Animations => {
  const {player, drawnCard} = params;

  player.hand.push(drawnCard);

  return [];
};

export {reload};
