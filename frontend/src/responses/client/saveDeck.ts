import {miscService} from "services";
import {playerStore} from "stores/data";
import type {PlayerDeckCard} from "models/data/Player";

interface Params {
  cards: Array<PlayerDeckCard>;
}

const saveDeck = (params: Params): void => {
  playerStore.update((store) => {
    const {deckId} = store;
    const deck = store.decks.find((deck) => deck.id === deckId);

    deck.cards = params.cards;

    return store;
  });

  miscService.showNotification("Deck saved successfully.");
};

export default saveDeck;
