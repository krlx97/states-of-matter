import {writable} from "svelte/store";

interface DecksStore {
  deckSlots: Array<{
    id: number;
    name: string;
    klass: number;
    cardsInDeck: number;
  }>;
  deckCards: Array<{
    klass: number;
    id: number;
    name: string;
    amount: number;
    manaCost: number;
  }>;
  selectedDeck: {
    id: number;
    name: string;
    klass: number;
    cardsInDeck: number;
  };
};

const decksStore = writable<DecksStore>({
  deckSlots: [],
  deckCards: [],
  selectedDeck: {
    id: 0,
    name: "",
    klass: 0,
    cardsInDeck: 0
  }
});

export {decksStore};
