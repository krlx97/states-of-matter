import {socketService} from "services";
import { gameStore, nodeStore, playerStore } from "stores";
import { create_in_transition } from "svelte/internal";
import { get } from "svelte/store";

function animateNumber (start, end, xd, wtf) {
  const duration = 500;
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) {
      startTimestamp = timestamp;
    }

    const progress = Math.min((timestamp - startTimestamp) / duration, 1);

    gameStore.update((store) => {
      let minion;

      if (wtf === 0) {
        minion = store.player.minion[xd];
      } else {
        minion = store.opponent.minion[xd];
      }
      // const minion = store.player.minion[xd];
      minion.health = Math.floor(progress * (end - start) + start);
      return store;
    });

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };

  window.requestAnimationFrame(step);
}

const animateShake = (elem: any) => {
  create_in_transition(elem, (node) => {
    return {
      duration: 500,
      css (t, u) {
        let num, shadow
        if (t < 0.1) {
          num = 1;
          shadow = 2;
        } else if (t < 0.2) {
          num = -2;
          shadow = 4;
        } else if (t < 0.3) {
          num = 3;
          shadow = 5;
        } else if (t < 0.4) {
          num = -4
          shadow = 8;
        } else if (t < 0.5) {
          num = 5;
          shadow = 10;
        } else if (t < 0.6) {
          num = -4
          shadow = 8;
        } else if (t < 0.7) {
          num = 3
          shadow = 6;
        } else if (t < 0.8) {
          num = -2
          shadow = 4;
        } else if (t < 0.9) {
          num = 1
          shadow = 2;
        } else if (t <= 1) {
          num = 0;
          shadow = 0;
        }

        return `
          box-shadow: 0 0 ${shadow * 2}px ${shadow * 1}px rgb(var(--red));
          transform: translateX(${num * 1.5}px);
        `;
      }
    };
  }, {}).start();
};

const animateMoveToGraveyard = (elem: any, graveRect, cardRect, direction) => {
  create_in_transition(elem, (node) => {
    return {
      duration: 1000,
      css (t, u) {
        if (direction === 0) {
          return `
            transform: translateX(${t * (graveRect.right - cardRect.right)}px);
          `;
        } else {
          return `
            transform: translateX(-${t * (cardRect.left - graveRect.left)}px);
          `;
        }
      }
    };
  }, {}).start()
};

const attackMinionSave = (): void => {
  socketService.socket.on("attackMinionSave" as any, (params): void => {
    const nodes = get(nodeStore);
    const playa = get(playerStore);

    const {
      username,
      attacker,
      attacked,
      attackerDamage,
      attackedDamage
    } = params;

    if (playa.name === username) { // sender
      nodes.player[`${attacker}Damage`].style.visibility = "visible";
      nodes.player[`${attacker}Damage`].innerText = `-${attackedDamage}`;
      nodes.opponent[`${attacked}Damage`].style.visibility = "visible";
      nodes.opponent[`${attacked}Damage`].innerText = `-${attackerDamage}`;

      animateShake(nodes.player[`${attacker}Damage`]);
      animateShake(nodes.opponent[`${attacked}Damage`]);

      setTimeout(() => {
        nodes.player[`${attacker}Damage`].style.visibility = "hidden";
        const minion = get(gameStore).player.minion[attacker];
        animateNumber(minion.health, minion.health - attackedDamage, attacker, 0);

        setTimeout(() => {
          nodes.opponent[`${attacked}Damage`].style.visibility = "hidden";
          const minionO = get(gameStore).opponent.minion[attacked];
          animateNumber(minionO.health, minionO.health - attackerDamage, attacked, 1);

          setTimeout(() => {
            if (minion.health <= 0) {
              const graveRect = nodes.player.graveyard.getBoundingClientRect();
              const cardRect = nodes.player[attacker].getBoundingClientRect();
              animateMoveToGraveyard(nodes.player[attacker], graveRect, cardRect, 1);
            }

            if (minionO.health <= 0) {
              const graveRect = nodes.opponent.graveyard.getBoundingClientRect();
              const cardRect = nodes.opponent[attacked].getBoundingClientRect();
              animateMoveToGraveyard(nodes.opponent[attacked], graveRect, cardRect, 0);
            }
            setTimeout(() => {
              gameStore.set(params.game);
            }, 1000);
          }, 1000);
        }, 500);
      }, 500);
    } else { // receiver
      nodes.player[`${attacked}Damage`].style.visibility = "visible";
      nodes.player[`${attacked}Damage`].innerText = `-${attackerDamage}`;
      nodes.opponent[`${attacker}Damage`].style.visibility = "visible";
      nodes.opponent[`${attacker}Damage`].innerText = `-${attackedDamage}`;

      animateShake(nodes.player[`${attacked}Damage`]);
      animateShake(nodes.opponent[`${attacker}Damage`]);

      setTimeout(() => {
        nodes.player[`${attacked}Damage`].style.visibility = "hidden";
        const minion = get(gameStore).player.minion[attacked];
        animateNumber(minion.health, minion.health - attackerDamage, attacked, 0);

        setTimeout(() => {
          nodes.opponent[`${attacker}Damage`].style.visibility = "hidden";
          const minionO = get(gameStore).opponent.minion[attacker];
          animateNumber(minionO.health, minionO.health - attackedDamage, attacker, 1);

          setTimeout(() => {
            if (minion.health <= 0) {
              const graveRect = nodes.player.graveyard.getBoundingClientRect();
              const cardRect = nodes.player[attacked].getBoundingClientRect();
              animateMoveToGraveyard(nodes.player[attacked], graveRect, cardRect, 1);
            }

            if (minionO.health <= 0) {
              const graveRect = nodes.opponent.graveyard.getBoundingClientRect();
              const cardRect = nodes.opponent[attacker].getBoundingClientRect();
              animateMoveToGraveyard(nodes.opponent[attacker], graveRect, cardRect, 0);
            }
            setTimeout(() => {
              gameStore.set(params.game);
            }, 1000);
          }, 1000);
        }, 500);
      }, 500);
    }
  });
};

export {attackMinionSave};
