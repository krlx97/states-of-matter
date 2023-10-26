import type {GamePlayer, GameTrapCard} from "@som/shared/types/mongo";

interface Silence {
  opponent: GamePlayer;
  trap: GameTrapCard;
}

const silence = (params: Silence) => {
  const {opponent, trap} = params;

  opponent.graveyard.push(trap);
  opponent.trap = undefined;

  return [true, ""]
};

export {silence};
