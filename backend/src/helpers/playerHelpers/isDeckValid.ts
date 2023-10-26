import type {PlayerDeck} from "@som/shared/types/mongo";

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
