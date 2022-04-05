import {socketService} from "services";
import {gameStore} from "stores";

export const playCardReceiver = () => {
  const {socket} = socketService;

  socket.on("playCardOpponent", (params) => {
    const {field, card} = params;

    gameStore.update((store) => {
      const {fields, hero} = store.opponent;

      hero.mana -= card.manaCost;
      fields[field] = card;
      store.opponent.hand -= 1;

      return store;
    });
  });
};
