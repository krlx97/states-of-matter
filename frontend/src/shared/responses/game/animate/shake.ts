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

  create_in_transition(elem, (node) => {
    return {
      duration: 700,
      css (t, u) {
        let num, shadow
        if (t < 0.1) {
          num = 1;
          shadow = 2;
        } else if (t < 0.2) {
          num = -2;
          shadow = 4;
        } else if (t < 0.3) {
          num = 3;
          shadow = 5;
        } else if (t < 0.4) {
          num = -4
          shadow = 8;
        } else if (t < 0.5) {
          num = 5;
          shadow = 10;
        } else if (t < 0.6) {
          num = -4
          shadow = 8;
        } else if (t < 0.7) {
          num = 3
          shadow = 6;
        } else if (t < 0.8) {
          num = -2
          shadow = 4;
        } else if (t < 0.9) {
          num = 1
          shadow = 2;
        } else if (t <= 1) {
          num = 0;
          shadow = 0;
        }

        return `
          box-shadow: 0 0 ${shadow * 2}px ${shadow * 1}px rgb(var(--red));
          transform: translateX(${num * 1.5}px);
        `;
      }
    };
  }, {}).start();

  setTimeout(() => {
    elem.style.visibility = "hidden";
    elem.innerText = "";
  }, 700);

  soundService.play("attack");
};

export {shake};
