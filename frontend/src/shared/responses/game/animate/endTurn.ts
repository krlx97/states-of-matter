import { soundService } from "services";
import { floatingTextStore, isAnimating, nodeStore, playerStore } from "stores";
import { get } from "svelte/store";

const endTurn = (animation: any) => {
  isAnimating.set(true);

  const {name} = animation;

  nodeStore.update((store) => {
    store.turn.trigger = true;
    store.turn.name = name;
    return store;
  });

  soundService.play("endTurn");

  setTimeout((): void => {
    nodeStore.update((store) => {
      store.turn.trigger = false;
      store.turn.name = "";
      return store;
    });
    isAnimating.set(false);
  }, 3100);
};

export {endTurn};
