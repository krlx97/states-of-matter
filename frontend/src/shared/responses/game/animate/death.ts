import {create_in_transition} from "svelte/internal";
import {soundService} from "services";
import {get} from "svelte/store";
import {gameStore, nodeStore, playerStore} from "stores";

const death = (animation: any): void => {
  const nodes = get(nodeStore);
  const player = get(playerStore);
  const {field, name} = animation;
  let graveRect: DOMRect;
  let cardRect: DOMRect;
  let isPlayer: boolean;
  let elem: HTMLElement;

  if (name === player.name) {
    elem = nodes.player[field];
    graveRect = nodes.player.graveyard.getBoundingClientRect();
    cardRect = nodes.player[field].getBoundingClientRect();
    isPlayer = true;
  } else {
    elem = nodes.opponent[field];
    graveRect = nodes.opponent.graveyard.getBoundingClientRect();
    cardRect = nodes.opponent[field].getBoundingClientRect();
    isPlayer = false;
  }


  create_in_transition(elem, () => {
    return {
      duration: 900,
      css (t) {
        if (isPlayer) {
          return `
            transform: translateX(-${t * (cardRect.left - graveRect.left)}px);
          `;
        } else {
          const distance = graveRect.left - cardRect.left;
          // For the opponent, we need to mirror the translation, so we negate the distance
          const translationX = distance * t;

          // Apply the translation
          // card.style.transform = `translateX(${translationX}px)`;
          return `
            transform: translateX(${translationX}px);
          `;
        }
      }
    };
  }, {}).start();

  setTimeout(() => {
    gameStore.update((store) => {
      if (isPlayer) {
        store.player.graveyard.push(store.player.field[field]);
        store.player.field[field] = undefined;
      } else {
        store.opponent.graveyard.push(store.opponent.field[field]);
        store.opponent.field[field] = undefined;
      }

      return store;
    });
  }, 890);

  soundService.play("death");
};

export {death};
