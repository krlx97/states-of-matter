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
    z-index: 0;
  }

  .graveyard-empty {
    height: calc(var(--card-height) + 2px);
    width: calc(var(--card-width) + 2px);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(var(--grey), 0.4);
    background-color: rgba(var(--dark-grey), 0.8);
    border-radius: 8px;
    box-sizing: border-box;
  }

  .graveyard__cards {
    position: absolute;
    bottom: -36px;
    left: 50%;
    width: 75%;
    padding: 4px var(--xs);
    background-color: rgb(var(--dark-grey));
    border-radius: 8px;
    box-sizing: border-box;
    text-align: center;
    transform: translateX(-50%);
    font-size: var(--xs);
  }
</style>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="graveyard"
  bind:this="{graveyardElement}"
  on:click="{onViewGraveyard}">
  {#if $gameStore.opponent.graveyard.length}
    <!-- {#key card}
      <CardComponent {card} isOpponent/>
    {/key} -->
    <img src="images/card/card-back.png" alt="Deck"/>

  {:else}
    <div class="graveyard-empty"></div>
  {/if}
  <div class="graveyard__cards">
    Graveyard<br/>
    {$gameStore.opponent.graveyard.length}
  </div>
</div>
