import type { GameMinionCard } from "@som/shared/types/mongo";
import { soundService } from "services";
import { gameStore, playerStore } from "stores";
import { get } from "svelte/store";

const health = (animation: any): void => {
  let startTimestamp: number;
  let start: number | undefined;
  let end: number | undefined;
  const player = get(playerStore);
  const {increment, decrement, field, name} = animation;

  // setTimeout(() => {
    const step = (timestamp: number): void => {
      if (!startTimestamp) {
        startTimestamp = timestamp;
      }

      const progress = Math.min((timestamp - startTimestamp) / 600, 1);

      gameStore.update((store) => {
        let minion: GameMinionCard;

        if (name === player.name) {
          minion = store.player.field[field];
        } else {
          minion = store.opponent.field[field];
        }

        if (start === undefined && end === undefined) { // can be 0, so check for === undefined
          start = minion.health.current;
          if (increment && !decrement) {
            end = minion.health.current + increment;
          } else if (!increment && decrement) {
            end = minion.health.current - decrement;
          }
        }

        const newCurrentHealth = Math.floor(progress * (end - start) + start);

        if (minion.health.current !== newCurrentHealth) {
          minion.health.current = newCurrentHealth;
        }

        return store;
      });

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
    soundService.play("attributeChange");
  // }, 400);
};

export {health};
