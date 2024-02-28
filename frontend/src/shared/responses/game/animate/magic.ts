import { soundService } from "services";
import { isAnimating, nodeStore } from "stores";

const magic = (animations: any) => {
  isAnimating.set(true);

  const {card} = animations;

  nodeStore.update((store) => {
    store.magic.trigger = true;
    store.magic.card = card;
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
  }, 3010);
};

export {magic};
