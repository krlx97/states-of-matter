import type {PlayerDeck} from "@som/shared/types/backend/player";

const isDeckValid = (playerDeck: PlayerDeck): boolean => {
  const numberOfCards = playerDeck
    .cards
    .reduce((value, {amount}) => value += amount, 0);

  if (numberOfCards !== 30) {
    return false;
  }

  return true;
};

export {isDeckValid};
