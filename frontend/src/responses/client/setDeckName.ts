import {get} from "svelte/store";
import {miscService} from "services";
import {playerStore} from "stores/data";
import {decksStore} from "stores/view";

interface Params {
  id: number;
  name: string;
}

const changeDeckName = (params: Params): void => {
  const {id, name} = params;
  const player = get(playerStore);

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
