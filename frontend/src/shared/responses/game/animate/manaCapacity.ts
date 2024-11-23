import {get} from "svelte/store";
import {soundService} from "services";
import {gameStore, isAnimating, playerStore} from "stores";
import type {GameHeroCard} from "@som/shared/types/mongo";

const manaCapacity = (animation: any): void => {
  isAnimating.set(true);

  const $player = get(playerStore);
  const {increment, decrement, name} = animation;

  let startTimestamp: number;
  let start: number;
  let end: number;

  if (increment !== undefined && increment === 0) {
    isAnimating.set(false);
    return;
  }

  if (decrement !== undefined && decrement === 0) {
    isAnimating.set(false);
    return;
  }

  const attributeAnimation = (timestamp: number): void => {
    if (startTimestamp === undefined) {
      startTimestamp = timestamp;
    }

    const progress = Math.min((timestamp - startTimestamp) / 666, 1);

    gameStore.update((store) => {
      let minion: GameHeroCard;

      if (name === $player.name) {
        minion = store.player.field.hero;
      } else {
        minion = store.opponent.field.hero;
      }

      if (start === undefined) {
        start = minion.mana.current;
      }

      if (end === undefined) {
        end = increment ?
          minion.mana.current + increment :
          minion.mana.current - decrement;
      }

      const current = Math.floor(progress * (end - start) + start);

      if (minion.mana.current !== current) {
        minion.mana.current = current;
      }

      return store;
    });

    if (progress < 1) {
      requestAnimationFrame(attributeAnimation);
    } else {
      isAnimating.set(false);
    }
  };

  requestAnimationFrame(attributeAnimation);
  soundService.play("attributeChange");
};

export {manaCapacity};
