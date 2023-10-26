import { floatingTextStore, playerStore } from "stores";
import { get } from "svelte/store";

const floatingText = (animation: any) => {
  const {field, name, text} = animation;
  const player = get(playerStore);

  floatingTextStore.update((store) => {
    // let list;

    if (name === player.name) {
      store.player[field] = text;
    } else {
      store.opponent[field] = text;
    }

    // list.push({
    //   id: Math.floor(Math.random() * 1e6),
    //   animationId: 0,
    //   text,
    //   frame: 0,
    //   bottom: 0,
    //   left: Math.floor(Math.random() * 96),
    //   opacity: 1
    // });

    return store;
  });
};

export {floatingText};
