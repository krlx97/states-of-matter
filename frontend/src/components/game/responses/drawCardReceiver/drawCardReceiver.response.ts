import {gameStore} from "game/stores";
import type {Res} from "models";

const drawCardReceiver: Res = () => {
  gameStore.update((store) => {
    const {opponent} = store;

    opponent.hand += 1;
    opponent.deck -= 1;

    return store;
  });
};

export default drawCardReceiver;
