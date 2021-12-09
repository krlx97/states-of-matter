import {writable} from "svelte/store";

import type {Writable} from "svelte/store";
import type {DeckStore} from "./deckStore.models";

const deckStore: Writable<DeckStore> = writable({
  name: "",
  cards: [],
  cardsAmount: 0
});

export default deckStore;
