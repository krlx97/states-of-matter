import { get } from "svelte/store";
import {create_in_transition} from "svelte/internal";
import { soundService } from "services";
import { nodeStore, playerStore } from "stores";

const shake = (animation: any): void => {
  const {damageTaken, field, name} = animation;
  const nodes = get(nodeStore);
  const player = get(playerStore);
  const elemId = `${field}Damage`;
  let elem: HTMLElement;

  if (name === player.name) {
    elem = nodes.player[elemId];
  } else {
    elem = nodes.opponent[elemId];
  }

  elem.style.visibility = "visible";
  elem.innerText = `-${damageTaken}`;

  create_in_transition(elem, (node: HTMLDivElement) => {
    return {
      duration: 600,
      css (t: number) {
        const translation = Math.sin(t * Math.PI) * 15;

        if (Math.floor(t * 100) % 2 === 0) {
          return `transform: translateX(${translation}px);`;
        } else {
          return `transform: translateX(-${translation}px);`;
        }
      }
    };
  }, {}).start();

  setTimeout(() => {
    elem.style.visibility = "hidden";
    elem.innerText = "";
  }, 600);

  soundService.play("attack");
};

export {shake};
