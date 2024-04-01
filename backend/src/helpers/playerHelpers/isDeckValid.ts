import type {PlayerDeck} from "@som/shared/types/mongo";

const isDeckValid = (playerDeck: PlayerDeck): boolean => {
  return playerDeck
    .cards
    .reduce((value, {amount}) => value += amount, 0) === 30;
};

export {isDeckValid};
