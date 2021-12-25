<script lang="ts">
  import {CardComponent} from "components";
  import {cards} from "data";
  import {game} from "game/stores";
</script>

<style lang="scss">
  @import "../../../styles/mixins";
  @import "../../../styles/variables";

  .graveyard {
    height: $card-height;
    width: $card-width;
    @include flex($align-items: center, $justify-content: center);
    background-color: $purple;
    box-shadow: $elevation-sm;
    color: white;
  }
</style>

<div class="graveyard">
  {#if $game.player.graveyard.length}
    <CardComponent
      card={cards.find((card) => card.id === $game.player.graveyard[$game.player.graveyard.length - 1].id)}
      health={10}
      damage={10}
    />
  {:else}
    Graveyard
  {/if}
</div>
