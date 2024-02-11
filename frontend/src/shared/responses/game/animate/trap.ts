import { soundService } from "services";
import { nodeStore } from "stores";

const trap = (animations: any) => {
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
  }, 800);
};

export {trap};
