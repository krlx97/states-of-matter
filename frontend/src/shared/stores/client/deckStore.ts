import {writable} from "svelte/store";
// import type {PlayerDeck} from "@som/shared/types/frontend";

interface PlayerDeckCard {
  id: number;
  name: string;
  amount: number;
  manaCost: number;
}

interface PlayerDeck {
  id: number;
  name: string;
  klass: number;
  cardsInDeck: number;
  cards: PlayerDeckCard[];
}

// rename to currentDeckStore?
const deckStore = writable<PlayerDeck>({
  id: 0,
  klass: 0,
  name: "",
  cardsInDeck: 0,
  cards: []
});

export {deckStore};
