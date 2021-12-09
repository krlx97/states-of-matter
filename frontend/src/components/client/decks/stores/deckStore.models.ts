interface DeckCard {
  id: number;
  klass: number;
  name: string;
  amount: number;
}

interface DeckStore {
  name: string;
  cards: Array<DeckCard>;
  cardsAmount: number;
}

export type {DeckCard, DeckStore};
