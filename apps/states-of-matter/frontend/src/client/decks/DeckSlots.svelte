<script lang="ts">
  import {decksStore} from "stores";
  import DeckSlot from "./DeckSlot.svelte";
</script>

<style>
  .decks {
    position: absolute;
    top: 100%;
    left: 0;
  }
</style>

<div class="decks">
  {#each $decksStore.deckSlots as deck}
    <DeckSlot {deck}/>
  {/each}
</div>
