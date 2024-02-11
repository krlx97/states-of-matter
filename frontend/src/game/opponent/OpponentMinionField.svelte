<script lang="ts">
  import {onMount} from "svelte";
  import { scale } from "svelte/transition";
  import { CardId, CardType } from "@som/shared/enums";
  import {socketService} from "services";
  import {floatingTextStore, gameStore, nodeStore, playerStore, selectedCardStore} from "stores";
  import {CardComponent} from "ui";
  import FloatingText from "../FloatingText.svelte";

  export let field: "a" | "b" | "c" | "d";

  $: minion = $gameStore.opponent.field[field];
  $: isAttackable = $selectedCardStore.field && minion !== undefined;
  $: isTargetable = $selectedCardStore.hand && $selectedCardStore.hand.id === CardId.CROSS;

  let damageDealtElement: HTMLDivElement;
  let fieldElement: HTMLDivElement;

  const onAttackCard = (): void => {
    if ($gameStore.currentPlayer !== $playerStore.name) { return; }

    if ($selectedCardStore.field) {
      const attacked = field;
      const attacker = $selectedCardStore.field;

      socketService.socket.emit("attackMinion", {attacked, attacker});

      $selectedCardStore.field = undefined;
    } else if ($selectedCardStore.hand && $selectedCardStore.hand.id === CardId.CROSS) {
      socketService.socket.emit("playMagic", {
        gid: $selectedCardStore.hand.gid,
        field
      });

      $selectedCardStore.hand = undefined;
    }
  };

  onMount((): void => {
    $nodeStore.opponent[field] = fieldElement;
    $nodeStore.opponent[`${field}Damage`] = damageDealtElement;
  });
</script>

<style>
  .field {
    position: relative;
    height: calc(var(--card-height) + 2px);
    width: calc(var(--card-width) + 2px);
    cursor: not-allowed;
    /* transition: transform 225ms ease-in-out; */
    background: linear-gradient(
      90deg,
      rgba(31, 31, 31, 0.25) 0%,
      rgba(121, 108, 254, 0.5) 50%,
      rgba(31, 31, 31, 0.25) 100%
    );
    border-radius: 8px;
    backdrop-filter: blur(2px);
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

<div class="field" bind:this={fieldElement} style={field === "a" ? "z-index: 1" : field === "b" ? "z-index: 2" : field === "c" ? "z-index: 3" : "z-index: 4"}>
  {#if $floatingTextStore.opponent[field]}
    <FloatingText isOpponent {field}/>
  {/if}

  {#if minion}
    <div in:scale="{{start: 8, duration: 400, opacity: 0}}">
      <CardComponent {isAttackable} {isTargetable} card={minion} isOpponent on:click={onAttackCard}/>
    </div>
  {:else}
    <div class="field-empty">{field}</div>
  {/if}

  <div class="damage-dealt" bind:this={damageDealtElement}></div>
</div>
