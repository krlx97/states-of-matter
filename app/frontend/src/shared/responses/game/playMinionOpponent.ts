import {socketService} from "services";
import {gameStore} from "stores";

export const playMinionOpponent = (): void => {
  const {socket} = socketService;

  socket.on("playMinionOpponent", (params): void => {
    const {field, card} = params;

    gameStore.update((store) => {
      const {minion, hero} = store.opponent;

      hero.mana -= card.manaCost;
      minion[field] = card;
      store.opponent.hand -= 1;

      return store;
    });
  });
};
