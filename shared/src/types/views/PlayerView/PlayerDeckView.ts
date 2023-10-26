import type {PlayerDeckCardView} from "./PlayerDeckCardView.js";

interface PlayerDeckView {
  id: number;
  name: string;
  klass: number;
  cardsInDeck: number;
  cards: Array<PlayerDeckCardView>;
}

export type {PlayerDeckView};
