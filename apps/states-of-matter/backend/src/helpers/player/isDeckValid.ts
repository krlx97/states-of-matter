import type {PlayerDeck} from "models/Player";

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
