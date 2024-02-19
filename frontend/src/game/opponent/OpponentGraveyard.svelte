<script lang="ts">
  import {modalService} from "services";
  import {gameStore, nodeStore} from "stores";
  import {onMount} from "svelte";
  import {CardComponent} from "ui";
  import GraveyardComponent from "../modals/Graveyard.svelte";

  let graveyardElement: HTMLDivElement;
  $: card = $gameStore.opponent.graveyard[$gameStore.opponent.graveyard.length - 1];

  const onViewGraveyard = (): void => {
    modalService.open(GraveyardComponent, $gameStore.opponent.graveyard);
  };

  onMount((): void => {
    $nodeStore.opponent.graveyard = graveyardElement;
  });
</script>

<style>
  .graveyard {
    position: relative;
    border: 1px solid rgb(var(--primary));
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

  .graveyard__cards {
    position: absolute;
    bottom: -48px;
    left: 50%;
    width: 75%;
    padding: var(--sm);
    background-color: rgb(31, 31, 31);
    border-radius: 8px;
    box-sizing: border-box;
    text-align: center;
    transform: translateX(-50%);
  }
</style>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="graveyard"
  bind:this="{graveyardElement}"
  on:click="{onViewGraveyard}">
  {#if $gameStore.opponent.graveyard.length}
    {#key card}
      <CardComponent {card} isOpponent/>
    {/key}
  {:else}
    <div class="graveyard-empty">Graveyard</div>
  {/if}
  <div class="graveyard__cards">{$gameStore.opponent.graveyard.length}</div>
</div>
