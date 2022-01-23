<script lang="ts">
  import {cards} from "@som/shared/data";
  import {miscService} from "services";
  import {gameStore} from "game/stores";

  import Card from "../../ui/Card.svelte";

  const onViewGraveyard = (): void => {
    miscService.openModal("graveyard", $gameStore.player.graveyard);
  };
</script>

<style lang="scss">
  @import "../../shared/styles/mixins";
  @import "../../shared/styles/variables";

  .graveyard {
    height: $card-height;
    width: $card-width;
    @include flex($align-items: center, $justify-content: center);
    background-color: $purple;
    box-shadow: $elevation-sm;
    color: white;
  }
</style>

<div class="graveyard" on:click={onViewGraveyard}>
  {#if $gameStore.player.graveyard.length}
    <Card
      card={cards.find((card) => card.id === $gameStore.player.graveyard[$gameStore.player.graveyard.length - 1].id)}
      health={10}
      damage={10}
    />
  {:else}
    Graveyard
  {/if}
</div>
