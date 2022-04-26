<script lang="ts">
  import {cards} from "@som/shared/data";
  import {miscService} from "services";
  import {gameStore} from "stores";
  import CardSm from "../../ui/CardSm.svelte";

  const onViewGraveyard = (): void => {
    miscService.openModal("graveyard", $gameStore.opponent.graveyard);
  };
</script>

<style lang="scss">
  @import "../../shared/styles/mixins";
  @import "../../shared/styles/variables";

  .graveyard {
    height: $card-height-sm;
    width: $card-width-sm;
    @include flex($align-items: center, $justify-content: center);
    border: 2px solid $purple;
    box-sizing: border-box;
    color: white;
  }
</style>

<div class="graveyard" on:click={onViewGraveyard}>
  {#if $gameStore.opponent.graveyard.length}
    <CardSm
      card={cards.find((card) => card.id === $gameStore.opponent.graveyard[$gameStore.opponent.graveyard.length - 1].id)}
      health={10}
      damage={10}
    />
  {:else}
    Graveyard
  {/if}
</div>
