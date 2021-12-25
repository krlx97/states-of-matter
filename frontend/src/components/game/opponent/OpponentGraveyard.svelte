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
    @include d-flex(row, center, center);
    border: 2px solid $purple;
    box-sizing: border-box;
    color: white;
  }
</style>

<div class="graveyard">
  {#if $game.opponent.graveyard.length}
    <CardComponent
      card={cards.find((card) => card.id === $game.opponent.graveyard[$game.opponent.graveyard.length - 1].id)}
      health={10}
      damage={10}
    />
  {:else}
    Graveyard
  {/if}
</div>
