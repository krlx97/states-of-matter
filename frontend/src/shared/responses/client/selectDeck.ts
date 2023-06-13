import {get} from "svelte/store";
import {socketService} from "services";
import {deckStore, playerStore} from "stores";

const selectDeck = (): void => {
  socketService.socket.on("selectDeck", (params): void => {
    const {deckId} = params;
    const player = get(playerStore);

    playerStore.update((player) => {
      player.deckId = deckId;
      return player;
    });

    deckStore.set(player.decks.find(({id}) => id === player.deckId));
  });
};

export {selectDeck};
