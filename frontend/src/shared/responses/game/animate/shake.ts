import {get} from "svelte/store";
import {soundService} from "services";
import {isAnimating, nodeStore, playerStore} from "stores";

const shake = (animation: any): void => {
  isAnimating.set(true);

  const {damageTaken, field, name} = animation;
  const nodes = get(nodeStore);
  const $player = get(playerStore);
  const elemId = `${field}Damage`;
  let elem: HTMLElement;
  let fieldElem: HTMLElement;

  if (name === $player.name) {
    fieldElem = nodes.player[field];
    elem = nodes.player[elemId];
  } else {
    fieldElem = nodes.opponent[field];
    elem = nodes.opponent[elemId];
  }

  elem.style.visibility = "visible";

  if (damageTaken !== 0) {
    elem.innerText = `-${damageTaken}`;
  } else {
    elem.innerText = "";
  }

  const start = performance.now();
  const duration = 666;

  const vibrate = (t: number): void => {
    const elapsed = t - start;
    const progress = Math.min(elapsed / duration, 1);
    const translation = Math.sin(progress * Math.PI) * 10;

    if (Math.floor(progress * 100) % 2 === 0) {
      fieldElem.style.transform = `translateX(${translation}px)`;
    } else {
      fieldElem.style.transform = `translateX(-${translation}px)`;
    }

    if (progress < 1) {
      requestAnimationFrame(vibrate);
    } else {
      fieldElem.style.transform = "translateX(0)";
      elem.style.visibility = "hidden";
      isAnimating.set(false);
nodeStore.update((store) => {
    store.lineCss = "";
    store.showLine = false;

    return store;
  });
    }
  }

  if (field === "hero") {
    soundService.play("directAttack");
  } else {
    soundService.play("attack");
  }

  requestAnimationFrame(vibrate);
};

export {shake};
