import {playerStore} from "stores/data";
import {decksStore} from "stores/view";

interface Params {
  deckId: number;
  klass: number;
}

const setDeckKlass = (params: Params): void => {
  const {deckId, klass} = params;

  playerStore.update((store) => {
    const deck = store.decks.find((deck) => deck.id === deckId);
    deck.klass = klass;
    return store;
  });

  decksStore.update((store) => {
    const deck = store.deckSlots.find((deck) => deck.id === deckId);
    deck.klass = klass;
    return store;
  });
};

export default setDeckKlass;
