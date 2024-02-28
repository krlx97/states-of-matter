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
    top: -36px;
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
  {#if $gameStore.player.graveyard.length}
      <img src="images/card/card-back.png" alt="Deck"/>
    <!-- {#key card}
      <div class="cd">
        <CardComponent {card}/>
      </div>
    {/key}-->
  {:else}
    <div class="graveyard-empty"></div>
  {/if}
  <div class="graveyard__cards">
    <div>Graveyard</div>
    {$gameStore.player.graveyard.length}
  </div>
</div>
