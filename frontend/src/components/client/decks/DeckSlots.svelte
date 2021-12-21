<script lang="ts">
  import {ProgressBar} from "components";
  import {miscService, socketService} from "services";
  import {playerStore} from "stores/data";
  import {decksStore} from "stores/view";
  import DeckSlot from "./DeckSlot.svelte";
</script>

<style lang="scss">
  @import "../../../styles/variables";

  .decks {
    padding: $spacing-md;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }
</style>

<div class="decks">
  {#each $decksStore.deckSlots as deck}
    <DeckSlot {deck}/>
  {/each}
</div>
