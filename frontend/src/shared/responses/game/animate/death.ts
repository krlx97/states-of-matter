import {create_in_transition} from "svelte/internal";
import {soundService} from "services";
import {get} from "svelte/store";
import {nodeStore, playerStore} from "stores";

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
      duration: 800,
      css (t, u) {
        if (isPlayer) {
          return `
            transform: translateX(-${t * (cardRect.left - graveRect.left)}px);
          `;
        } else {
          return `
            transform: translateX(${t * (graveRect.right - cardRect.right)}px);
          `;
        }
      }
    };
  }, {}).start();

  soundService.play("death");
};

export {death};
