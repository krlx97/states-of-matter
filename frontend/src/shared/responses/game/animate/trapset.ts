import { soundService } from "services";
import { gameStore, isAnimating, nodeStore } from "stores";

const trapset = (animations: any) => {
  isAnimating.set(true);

  const {name, gid} = animations;

  nodeStore.update((store) => {
    store.trapset.trigger = true;
    store.trapset.name = name;
    return store;
  });

  gameStore.update((store) => {
    if (store.player.name === name) {
      const handCard = store.player.hand.find((card) => card.gid === gid);

      if (!handCard) {
        return store;
      }

      store.player.hand.splice(store.player.hand.indexOf(handCard), 1);
    } else {
      store.opponent.hand -= 1;
    }

    return store;
  });

  soundService.play("card");

  setTimeout((): void => {
    nodeStore.update((store) => {
      store.trapset.trigger = false;
      store.trapset.name = "";
      return store;
    });

    isAnimating.set(false);
  }, 3100);
};

export {trapset};
