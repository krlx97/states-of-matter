<script lang="ts">
  import {decksStore} from "stores";
  import DeckSlot from "./DeckSlot.svelte";
</script>

<style lang="scss">
  @import "../../shared/styles/mixins";
  @import "../../shared/styles/variables";

  .decks {
    padding: $spacing-md;
    @include flex(column);
    box-sizing: border-box;
  }
</style>

<div class="decks">
  {#each $decksStore.deckSlots as deck}
    <DeckSlot {deck}/>
  {/each}
</div>
