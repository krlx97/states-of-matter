<script lang="ts">
  import {gameStore} from "stores";
</script>

<style lang="scss">
  @import "../../shared/styles/mixins";
  @import "../../shared/styles/variables";

  .deck {
    position: relative;

    &__cards {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-shadow: 2px 2px 4px black;
    }

    &__img {
      height: $card-height-sm;
      width: $card-width-sm;
    }
  }
</style>

<div class="deck">
  <span class="deck__cards">{$gameStore.opponent.deck} / 30</span>
  <img class="deck__img" src="assets/card-backs/default.jpg" alt="Deck"/>
</div>
