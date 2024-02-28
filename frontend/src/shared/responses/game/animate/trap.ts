import { soundService } from "services";
import { isAnimating, nodeStore } from "stores";

const trap = (animations: any) => {
  isAnimating.set(true);

  const {name, card} = animations;

  nodeStore.update((store) => {
    store.trap.trigger = true;
    store.trap.card = card;
    store.trap.name = name;
    return store;
  });

  soundService.play("trap");

  setTimeout((): void => {
    nodeStore.update((store) => {
      store.trap.trigger = false;
      store.trap.card = undefined;
      store.trap.name = "";
      return store;
    });

    isAnimating.set(false);
  }, 3010);
};

export {trap};
