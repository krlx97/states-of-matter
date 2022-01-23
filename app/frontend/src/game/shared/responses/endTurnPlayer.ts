import {gameStore} from "game/stores";

import type {Res} from "models";

const endTurnPlayer: Res = () => {
  gameStore.update((store) => {
    const {opponent} = store;

    store.currentPlayer = store.opponent.username;
    opponent.hand += 1;
    opponent.deck -= 1;
    opponent.hero.mana = 100;

    return store;
  });
};

export default endTurnPlayer;
