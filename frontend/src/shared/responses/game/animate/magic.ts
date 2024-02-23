import { soundService } from "services";
import { nodeStore } from "stores";

const magic = (animations: any) => {
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
  }, 3000);
};

export {magic};
