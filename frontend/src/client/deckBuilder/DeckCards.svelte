<script lang="ts">
  import {afterUpdate} from "svelte";
  import {playerStore} from "stores";
  import DeckCardComponent from "./DeckCard.svelte";

  let deckCardsElement: HTMLDivElement;
  $: deck = $playerStore.decks[$playerStore.deckId];

  afterUpdate((): void => {
    // deckCardsElement.scrollTo(0, deckCardsElement.scrollHeight);
  });
</script>

<style>
  .deck-cards {
    height: 606px;
    /* height: 686px; */
    flex-grow: 1;
    width: 288px;
    padding: var(--xs);
    /* account for scroll bar */
    padding-right: calc(var(--xs) - 4px);
    display: flex;
    flex-direction: column;
    gap: var(--xs);
    box-sizing: border-box;
    overflow-y: scroll;
  }

  .deck-cards::-webkit-scrollbar {
    width: 4px;
  }

  .deck-cards::-webkit-scrollbar-track {
    border-radius: 8px;
  }

  .deck-cards::-webkit-scrollbar-thumb {
    background-color: rgb(var(--grey));
    border-radius: 8px;
  }
</style>

<div class="deck-cards">
  {#if deck.cards}
    {#each deck.cards as deckCard}
      <DeckCardComponent {deckCard}/>
    {/each}
  {:else}
    This deck is empty.
  {/if}
</div>
