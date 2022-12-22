import {miscService, socketService} from "services";
import {decksStore, playerStore} from "stores";

export const setDeckName = () => {
  const {socket} = socketService;

  socket.on("setDeckName", (params) => {
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
  });
};
