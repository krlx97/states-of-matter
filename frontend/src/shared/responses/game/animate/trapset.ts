import { soundService } from "services";
import { isAnimating, nodeStore } from "stores";

const trapset = (animations: any) => {
  isAnimating.set(true);

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

    isAnimating.set(false);
  }, 3010);
};

export {trapset};
