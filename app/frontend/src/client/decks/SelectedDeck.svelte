<script lang="ts">
  import DeckSlot from "./DeckSlot.svelte";
  import DeckSlots from "./DeckSlots.svelte";

  let areDeckSlotsVisible = false;

  const onToggleDeckSlots = (): void => {
    areDeckSlotsVisible = !areDeckSlotsVisible;
  };
</script>

<style lang="scss">
  .selected-deck {
    position: relative;
  }
</style>

<div class="selected-deck">
  <DeckSlot
    areActionButtonsVisible={true}
    on:toggleDeckSlots={onToggleDeckSlots}
  />
  {#if areDeckSlotsVisible}
    <DeckSlots/>
  {/if}
</div>
