<script lang="ts">
  import {afterUpdate} from "svelte";
  import {deckStore} from "stores";
  import DeckCardComponent from "./DeckCard.svelte";

  let deckCardsElement: HTMLDivElement;

  afterUpdate((): void => {
    deckCardsElement.scrollTo(0, deckCardsElement.scrollHeight);
  });
</script>

<style>
  .deck-cards {
    height: 644px;
    width: 288px;
    padding: var(--spacing-md);
    padding-bottom: 0;
    box-sizing: border-box;
    overflow-y: scroll;
  }

  .deck-cards::-webkit-scrollbar {
    width: 8px;
  }

  .deck-cards::-webkit-scrollbar-track {
    background-color: rgb(63, 63, 63);
    border-radius: 8px;
  }

  .deck-cards::-webkit-scrollbar-thumb {
    background-color: rgb(127, 127, 127);
    border-radius: 8px;
  }
</style>

<div class="deck-cards" bind:this={deckCardsElement}>
  {#if $deckStore.cards.length}
    {#each $deckStore.cards as card}
      <DeckCardComponent {card}/>
    {/each}
  {:else}
    Your deck is empty...
  {/if}
</div>
