import {get} from "svelte/store";
import {cards} from "@som/shared/data";
import {socketService} from "services";
import {decksStore, playerStore} from "stores";

export const selectDeck = () => {
  const {socket} = socketService;

  socket.on("selectDeck", (params) => {
    const {deckId} = params;
    const player = get(playerStore);

    playerStore.update((player) => {
      player.deckId = deckId;
      return player;
    });

    decksStore.update((decks) => {
      const {deckId} = player;
      const deck = player.decks.find((deck) => deck.id === deckId);

      decks.deckCards = deck.cards.map((deckCard) => {
        const card = cards.find((card) => card.id === deckCard.id);
        const {id, klass, name, manaCost} = card;
        const {amount} = deckCard;

        return {klass, id, name, amount, manaCost};
      }).sort((a, b) => a.manaCost - b.manaCost);

      decks.selectedDeck = decks.deckSlots.find(({id}) => id === deckId);

      return decks;
    });
  });
};
