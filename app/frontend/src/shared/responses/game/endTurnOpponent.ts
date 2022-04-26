import {socketService} from "services";
import {gameStore} from "stores";

export const endTurnOpponent = (): void => {
  socketService.socket.on("endTurnOpponent", (): void => {
    gameStore.update((store) => {
      const {deck, hand, hero, username} = store.player;

      store.currentPlayer = username;
      hand.push(deck.pop());
      hero.mana = 100;

      return store;
    });
  });
};
