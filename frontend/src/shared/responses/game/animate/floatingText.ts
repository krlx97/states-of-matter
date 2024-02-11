import { floatingTextStore, playerStore } from "stores";
import { get } from "svelte/store";

const floatingText = (animation: any) => {
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
};

export {floatingText};
