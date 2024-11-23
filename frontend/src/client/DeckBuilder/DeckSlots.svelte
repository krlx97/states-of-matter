<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {playerStore} from "stores";
  import DeckSlotComponent from "./DeckSlot.svelte";

  const dispatch = createEventDispatcher();

  const onToggleDeckSlots = (): void => {
    dispatch("selectDeck");
  };
</script>

<style>
  .deck-slots {
    /* height: 644px; */
    width: 288px;
    padding: var(--md);
    display: flex;
    flex-direction: column;
    gap: var(--md);
    box-sizing: border-box;
  }
</style>

<div class="deck-slots">
  {#each $playerStore.decks as deck}
    <DeckSlotComponent {deck} on:toggleDeckSlots="{onToggleDeckSlots}"/>
  {/each}
</div>
