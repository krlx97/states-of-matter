import { soundService } from "services";
import { gameStore, isAnimating, nodeStore } from "stores";

const magic = (animations: any) => {
  isAnimating.set(true);

  const {name, card} = animations;

  nodeStore.update((store) => {
    store.magic.trigger = true;
    store.magic.card = card;
    return store;
  });

  gameStore.update((store) => {
    if (store.player.name === name) {
      const handCard = store.player.hand.find(({gid}) => gid === card.gid);

      if (!handCard) {
        return store;
      }

      store.player.hand.splice(store.player.hand.indexOf(handCard), 1);
      store.player.graveyard.push(card);
      // store.player.field[field] = minion;
    } else {
      store.opponent.hand -= 1;
      store.opponent.graveyard.push(card);
      // store.opponent.field[field] = minion;
    }

    return store;
  });

  soundService.play("magic");

  setTimeout((): void => {
    nodeStore.update((store) => {
      store.magic.trigger = false;
      store.magic.card = undefined;
      return store;
    });

    isAnimating.set(false);
  }, 3100);
};

export {magic};
