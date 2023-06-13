<script lang="ts">
  import {CardType} from "@som/shared/enums";
  import {cards} from "@som/shared/data";
  import {socketService, soundService} from "services";
  import {floatingTextStore, gameStore, selectedCardStore, playerStore, nodeStore} from "stores";
  import FloatingText from "../FloatingText.svelte";
  import {CardComponent} from "ui";
  import {cardEffectNames} from "data";
  import {onMount} from "svelte";

  const {socket} = socketService;

  let field: "a" | "b" | "c" | "d";
  let isDamageDealtVisible = false;
  let cardElement: HTMLDivElement;
  let damageDealtElement: HTMLDivElement;
  let fieldElement: HTMLDivElement;

  $: isSelected = $selectedCardStore.field === field;
  $: isSummonable =
    $selectedCardStore.hand &&
    $selectedCardStore.hand.gid &&
    $selectedCardStore.hand.type === CardType.MINION &&
    !$gameStore.player.minion[field];
  $: isCurrentPlayer = $gameStore.currentPlayer === $playerStore.name;
  $: minion = $gameStore.player.minion[field];

  const onPlayCard = (): void => {
    if (!isCurrentPlayer) { return; }
    if (!$selectedCardStore.hand.gid) { return; }
    if ($selectedCardStore.hand.type !== CardType.MINION) { return; }

    if ($selectedCardStore.field !== undefined) {
      $selectedCardStore.field = undefined;
    }

    const {gid} = $selectedCardStore.hand;

    socket.emit("playMinion", {field, gid});
    soundService.play("summon");

    $selectedCardStore.hand = undefined;
  };

  const onAttackSelect = (): void => {
    if (!isCurrentPlayer) {
      return;
    }

    if ($selectedCardStore.hand) {
      $selectedCardStore.hand = undefined;
    }

    if ($selectedCardStore.field === field) {
      $selectedCardStore.field = undefined;
    } else {
      $selectedCardStore.field = field;
    }
  };

  onMount((): void => {
    $nodeStore.player[field] = fieldElement;
    $nodeStore.player[`${field}Damage`] = damageDealtElement;
  });

  export {field};
</script>

<style>
  .field {
    position: relative;
height: var(--card-height);
    width: var(--card-width);
    cursor: not-allowed;
    background: linear-gradient(
      90deg,
      rgba(31, 31, 31, 0.25) 0%,
      rgba(121, 108, 254, 0.5) 50%,
      rgba(31, 31, 31, 0.25) 100%
    );
    border: 2px solid rgb(96, 133, 29);
    border-radius: 8px;
    backdrop-filter: blur(2px);
  }

  .buffs-icon {
    position: absolute;
    top: -24px;
    left: 50%;
    height: 24px;
    width: 24px;
    transform: translateX(-50%);
    background-color: rgb(47, 47, 47);
    border-radius: 50%;
  }

  .buffs {
    position: absolute;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    width: 144px;
    text-align: center;
    display: none;
    background-color: rgb(47, 47, 47);
    border-radius: 8px;
    line-height: 1.4;
  }

  .buffs-icon:hover .buffs {
    display: initial;
  }

  .buff {color: rgb(var(--green));}
  .debuff {color: rgb(var(--red));}

  /* .isSelected {
    box-shadow: 0 0 0 4px white;
  } */

  .isSummonable {
    /* animation: glow2 1s cubic-bezier(var(--ease-in-out-quart)) infinite; */
    position: relative;
    cursor: pointer;
  }

  /* @keyframes glow2 {
    0% {
      box-shadow: 0 0 8px 4px rgba(var(--orange), 0);
    } 50% {
      box-shadow: 0 0 8px 4px rgba(var(--orange), 1);
    } 100% {
      box-shadow: 0 0 8px 4px rgba(var(--orange), 0);
    }
  } */
  .isSummonable::after {
    content: "";
    position: absolute;
    border-radius: 8px;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    box-shadow: 0 0 16px 4px rgb(var(--green));
    animation: isSummonableGlow 1s cubic-bezier(var(--ease-in-out-quad)) infinite alternate;
  }

  @keyframes isSummonableGlow {
    from {opacity: 0;}
    to {opacity: 1;}
  }

  .damage-dealt {
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(31, 31, 31, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    color: rgb(var(--red));
    font-size: 128px;
    visibility: hidden;
    z-index: 5;
  }

  .field-empty {
    /* height: var(--card-height);
    width: var(--card-width);
    display: flex;
    align-items: center;
    justify-content: center; */
    position: absolute;
    bottom: -18px;
    left: 50%;
    /* padding: var(--spacing-xsm); */
    /* height: 32px; */
    transform: translateX(-50%);
    background-color: rgba(31, 31, 31, 0.8);
    text-transform: uppercase;
    /* width: 100%; */
/* display: flex;
    align-items: center;
    justify-content: center; */
  }

.wtfff {
  border-radius: 8px;
}
</style>

<div class="field" bind:this={fieldElement}>
  {#each $floatingTextStore.player[field] as text}
    <FloatingText {text}/>
  {/each}
  {#if minion}
    <div class="wtfff" class:isSelected on:click={onAttackSelect} on:keypress={onAttackSelect} bind:this={cardElement}>
      <div class="buffs">
        {#each minion.buffs as buff}
          <div class="buff">{buff.id}</div>
        {/each}
        {#each minion.debuffs as debuff}
          <div class="debuff">{debuff.id}</div>
        {/each}
      </div>
      <CardComponent card={minion} isClient={false}/>
    </div>
  <!-- {:else} -->
  {/if}
    <div class="field-empty" class:isSummonable on:click={onPlayCard} on:keypress={onPlayCard}>
      {field}
    </div>
  <div class="damage-dealt" bind:this={damageDealtElement}>3</div>
</div>
