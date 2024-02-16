import type { GameMinionCard } from "@som/shared/types/mongo";
import { soundService } from "services";
import { gameStore, playerStore } from "stores";
import { get } from "svelte/store";

const manaCapacity = (animation: any): void => {
  let startTimestamp: number;
  let start: number | undefined;
  let end: number | undefined;
  const player = get(playerStore);
  const {type, increment, field, name} = animation;

  setTimeout(() => {
    const step = (timestamp: number): void => {
      if (!startTimestamp) {
        startTimestamp = timestamp;
      }

      const progress = Math.min((timestamp - startTimestamp) / 400, 1);

      gameStore.update((store) => {
        let minion;

        if (name === player.name) {
          minion = store.player.field.hero;
        } else {
          minion = store.opponent.field.hero;
        }

        if (start === undefined && end === undefined) { // can be 0, so check for === undefined
          start = minion.mana.current;
          end = increment > 0 ? minion.mana.current - increment : minion.mana.current + increment;
        }

        const newCurrentManaCapacity = Math.floor(progress * (end - start) + start);

        if (minion.mana.current !== newCurrentManaCapacity) {
          minion.mana.current = newCurrentManaCapacity;
        }

        return store;
      });

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
    soundService.play("attributeChange");
  }, 400);
};

export {manaCapacity};