<script lang="ts">
  import {onMount} from "svelte";
  import {create_in_transition} from "svelte/internal";
  import {cards} from "@som/shared/data";
  import {cardEffectNames} from "data";
  import {socketService} from "services";
  import {floatingTextStore, gameStore, nodeStore, playerStore, selectedCardStore} from "stores";
  import {CardComponent} from "ui";
  import FloatingText from "../FloatingText.svelte";

  export let field: "a" | "b" | "c" | "d";

  $: minion = $gameStore.opponent.minion[field];
  $: isAttackable = $selectedCardStore.field && minion !== undefined;

  let cardElement: HTMLDivElement;
  let damageDealtElement: HTMLDivElement;
  let fieldElement: HTMLDivElement;

  const getCard = (): any => {
    const {gid} = minion;
    const card = cards.find((card) => card.id === minion.id);

    return {...card, gid};
  };

  const onAttackCard = (): void => {
    if ($gameStore.currentPlayer !== $playerStore.name) { return; }
    if (!$selectedCardStore.field) { return; }

    const attacked = field;
    const attacker = $selectedCardStore.field;

    $selectedCardStore.field = undefined;

    socketService.socket.emit("attackMinion", {attacked, attacker});
  };

const {socket} = socketService;

function animateValue(start, end) {
  const duration = 1000;
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    minion.health = Math.floor(progress * (end - start) + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

  onMount((): void => {
$nodeStore.opponent[field] = fieldElement;
$nodeStore.opponent[`${field}Damage`] = damageDealtElement;

    // socket.on("attackMinionSave2" as any, (params) => {
    //   $selectedCardStore.field = undefined;

    //   if (field === params.opponentField) {
    //     const {
    //       playerField,
    //       opponentField,
    //       playerDamageTaken,
    //       opponentDamageTaken
    //     } = params;

    //     const animation = create_in_transition(fieldElement, (node) => {
    //       return {
    //         duration: 500,
    //         css (t, u) {
    //           let num, shadow
    //           if (t < 0.1) {
    //             num = 1;
    //             shadow = 2;
    //           } else if (t < 0.2) {
    //             num = -2;
    //             shadow = 4;
    //           } else if (t < 0.3) {
    //             num = 3;
    //             shadow = 5;
    //           } else if (t < 0.4) {
    //             num = -4
    //             shadow = 8;
    //           } else if (t < 0.5) {
    //             num = 5;
    //             shadow = 10;
    //           } else if (t < 0.6) {
    //             num = -4
    //             shadow = 8;
    //           } else if (t < 0.7) {
    //             num = 3
    //             shadow = 6;
    //           } else if (t < 0.8) {
    //             num = -2
    //             shadow = 4;
    //           } else if (t < 0.9) {
    //             num = 1
    //             shadow = 2;
    //           } else if (t <= 1) {
    //             num = 0;
    //             shadow = 0;
    //           }

    //           return `
    //             box-shadow: 0 0 ${shadow * 2}px ${shadow * 1}px rgb(var(--red));
    //             transform: translateX(${num * 2}px);
    //           `;
    //         }
    //       };
    //     }, {});

    //     animation.start();

    //     setTimeout(() => {
    //       damageDealtElement.style.visibility = "hidden";
    //       animateValue(minion.health, minion.health - opponentDamageTaken);

    //       setTimeout(() => {
    //         if (minion.health <= 0) {
    //           // console.log(`MOVING OPPONENT ${minion.id} TO GRAVEYARD!`);
    //           const graveRect = $nodeStore.opponent.graveyard.getBoundingClientRect();
    //           const cardRect = cardElement.getBoundingClientRect();

    //           const animation = create_in_transition(cardElement, (node) => {
    //             return {
    //               duration: 500,
    //               css (t, u) {
    //                 // console.log(t)
    //                 return `
    //                   transform: translateX(-${t * (cardRect.left - graveRect.left)}px);
    //                 `;
    //               }
    //             };
    //           }, {});

    //           // console.log("ANIMATION STARTED");
    //           animation.start();
    //           // setTimeout(() => {gameStore.set(params.game);}, 5000);
    //         }
    //       }, 1000);
    //     }, 500);

    //     damageDealtElement.style.visibility = "visible";
    //     damageDealtElement.innerText = `-${opponentDamageTaken}`;
    //   }

    // });
  });
</script>

<style>
  .field {
    position: relative;
    height: var(--card-height);
    width: var(--card-width);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: not-allowed;
    transition: transform 225ms ease-in-out;

    background: linear-gradient(90deg, rgba(31,31,31,0.2) 0%, rgba(121,108,254,0.2) 50%, rgba(31,31,31,0.2) 100%);
    border: 2px solid rgb(96, 133, 29);
    border-radius: 8px;
    backdrop-filter: blur(2px);

  }

  .buffs {
    position: absolute;
    top: -24px;
    left: 0;
    width: 100%;
    text-align: center;
  }

  .buff {color: rgb(var(--green));}
  .debuff {color: rgb(var(--red));}

  .isHovered {
    transform: translateY(-8px);
  }

   .isAttackable {
    /* animation: glow2 1s cubic-bezier(var(--ease-in-out-quart)) infinite; */
    position: relative;
    cursor: pointer;
  }
 .isAttackable::after {
    content: "";
    position: absolute;
    border-radius: 8px;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    box-shadow: 0 0 16px 4px rgb(var(--green));
    animation: isAttackableGlow 1s cubic-bezier(var(--ease-in-out-quad)) infinite alternate;
  }

  @keyframes isAttackableGlow {
    from {opacity: 0;}
    to {opacity: 1;}
  }

  .damage-dealt {
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: rgba(31, 31, 31, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    visibility: hidden;
    color: rgb(var(--red));
    font-size: 6rem;
z-index: 5;
  }
.damage-dealt-visible {visibility: visible}
</style>

<!-- find a better way than inline style, when minions move to graveyard
animation z indexes do not work. -->
<div class="field" bind:this={fieldElement} style={field === "a" ? "z-index: 1" : field === "b" ? "z-index: 2" : field === "c" ? "z-index: 3" : "z-index: 4"}>
  {#each $floatingTextStore.opponent[field] as text}
    <FloatingText {text}/>
  {/each}
  {#if minion}
    <div style="z-index: 5;" class:isAttackable on:click={onAttackCard} on:keypress={onAttackCard} bind:this={cardElement}>
      <div class="buffs">
        {#each minion.buffs as buff}
          <div class="buff">{buff.id}</div>
        {/each}
        {#each minion.debuffs as debuff}
          <div class="debuff">{debuff.id}</div>
        {/each}
      </div>
      <CardComponent card={minion} isClient={false} isOpponent/>
    </div>
  {:else}
    <span>Minion Field {field}</span>
  {/if}
  <div class="damage-dealt" bind:this={damageDealtElement}></div>

</div>
