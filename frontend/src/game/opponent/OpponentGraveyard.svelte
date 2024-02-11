<script lang="ts">
  import {cards} from "@som/shared/data";
  import {modalService} from "services";
  import {gameStore, nodeStore} from "stores";
  import {onMount} from "svelte";
  import {CardComponent} from "ui";
  import GraveyardComponent from "../modals/Graveyard.svelte";

  let graveyardElement: HTMLDivElement;

  const onViewGraveyard = (): void => {
    modalService.open(GraveyardComponent, $gameStore.opponent.graveyard);
  };

  onMount((): void => {
    $nodeStore.opponent.graveyard = graveyardElement;
  });
</script>

<style>
  .graveyard {
   height: var(--card-height);
    width: var(--card-width);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgb(var(--primary));
    border-radius: 8px;
    /* box-sizing: border-box; */
    color: white;
  }
</style>

<div class="graveyard" on:click={onViewGraveyard} on:keypress={onViewGraveyard} bind:this={graveyardElement}>
  {#if $gameStore.opponent.graveyard.length}
    <CardComponent
      card={$gameStore.opponent.graveyard[$gameStore.opponent.graveyard.length - 1]}
      isClient={false}
      isOpponent
    />
  {:else}
    Graveyard
  {/if}
</div>
