import {miscService} from "services";
import {playerStore} from "stores/data";

import type {SaveDeckRes} from "@som/shared/interfaces/responses";
import type {Res} from "models";

const saveDeck: Res<SaveDeckRes> = (params) => {
  playerStore.update((store) => {
    const {deckId} = store;
    const deck = store.decks.find((deck) => deck.id === deckId);

    deck.cards = params.cards;

    return store;
  });

  miscService.showNotification("Deck saved successfully.");
};

export default saveDeck;
