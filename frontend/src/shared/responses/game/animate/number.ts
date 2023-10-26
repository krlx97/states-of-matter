import {get} from "svelte/store";
import {soundService} from "services";
import {gameStore, nodeStore, playerStore} from "stores";
import type {GameMinionCard} from "@som/shared/types/backend/game";
import {create_in_transition} from "svelte/internal";

const number = (animation: any): void => {
  const duration = 700;
  let startTimestamp: number;
  let start: number | undefined;
  let end: number | undefined;
  const player = get(playerStore);
  const {damageTaken, field, name} = animation;




  const nodes = get(nodeStore);
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
    const step = (timestamp: number): void => {
      if (!startTimestamp) {
        startTimestamp = timestamp;
      }

      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      gameStore.update((store) => {
        let minion: GameMinionCard;

        if (name === player.name) {
          minion = store.player.minion[field];
        } else {
          minion = store.opponent.minion[field];
        }

        if (start === undefined && end === undefined) { // can be 0, so check for === undefined
          start = minion.health;
          end = minion.health - damageTaken;
        }

        minion.health = Math.floor(progress * (end - start) + start);

        return store;
      });

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
    soundService.play("lifeDeduct");
  }, 700);

  soundService.play("attack");
};

export {number};
