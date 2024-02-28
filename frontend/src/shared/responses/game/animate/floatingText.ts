import { soundService } from "services";
import { floatingTextStore, isAnimating, playerStore } from "stores";
import { get } from "svelte/store";

const floatingText = (animation: any) => {
  isAnimating.set(true);

  const {field, name, text} = animation;
  const player = get(playerStore);

  floatingTextStore.update((store) => {
    if (name === player.name) {
      store.player[field] = text;
    } else {
      store.opponent[field] = text;
    }

    return store;
  });

  setTimeout(() => {
    floatingTextStore.update((store) => {
      if (name === player.name) {
        store.player[field] = "";
      } else {
        store.opponent[field] = "";
      }

      return store;
    });

    isAnimating.set(false);
  }, 1100);

  soundService.play("effect");
};

export {floatingText};
