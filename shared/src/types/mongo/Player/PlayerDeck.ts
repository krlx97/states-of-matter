import type {PlayerDeckCard} from "./PlayerDeckCard.js";

interface PlayerDeck {
  id: number;
  name: string;
  klass: number;
  cards: Array<PlayerDeckCard>;
}

export type {PlayerDeck};
