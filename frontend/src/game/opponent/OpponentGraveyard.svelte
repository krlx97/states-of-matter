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
    /* height: 216px;
    width: 144px; */
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid rgb(var(--purple));
    border-radius: 8px;
    /* box-sizing: border-box; */
    color: white;
  }
</style>

<div class="graveyard" on:click={onViewGraveyard} on:keypress={onViewGraveyard} bind:this={graveyardElement}>
  {#if $gameStore.opponent.graveyard.length}
    <CardComponent
      card={cards.find((card) => card.id === $gameStore.opponent.graveyard[$gameStore.opponent.graveyard.length - 1].id)}
      isClient={false}
      isOpponent
    />
  {:else}
    Graveyard
  {/if}
</div>
