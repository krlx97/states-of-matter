import type {PlayerDeck} from "@som/shared/types/mongo";

const isDeckValid = (playerDeck: PlayerDeck): boolean => {
  // maybe check whether it includes a hero, since that is also invalid?
  // or do this check in saveDeck, and remove this function altogether?
  return playerDeck
    .cards
    .reduce((value, {amount}) => value += amount, 0) === 30;
};

export {isDeckValid};
