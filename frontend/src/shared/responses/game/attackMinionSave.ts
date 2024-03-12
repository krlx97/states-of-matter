import {socketService} from "services";
import {animationsQueue, gameStore, intervals, isAnimating, nodeStore, playerStore, selectedCardStore} from "stores";
import {animate} from "./animate";
import { get } from "svelte/store";
import type {Field, MinionField} from "@som/shared/types/mongo";

let i = 0;
const TURN_DURATION_MS = 90000;
let latestGameState: any;

const line = (attacker: MinionField, attacked: Field, isPlayer: boolean): void => {
  isAnimating.set(true);

  let height = "0px";
  let rotate = "0deg";
  let translateX = "0";

  const A_A = attacker === "a" && attacked === "a";
  const A_B = attacker === "a" && attacked === "b";
  const A_H = attacker === "a" && attacked === "hero";
  const A_C = attacker === "a" && attacked === "c";
  const A_D = attacker === "a" && attacked === "d";

  const B_A = attacker === "b" && attacked === "a";
  const B_B = attacker === "b" && attacked === "b";
  const B_H = attacker === "b" && attacked === "hero";
  const B_C = attacker === "b" && attacked === "c";
  const B_D = attacker === "b" && attacked === "d";

  const C_A = attacker === "c" && attacked === "a"
  const C_B = attacker === "c" && attacked === "b";
  const C_H = attacker === "c" && attacked === "hero";
  const C_C = attacker === "c" && attacked === "c";
  const C_D = attacker === "c" && attacked === "d";

  const D_A = attacker === "d" && attacked === "a";
  const D_B = attacker === "d" && attacked === "b";
  const D_H = attacker === "d" && attacked === "hero";
  const D_C = attacker === "d" && attacked === "c";
  const D_D = attacker === "d" && attacked === "d";

  if (isPlayer) {
    if (A_D || B_C || C_B || D_A) { // 0 deg
      rotate = "0deg";

      switch (attacker) {
        case "a": translateX = "-324px"; break;
        case "b": translateX = "-162px"; break;
        case "c": translateX = "162px"; break;
        case "d": translateX = "324px"; break;
      }

      height = "454px";
    } else if (A_C || D_B || B_H || C_H || C_A || B_D) { // 19 deg
      if (A_C || B_H || C_A) {
        rotate = "19deg";
      } else {
        rotate = "339deg";
      }

      if (D_B || C_A) {
        translateX = "244px";
      } else if (A_C || B_D) {
        translateX = "-244px";
      } else if (B_H) {
        translateX = "-82px";
      } else {
        translateX = "82px";
      }

      height = "476px";
    } else if (A_H || B_B || C_C || D_H) { // 35 deg
      if (A_H || B_B) {
        rotate = "35deg";
      } else {
        rotate = "324deg";
      }

      switch (attacker) {
        case "a": translateX = "-162px"; break;
        case "b": translateX = "2px"; break;
        case "c": translateX = "2px"; break;
        case "d": translateX = "164px"; break;
      }

      height = "554px";
    } else if (A_B || C_D || B_A || D_C) { // 45 deg
      if (A_B || B_A) {
        rotate = "47deg";
      } else {
        rotate = "313deg";
      }

      switch (attacker) {
        case "a": translateX = "-82px"; break;
        case "b": translateX = "87px"; break;
        case "c": translateX = "-82px"; break;
        case "d": translateX = "87px"; break;
      }

      height = "662px";
    } else if (A_A || D_D) { // 55deg
      if (A_A) {
        rotate = "55deg";
      } else {
        rotate = "305deg";
      }

      translateX = "0";
      height = "780px";
    }

  } else {

    if (A_D || B_C || C_B || D_A) { // 0 deg
      rotate = "0deg";

      switch (attacker) {
        case "a": translateX = "324px"; break;
        case "b": translateX = "162px"; break;
        case "c": translateX = "-162px"; break;
        case "d": translateX = "-324px"; break;
      }

      height = "454px";
    } else if (A_C || D_B || B_H || C_H || C_A || B_D) { // 19 deg
      if (A_C || B_H || C_A) {
        rotate = "-339deg";
      } else {
        rotate = "-19deg";
      }

      if (D_B || C_A) {
        translateX = "-244px";
      } else if (A_C || B_D) {
        translateX = "244px";
      } else if (B_H) {
        translateX = "82px";
      } else {
        translateX = "-82px";
      }

      height = "476px";
    } else if (A_H || B_B || C_C || D_H) { // 35 deg
      if (A_H || B_B) {
        rotate = "-324deg";
      } else {
        rotate = "-35deg";
      }

      switch (attacker) {
        case "a": translateX = "162px"; break;
        case "b": translateX = "-2px"; break;
        case "c": translateX = "-2px"; break;
        case "d": translateX = "-164px"; break;
      }

      height = "554px";
    } else if (A_B || C_D || B_A || D_C) { // 45 deg
      if (A_B || B_A) {
        rotate = "-313deg";
      } else {
        rotate = "-47deg";
      }

      switch (attacker) {
        case "a": translateX = "82px"; break;
        case "b": translateX = "-87px"; break;
        case "c": translateX = "82px"; break;
        case "d": translateX = "-87px"; break;
      }

      height = "662px";
    } else if (A_A || D_D) { // 55deg
      if (A_A) {
        rotate = "-305deg";
      } else {
        rotate = "-55deg";
      }

      translateX = "0";
      height = "780px";
    }
  }

  let transform = `translate(${translateX}, -50%) rotate(${rotate})`;

  function animateWidth() {
    let start = null;
    const duration = 666; // Animation duration in milliseconds

    function step (timestamp) {
      if (!start) start = timestamp;

      const progress = timestamp - start;
      const percentage = Math.min(progress / duration, 1);
      const currentHeight = parseInt(height) * percentage;

      nodeStore.update((store) => {
        store.lineCss = `transform: ${transform}; height: ${currentHeight}px`;
        return store;
      });

      if (progress < duration) {
        requestAnimationFrame(step);
      } else {
          // isAnimating.set(false);
      }
    }

    // Start animation
    requestAnimationFrame(step);
  }

  nodeStore.update((store) => {
    // store.lineCss = `transform: ${transform}; height: ${height}`;
    store.showLine = true;

    return store;
  });

  animateWidth();

  // setTimeout((): void => {
  //   nodeStore.update((store) => {
  //     store.showLine = false;
  //     return store;
  //   });
  // }, 666);
};

const animy = (animation: any) => {
  let {type} = animation;

  if (type === "DAMAGE") {
    animate.damage(animation);
  } else if (type === "HEALTH") {
    animate.health(animation);
  } else if (type === "MANA_CAPACITY") {
    animate.manaCapacity(animation);
  } else if (type === "DEATH") {
    animate.death(animation);
  } else if (type === "FLOATING_TEXT") {
    animate.floatingText(animation);
  } else if (type === "SUMMON") {
    animate.summon(animation);
  } else if (type === "TRAP") {
    animate.trap(animation);
  } else if (type === "MAGIC") {
    animate.magic(animation);
  } else if (type === "SHAKE") {
    const {name} = get(playerStore);

    if (animation.attacker) {
      setTimeout(() => {
        animate.shake({
          damageTaken: animation.attacker.decrement,
          field: animation.attacker.field,
          name: animation.attacker.name
        });
        animate.shake({
          damageTaken: animation.attacked.decrement,
          field: animation.attacked.field,
          name: animation.attacked.name
        });
      }, 676)

      line(
        animation.attacker.field,
        animation.attacked.field,
        animation.attacker.name === name
      );
    } else {
      animate.shake({
        damageTaken: animation.attacked.decrement,
        field: animation.attacked.field,
        name: animation.attacked.name
      });
    }
  } else if (type === "TRAP_SET") {
    animate.trapset(animation);
  } else if (type === "END_TURN") {
    animate.endTurn(animation);
  }
};

const attackMinionSave = (): void => {
  socketService.socket.on("attackMinionSave" as any, (params: any): void => {
    const {game, animations, isEndTurn} = params;

    latestGameState = game;

    if (isEndTurn) {
      selectedCardStore.update((store) => {
        store.field = undefined;
        store.graveyard = undefined;
        store.hand = undefined;
        return store;
      });

      cancelAnimationFrame(intervals[0]);

      const barAnimation: FrameRequestCallback = (): void => {
        const currentTime = Date.now();
        const remaining = game.endTurnTime - currentTime;
        const height = (remaining / TURN_DURATION_MS) * 100;

        nodeStore.update((store) => {
          store.barHeight = `${height}%`;
          return store;
        });

        intervals[0] = requestAnimationFrame(barAnimation);
      };

      intervals[0] = requestAnimationFrame(barAnimation);
    }

    animationsQueue.update((store) => {
      store.push(...animations);
      return store;
    });

    if (!intervals[1]) {
      intervals[1] = setInterval((): void => {
        const $isAnimating = get(isAnimating);

        if ($isAnimating) {
          return;
        }

        const $animationsQueue = get(animationsQueue);

        if ($animationsQueue.length < 1) {
          return;
        }

        if (i >= $animationsQueue.length) {
          if ($isAnimating) {
            return;
          }

          gameStore.set(latestGameState);
          animationsQueue.set([]);

          i = 0;
        } else {
          animy($animationsQueue[i]);
          i += 1;
        }
      }, 10);
    }
  });
};

export {attackMinionSave};
