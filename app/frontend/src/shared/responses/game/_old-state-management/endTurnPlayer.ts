import {socketService} from "services";
import {gameStore} from "stores";

export const endTurnPlayer = () => {
  const {socket} = socketService;

  socket.on("endTurnPlayer", () => {
    gameStore.update((store) => {
      const {opponent} = store;

      store.currentPlayer = store.opponent.username;
      opponent.hand += 1;
      opponent.deck -= 1;
      opponent.hero.mana = 100;

      return store;
    });
  });
};
