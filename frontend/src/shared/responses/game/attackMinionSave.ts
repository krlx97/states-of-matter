import {socketService} from "services";
import {animationsQueue, gameStore, intervals, intervalsStore, isAnimating, nodeStore, playerStore, selectedCardStore} from "stores";
import {animate} from "./animate";
import { get } from "svelte/store";

let i = 0;
const TURN_DURATION_MS = 90000;
const animationDuration = 1500;
let latestGameState: any;

const animy = (animation: any) => {
  let {type} = animation;

  if (type === "DAMAGE") {
    isAnimating.set(true);
    animate.damage(animation);
    setTimeout(() => {isAnimating.set(false);}, 600);
  } else if (type === "HEALTH") {
    isAnimating.set(true);
    animate.health(animation);
    setTimeout(() => {isAnimating.set(false);}, 600);
  } else if (type === "MANA_CAPACITY") {
    isAnimating.set(true);
    animate.manaCapacity(animation);
    setTimeout(() => {isAnimating.set(false);}, 600);
  } else if (type === "DEATH") {
    isAnimating.set(true);
    animate.death(animation);
    setTimeout(() => {isAnimating.set(false);}, 900);
  } else if (type === "FLOATING_TEXT") {
    isAnimating.set(true);
    animate.floatingText(animation);
    setTimeout(() => {isAnimating.set(false);}, 900);
  } else if (type === "SUMMON") {
    isAnimating.set(true);
    animate.summon(animation);
    setTimeout(() => {isAnimating.set(false);}, 300);
  } else if (type === "TRAP") {
    isAnimating.set(true);
    animate.trap(animation);
    setTimeout(() => {isAnimating.set(false);}, 3000);
  } else if (type === "MAGIC") {
    isAnimating.set(true);
    animate.magic(animation);
    setTimeout(() => {isAnimating.set(false);}, 3000);
  } else if (type === "SHAKE") {
    isAnimating.set(true);
    animate.shake({damageTaken: animation.playerANumber, field: animation.playerAField, name: animation.playerA});
    animate.shake({damageTaken: animation.playerBNumber, field: animation.playerBField, name: animation.playerB});
    setTimeout(() => {isAnimating.set(false);}, 600);
  } else if (type === "TRAP_SET") {
    isAnimating.set(true);
    animate.trapset(animation);
    setTimeout(() => {isAnimating.set(false);}, 3000);
  } else if (type === "END_TURN") {
    isAnimating.set(true);
    animate.endTurn(animation);
    setTimeout(() => {isAnimating.set(false);}, 1200);
  }
};

const attackMinionSave = (): void => {
  socketService.socket.on("attackMinionSave", async (params): Promise<void> => {
    const {game, animations, isEndTurn} = params;
    const {endTurnTime} = game;

    latestGameState = game;

    if (isEndTurn) {
      selectedCardStore.update((store) => {
        store.field = undefined;
        store.graveyard = undefined;
        store.hand = undefined;
        return store;
      });

      clearInterval(intervals[0]);

      intervals[0] = setInterval(() => {
        const time = Date.now();
        let rem = endTurnTime - time;
        let x = (rem / TURN_DURATION_MS) * 100;

        if (time <= endTurnTime) {
          nodeStore.update((store) => {
            store.barHeight = `${x}%`;
            return store;
          });
        }
      }, 1000 / 60);
    }

    animationsQueue.update((store) => {
      store.push(...animations);
      return store;
    });

    if (!intervals[1]) {
      intervals[1] = setInterval(() => {
        if (get(isAnimating)) { return; }

        let $animationsQueue = get(animationsQueue);

        animy($animationsQueue[i]);

        i += 1;

        if (i >= $animationsQueue.length) {
          i = 0;
          animationsQueue.set([]);
          // get rid of this? animations could change game state, and some
          // already do... just make sure theres no desync
          isAnimating.set(false);
          setTimeout(() => {
            gameStore.set(latestGameState);
            latestGameState = undefined;
          }, 1000);
          clearInterval(intervals[1]);
          intervals[1] = undefined;
        }
      }, 100);
    }
  });
};

export {attackMinionSave};
