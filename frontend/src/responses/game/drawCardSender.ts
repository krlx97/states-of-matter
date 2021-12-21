import {get} from "svelte/store";
import {gameStore, playerStore} from "stores/data";

interface Params {}

const drawCardSender = (params: Params): void => {
  const {username} = get(playerStore);

  gameStore.update((store) => {
    if (username === store.playerA.username) {
      const {playerA} = store;
      const {hand, deck} = playerA;
      const card = deck.pop();

      hand.push(card);
    } else {
      const {playerB} = store;
      const {hand, deck} = playerB;
      const card = deck.pop();

      hand.push(card);
    }

    return store;
  });
};

export default drawCardSender;
