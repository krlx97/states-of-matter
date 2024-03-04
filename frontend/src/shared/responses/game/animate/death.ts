import {soundService} from "services";
import {get} from "svelte/store";
import {gameStore, isAnimating, nodeStore, playerStore} from "stores";

const death = (animation: any): void => {
  isAnimating.set(true);

  const {field, name} = animation;
  const $node = get(nodeStore);
  const $player = get(playerStore);
  const duration = 1333;

  let graveRect: DOMRect;
  let cardRect: DOMRect;
  let isPlayer: boolean;
  let card: HTMLElement;
  let startTime = performance.now();

  if (name === $player.name) {
    card = $node.player[field];
    graveRect = $node.player.graveyard.getBoundingClientRect();
    cardRect = $node.player[field].getBoundingClientRect();
    isPlayer = true;
  } else {
    card = $node.opponent[field];
    graveRect = $node.opponent.graveyard.getBoundingClientRect();
    cardRect = $node.opponent[field].getBoundingClientRect();
    isPlayer = false;
  }

  const flyToGraveyard = (currentTime: number): void => {
  const elapsed = currentTime - startTime;
  const progress = Math.min(elapsed / duration, 1);

  if (progress <= 0.75) {
    // Movement animation
    if (isPlayer) {
      card.style.transform = `translateX(-${(progress / 0.75) * (cardRect.left - graveRect.left)}px)`;
    } else {
      const distance = graveRect.left - cardRect.left;
      const translationX = (distance / 0.75) * progress;
      card.style.transform = `translateX(${translationX}px)`;
    }
  } else {
    // Fade-out animation
    const fadeStartTime = startTime + (0.75 * duration);
    const fadeElapsed = currentTime - fadeStartTime;
    const fadeProgress = Math.min(fadeElapsed / (0.333 * duration), 1);
    const opacity = 1 - fadeProgress;
    card.style.opacity = opacity.toString();
  }

  if (progress < 1) {
    requestAnimationFrame(flyToGraveyard);
  } else {
    gameStore.update((store) => {
      if (isPlayer) {
        store.player.graveyard.push(store.player.field[field]);
        store.player.field[field] = undefined;
      } else {
        store.opponent.graveyard.push(store.opponent.field[field]);
        store.opponent.field[field] = undefined;
      }

      return store;
    });

    isAnimating.set(false);
  }
};

  soundService.play("death");
  requestAnimationFrame(flyToGraveyard);
};

export {death};
