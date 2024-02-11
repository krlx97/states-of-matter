import {socketService} from "services";
import {playerStore} from "stores";

const selectDeck = (): void => {
  socketService.socket.on("selectDeck", (params): void => {
    const {deckId} = params;

    playerStore.update((player) => {
      player.deckId = deckId;
      return player;
    });
  });
};

export {selectDeck};
