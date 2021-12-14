import {writable} from "svelte/store";
import type {Writable} from "svelte/store";

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
  }>;
}

const decksStore: Writable<DecksStore> = writable({
  deckSlots: [],
  deckCards: []
});

export default decksStore;
