<script lang="ts">
  import {decksStore} from "stores";
  import DeckSlot from "./DeckSlot.svelte";
</script>

<style lang="scss">
  @import "../../shared/styles/mixins";
  @import "../../shared/styles/variables";

  .decks {
    position: absolute;
    top: 100%;
    left: 0;

    &__deck {
      // margin: 1em 0;
    }
  }
</style>

<div class="decks">
  {#each $decksStore.deckSlots as deck}
    <div class="decks__deck">
      <DeckSlot {deck}/>
    </div>
  {/each}
</div>
