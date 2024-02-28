import {get} from "svelte/store";
import {soundService} from "services";
import {gameStore, isAnimating, playerStore} from "stores";
import type {GameMinionCard, MinionField} from "@som/shared/types/mongo";

const damage = (animation: any): void => {
  isAnimating.set(true);

  const $player = get(playerStore);
  const {increment, decrement, field, name} = animation;

  let startTimestamp: number;
  let start: number;
  let end: number;

  const attributeAnimation = (timestamp: number): void => {
    if (startTimestamp === undefined) {
      startTimestamp = timestamp;
    }

    const progress = Math.min((timestamp - startTimestamp) / 666, 1);

    gameStore.update((store) => {
      let minion: GameMinionCard | undefined;

      if (name === $player.name) {
        minion = store.player.field[field as MinionField];
      } else {
        minion = store.opponent.field[field as MinionField];
      }

      if (!minion) {
        return store;
      }

      if (start === undefined) {
        start = minion.damage.current;
      }

      if (end === undefined) {
        end = increment ?
          minion.damage.current + increment :
          minion.damage.current - decrement;
      }

      const current = Math.floor(progress * (end - start) + start);

      if (minion.damage.current !== current) {
        minion.damage.current = current;
      }

      return store;
    });

    if (progress < 1) {
      requestAnimationFrame(attributeAnimation);
    } else {
      isAnimating.set(false);
    }
  };

  soundService.play("attributeChange");
  requestAnimationFrame(attributeAnimation);
};

export {damage};
