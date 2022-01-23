import {gameStore} from "game/stores";

import type {Res} from "models";

const endTurnOpponent: Res = () => {
  gameStore.update((store) => {
    const {player} = store;

    store.currentPlayer = player.username;
    player.hand.push(player.deck.pop());
    player.hero.mana = 100;

    return store;
  });
};

export default endTurnOpponent;
