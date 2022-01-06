import {gameStore} from "game/stores";
import type {Res} from "models";

const drawCardSender: Res = () => {
  gameStore.update((store) => {
    const {hand, deck} = store.player;

    hand.push(deck.pop());

    return store;
  });
};

export default drawCardSender;
