<script lang="ts">
  import {onMount} from "svelte";
  import {modalService} from "services";
  import {gameStore, nodeStore} from "stores";
  import {CardComponent} from "ui";
  import GraveyardComponent from "../modals/Graveyard.svelte";

  let graveyardElement: HTMLDivElement;
  $: card = $gameStore.player.graveyard[$gameStore.player.graveyard.length - 1];

  const onViewGraveyard = (): void => {
    modalService.open(GraveyardComponent, $gameStore.player.graveyard);
  };

  onMount((): void => {
    $nodeStore.player.graveyard = graveyardElement;
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
    top: -48px;
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
  {#if $gameStore.player.graveyard.length}
    {#key card}
      <CardComponent {card}/>
    {/key}
  {:else}
    <div class="graveyard-empty">Graveyard</div>
  {/if}
  <div class="graveyard__cards">{$gameStore.player.graveyard.length}</div>
</div>
