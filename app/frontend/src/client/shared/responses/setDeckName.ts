import {miscService} from "services";
import {playerStore} from "stores/data";
import {decksStore} from "client/stores";

import type {SetDeckNameRes} from "@som/shared/interfaces/responses";
import type {Res} from "models";

const changeDeckName: Res<SetDeckNameRes> = (params) => {
  const {id, name} = params;

  playerStore.update((store) => {
    const deck = store.decks.find((deck) => deck.id === id);
    deck.name = name;
    return store;
  });

  decksStore.update((store) => {
    const deck = store.deckSlots.find((deck) => deck.id === id);
    deck.name = name;
    return store;
  });

  miscService.closeModal();
  miscService.showNotification("Deck name changed successfully.");
};

export default changeDeckName;
