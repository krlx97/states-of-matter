<script lang="ts">
  import {onMount} from "svelte";
  import {cards} from "@som/shared/data";
  import {modalService} from "services";
  import {gameStore, nodeStore} from "stores";
  import {CardComponent} from "ui";
  import GraveyardComponent from "../modals/Graveyard.svelte";
  import type {Card} from "@som/shared/types/game";

  let graveyardElement: HTMLDivElement;
  // $: lastCard = cards.find((card) => card.id === $gameStore.player.graveyard[$gameStore.player.graveyard.length - 1].id);

  const onViewGraveyard = (): void => {
    modalService.open(GraveyardComponent, $gameStore.player.graveyard);
  };

  const getLastCard = (): Card => {
    const index = $gameStore.player.graveyard.length - 1;
    const {id} = $gameStore.player.graveyard[index];
    const card = cards.find((card) => card.id === id);

    return card;
  };

  onMount((): void => {
    $nodeStore.player.graveyard = graveyardElement;
  });
</script>

<style>
  .graveyard {
    position: relative;
    border: 2px solid rgb(var(--purple));
    border-radius: 8px;
    z-index: 0;
  }

  .graveyard-empty {
    height: var(--card-height);
    width: var(--card-width);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
</style>

<div
  class="graveyard"
  bind:this={graveyardElement}
  on:click={onViewGraveyard}
  on:keypress={onViewGraveyard}
>
  {#if $gameStore.player.graveyard.length}
    <CardComponent card={cards.find((card) => card.id === $gameStore.player.graveyard[$gameStore.player.graveyard.length - 1].id)} isClient={false}/>
  {:else}
    <div class="graveyard-empty">Graveyard</div>
  {/if}
</div>
