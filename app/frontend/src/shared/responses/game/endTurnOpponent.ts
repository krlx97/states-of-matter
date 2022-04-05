import {socketService} from "services";
import {gameStore} from "stores";

export const endTurnOpponent = () => {
  const {socket} = socketService;

  socket.on("endTurnOpponent", () => {
    gameStore.update((store) => {
      const {player} = store;
      const {deck, hand, hero, username} = player;

      store.currentPlayer = username;
      hand.push(deck.pop());
      hero.mana = 100;

      return store;
    });
  });
};
