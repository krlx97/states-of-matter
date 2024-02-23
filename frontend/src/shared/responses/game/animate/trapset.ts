import { soundService } from "services";
import { nodeStore } from "stores";

const trapset = (animations: any) => {
  const {name} = animations;

  nodeStore.update((store) => {
    store.trapset.trigger = true;
    store.trapset.name = name;
    return store;
  });

  soundService.play("card");

  setTimeout((): void => {
    nodeStore.update((store) => {
      store.trapset.trigger = false;
      store.trapset.name = "";
      return store;
    });
  }, 3000);
};

export {trapset};
