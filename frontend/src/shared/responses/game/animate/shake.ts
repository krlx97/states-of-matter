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
  let isReversed = false;
  let px = 1;

  create_in_transition(elem, (node) => {
    return {
      duration: 800,
      // css (t, u) {
      //   let d = Math.floor(t * 10);
      //   isReversed = d % 2 === 0;

      //   if (isReversed) {
      //     px -= 3;
      //   } else {
      //     px += 3;
      //   }

      //     // box-shadow: 0 0 ${shadow * 2}px ${shadow * 1}px rgb(var(--red));
      //   return `
      //     transform: translateX(${px}px);
      //   `;
      // }
      css(t, u) {
        return `transform: translateX(${u * -0.27}turn); opacity: ${t};`;
      }
    };
  }, {}).start();

  setTimeout(() => {
    elem.style.visibility = "hidden";
    elem.innerText = "";
  }, 800);

  soundService.play("attack");
};

export {shake};
