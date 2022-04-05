import {socketService} from "services";
import {gameStore} from "stores";

export const playCardSender = () => {
  const {socket} = socketService;

  socket.on("playCardPlayer", (params) => {
    const {field, gid} = params;

    gameStore.update((store) => {
      const {hand, fields, hero} = store.player;
      const handCard = hand.find((card) => card.gid === gid);

      hero.mana -= handCard.manaCost;
      fields[field] = handCard;
      hand.splice(hand.indexOf(handCard), 1);

      return store;
    });
  });
};
