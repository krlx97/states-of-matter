import {socketService} from "services";
import {animationsQueue, gameStore, intervals, intervalsStore, isAnimating, nodeStore, playerStore, selectedCardStore} from "stores";
import {animate} from "./animate";
import { get } from "svelte/store";
import type {Field, MinionField} from "@som/shared/types/mongo";

let i = 0;
const TURN_DURATION_MS = 90000;
const animationDuration = 1500;
let latestGameState: any;

function updateConnectingLine(attackerField: Field, defenderField: Field) {
  let transform: string, height: string, x: number;

  // 55 deg possibilities
  if (attackerField === "a" && defenderField === "a") {
    x = 0;
    transform = "translate(0px, 52px) rotate(55deg)";
    height = "780px";
  } else if (attackerField === "d" && defenderField === "d") {
    x = 0;
    transform = "translate(0px, 52px) rotate(305deg)";
    height = "780px";
  } // 45 deg possibilities
  else if (attackerField === "a" && defenderField === "b") {
    x = -82;
    transform = "translate(-82px, 116px) rotate(47deg)";
    height = "662px";
  } else if (attackerField === "c" && defenderField === "d") {
    x = -76;
    transform = "translate(-76px, 116px) rotate(313deg)";
    height = "662px";
  } else if (attackerField === "b" && defenderField === "a") {
    x = 87;
    transform = "translate(87px, 116px) rotate(47deg)";
    height = "662px";
  } else if (attackerField === "d" && defenderField === "c") {
    x = 87;
    transform = "translate(87px, 116px) rotate(313deg)";
    height = "662px";
  } // 35 deg possibilities
  else if (attackerField === "a" && defenderField === "hero") {
    x = -162;
    transform = "translate(-162px, 167px) rotate(35deg)";
    height = "554px";
  } else if (attackerField === "b" && defenderField === "b") {
    x = 2;
    transform = "translate(2px, 167px) rotate(35deg)";
    height = "554px";
  } else if (attackerField === "c" && defenderField === "c") {
    x = 2;
    transform = "translate(2px, 167px) rotate(324deg)";
    height = "554px";
  } else if (attackerField === "d" && defenderField === "hero") {
    x = 164;
    transform = "translate(164px, 167px) rotate(324deg)";
    height = "554px";
  }
  // 19 deg possibilities
  else if (attackerField === "a" && defenderField === "c") {
    x = -242;
    transform = "translate(-242px, 202px) rotate(19deg)";
    height = "476px";
  } else if (attackerField === "d" && defenderField === "b") {
    x = 244;
    transform = "translate(244px, 202px) rotate(339deg)";
    height = "476px";
  } else if (attackerField === "b" && defenderField === "hero") {
    x = -83;
    transform = "translate(-83px, 202px) rotate(19deg)";
    height = "476px";
  } else if (attackerField === "c" && defenderField === "hero") {
    x = 78;
    transform = "translate(78px, 202px) rotate(339deg)";
    height = "476px";
  } else if (attackerField === "c" && defenderField === "a") {
    x = 242;
    transform = "translate(242px, 202px) rotate(19deg)";
    height = "476px";
  } else if (attackerField === "b" && defenderField === "d") {
    x = -242;
    transform = "translate(-242px, 202px) rotate(339deg)";
    height = "476px";
  }
  // 0 deg possibilities
  else if (attackerField === "a" && defenderField === "d") {
    x = -323;
    transform = "translate(-323px, 218px) rotate(0deg)";
    height = "454px";
  } else if (attackerField === "b" && defenderField === "c") {
    x = -162;
    transform = "translate(-162px, 218px) rotate(0deg)";
    height = "454px";
  } else if (attackerField === "c" && defenderField === "b") {
    x = 162;
    transform = "translate(162px, 218px) rotate(0deg)";
    height = "454px";
  } else if (attackerField === "d" && defenderField === "a") {
    x = 324;
    transform = "translate(324px, 218px) rotate(0deg)";
    height = "454px";
  }

  nodeStore.update((store) => {
    store.lineX = x;
    store.lineCss = `transform: ${transform}; height: ${height}`;
    store.showLine = true;
    return store;
  });

  setTimeout(() => {
    nodeStore.update((store) => {
      store.showLine = false;
      return store;
    });
  }, 600);

  // line.style.transform = transform;
  // line.style.height = height;
}

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
    if (get(playerStore).name === animation.playerA) {
      updateConnectingLine(animation.playerAField, animation.playerBField);
    } else {
      updateConnectingLine(animation.playerBField, animation.playerAField);
    }
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
