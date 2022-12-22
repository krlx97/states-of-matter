import {miscService, socketService} from "services";
import {playerStore} from "stores";

export const saveDeck = () => {
  const {socket} = socketService;

  socket.on("saveDeck", (params) => {
    playerStore.update((player) => {
      const {deckId} = player;
      const deck = player.decks.find((deck) => deck.id === deckId);

      deck.cards = params.cards;

      return player;
    });

    miscService.showNotification("Deck saved successfully.");
  });
};
