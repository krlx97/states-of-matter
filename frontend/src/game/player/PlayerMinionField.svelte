<script lang="ts">
  import {CardId, CardType} from "@som/shared/enums";
  import {cards} from "@som/shared/data";
  import {socketService, soundService} from "services";
  import {floatingTextStore, gameStore, selectedCardStore, playerStore, nodeStore} from "stores";
  import FloatingText from "../FloatingText.svelte";
  import {CardComponent} from "ui";
  import {onMount} from "svelte";
    import { scale } from "svelte/transition";

  const {socket} = socketService;

  let field: "a" | "b" | "c" | "d";
  let damageDealtElement: HTMLDivElement;
  let fieldElement: HTMLDivElement;

  $: isSelected = $selectedCardStore.field === field;

  $: isSummonable = (
    $selectedCardStore.hand &&
    $selectedCardStore.hand.gid &&
    $selectedCardStore.hand.type === CardType.MINION &&
    !$gameStore.player.field[field] ) || (
    $selectedCardStore.hand && $selectedCardStore.hand.id === CardId.GRAVECALL &&
    $selectedCardStore.graveyard && $selectedCardStore.graveyard.type === CardType.MINION);

  $: isTargetable = $selectedCardStore.hand &&
    $selectedCardStore.hand.id === CardId.QUICK_SAND;

  $: isCurrentPlayer = $gameStore.currentPlayer === $playerStore.name;
  $: minion = $gameStore.player.field[field];

  const onPlayCard = (): void => {
    if (!isCurrentPlayer) { return; }
    if (!$selectedCardStore.hand.gid) { return; }
    // if ($selectedCardStore.hand.type !== CardType.MINION) { return; }

    if ($selectedCardStore.field !== undefined) {
      $selectedCardStore.field = undefined;
    }

    if (
      $selectedCardStore.hand &&
      $selectedCardStore.hand.id === CardId.GRAVECALL &&
      $selectedCardStore.graveyard &&
      $selectedCardStore.graveyard.type === CardType.MINION
    ) {
      socket.emit("playMagic", {
        gid: $selectedCardStore.hand.gid,
        field,
        target: $selectedCardStore.graveyard.gid
      });
    } else {
      const {gid} = $selectedCardStore.hand;
      socket.emit("playMinion", {field, gid});
    }

    $selectedCardStore.hand = undefined;
  };

  const onAttackSelect = (): void => {
    if (!isCurrentPlayer) {
      return;
    }

    if (
      $selectedCardStore.hand &&
      $selectedCardStore.hand.id === CardId.QUICK_SAND
    ) {
      socket.emit("playMagic", {
        gid: $selectedCardStore.hand.gid,
        field
      });
      $selectedCardStore.hand = undefined;
    } else if ($selectedCardStore.field === field) {
      $selectedCardStore.field = undefined;
    } else if ($selectedCardStore.hand) {
      $selectedCardStore.hand = undefined;
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
    height: calc(var(--card-height) + 2px);
    width: calc(var(--card-width) + 2px);
    cursor: not-allowed;
    background: linear-gradient(
      90deg,
      rgba(31, 31, 31, 0.25) 0%,
      rgba(121, 108, 254, 0.5) 50%,
      rgba(31, 31, 31, 0.25) 100%
    );
    border-radius: 8px;
    backdrop-filter: blur(2px);
  }

  .isSummonable {
    position: relative;
    cursor: pointer;
  }

  .isSummonable::after {
    content: "";
    position: absolute;
    border-radius: 8px;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    box-shadow: 0 0 8px 4px rgb(var(--health));
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
    color: rgb(var(--warn));
    font-size: 128px;
    visibility: hidden;
    z-index: 5;
  }

  .field-empty {
    height: var(--card-height);
    width: var(--card-width);
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(31, 31, 31, 0.8);
    border: 1px solid rgb(96, 133, 29);
    border-radius: 8px;
    text-transform: uppercase;
  }
</style>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="field" bind:this="{fieldElement}">
  {#if $floatingTextStore.player[field]}
    <FloatingText {field}/>
  {/if}

  {#if minion}
    <div in:scale="{{start: 8, duration: 400, opacity: 0}}">
      <CardComponent {isSelected} {isTargetable} card="{minion}" on:click="{onAttackSelect}"/>
    </div>
  {:else}
    <div class="field-empty" class:isSummonable on:click="{onPlayCard}">
      {field}
    </div>
  {/if}

  <div class="damage-dealt" bind:this="{damageDealtElement}"></div>
</div>
