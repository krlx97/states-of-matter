import {socketService} from "services";
import {decksStore, playerStore} from "stores";

export const setDeckKlass = () => {
  const {socket} = socketService;

  socket.on("setDeckKlass", (params) => {
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
  });
};
