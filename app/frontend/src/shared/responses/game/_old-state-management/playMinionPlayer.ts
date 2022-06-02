import {socketService} from "services";
import {gameStore} from "stores";

export const playMinionPlayer = (): void => {
  const {socket} = socketService;

  socket.on("playMinionPlayer", (params): void => {
    const {field, gid} = params;

    gameStore.update((store) => {
      const {hand, minion, hero} = store.player;
      const handCard = hand.find((card) => card.gid === gid);

      hero.mana -= handCard.manaCost;
      minion[field] = handCard;
      hand.splice(hand.indexOf(handCard), 1);

      return store;
    });
  });
};
