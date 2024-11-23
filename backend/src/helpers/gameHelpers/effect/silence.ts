import type {Animations} from "@som/shared/types/game";
import type {GamePlayer, GameTrapCard} from "@som/shared/types/mongo";

interface Silence {
  opponent: GamePlayer;
  trap: GameTrapCard;
}

const silence = (params: Silence): Animations => {
  const {opponent, trap} = params;

  opponent.graveyard.push(trap);
  opponent.trap = undefined;

  return [{
    type: "TRAP",
    name: opponent.name,
    card: trap
  }];
};

export {silence};
