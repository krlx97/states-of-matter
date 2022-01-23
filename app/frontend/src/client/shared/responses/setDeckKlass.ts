import {playerStore} from "stores/data";
import {decksStore} from "client/stores";

import type {SetDeckKlassRes} from "@som/shared/interfaces/responses";
import type {Res} from "models";

const setDeckKlass: Res<SetDeckKlassRes> = (params) => {
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
