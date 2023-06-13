<script lang="ts">
  import {playerStore} from "stores";
  import DeckSlotComponent from "./DeckSlot.svelte";
</script>

<style>
  .deck-slots {
    height: 644px;
    width: 288px;
    padding: var(--spacing-md);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    background-color: rgb(31, 31, 31);
    overflow-y: scroll;
    box-sizing: border-box;
  }

  .deck-slots::-webkit-scrollbar {
    width: 8px;
  }

  .deck-slots::-webkit-scrollbar-track {
    background-color: rgb(63, 63, 63);
    border-radius: 8px;
  }

  .deck-slots::-webkit-scrollbar-thumb {
    background-color: rgb(127, 127, 127);
    border-radius: 8px;
  }

  .deck-slots__info {
    text-align: center;
  }
</style>

<div class="deck-slots">
  <p class="deck-slots__info">Click to select a different deck</p>
  {#each $playerStore.decks as deck}
    <DeckSlotComponent {deck}/>
  {/each}
</div>
