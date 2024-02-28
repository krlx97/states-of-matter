import { writable } from "svelte/store";
import type { PlayerDeckView } from "@som/shared/types/views";

const deckCache = writable<PlayerDeckView>({
  id: 0,
  name: "",
  klass: 1,
  cardsInDeck: 0,
  cards: [],
  attribute: {
    gas: 0,
    liquid: 0,
    magic: 0,
    minion: 0,
    neutral: 0,
    plasma: 0,
    solid: 0,
    trap:0
  },
  average: {
    damage: 0,
    health: 0,
    manaCost: 0
  }
});

export {deckCache};
