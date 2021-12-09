import {get} from "svelte/store";
import {miscService} from "services";
import {playerStore} from "stores/data";

interface Params {
  id: number;
  klass: number;
}

const setDeckKlass = (params: Params): void => {
  const {id, klass} = params;
  const player = get(playerStore);

  playerStore.update((store) => {
    const deck = store.decks.find((deck) => deck.id === id);
    deck.klass = klass;
    return store;
  });

  // decksStore.update((store) => {
  //   const deck = store.decks.find((deck) => deck.id === id);
  //   deck.klass = klass;
  //   return store;
  // });

  // if (id === player.account.deck_id) {
  //   deckStore.update((store) => {
  //     store.cards = [];
  //     store.cardsAmount = 0;
  //     return store;
  //   });
  // }

  miscService.closeModal();
  miscService.showNotification("Deck class changed successfully.");
};

export default setDeckKlass;
