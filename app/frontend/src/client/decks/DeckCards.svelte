<script lang="ts">
  import {decksStore} from "stores";
  import DeckCard from "./DeckCard.svelte";
</script>

<style lang="scss">
  @import "../../shared/styles/mixins";
  @import "../../shared/styles/variables";

  .deck {
    height: 100%;
    width: 256px;
    overflow-y: scroll;
    scrollbar-color: dark;
    scrollbar-width: thin;

    &::-webkit-scrollbar { width: 8px; }
    &::-webkit-scrollbar-track { background-color: transparent; }
    &::-webkit-scrollbar-thumb {
      background-color: $dark-grey;
      border: 1px solid transparent;
      border-radius: 8px;
      box-sizing: border-box;
    }
  }
</style>

<div class="deck">
  {#each $decksStore.deckCards as card}
    <DeckCard {card}/>
  {/each}
</div>
