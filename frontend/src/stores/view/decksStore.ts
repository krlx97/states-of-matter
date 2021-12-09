import {writable} from "svelte/store";

const decksStore = writable({
  deckSlots: [],
  deckCards: []
});

export default decksStore;
