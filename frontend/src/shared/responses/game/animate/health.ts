import {get} from "svelte/store";
import {soundService} from "services";
import {gameStore, isAnimating, playerStore} from "stores";

import type {
  Field,
  GameHeroCard,
  GameMinionCard
} from "@som/shared/types/mongo";

const health = (animation: any): void => {
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
      let minion: GameMinionCard | GameHeroCard | undefined;

      if (name === $player.name) {
        minion = store.player.field[field as Field];
      } else {
        minion = store.opponent.field[field as Field];
      }

      if (!minion) {
        return store;
      }

      if (start === undefined) {
        start = minion.health.current;
      }

      if (end === undefined) {
        end = increment ?
          minion.health.current + increment :
          minion.health.current - decrement;
      }

      const current = Math.floor(progress * (end - start) + start);

      if (minion.health.current !== current) {
        minion.health.current = current;
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

export {health};
