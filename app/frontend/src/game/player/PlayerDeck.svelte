<script lang="ts">
  import {socketService} from "services";
  import {gameStore} from "stores";

  const onEndTurn = (): void => {
    socketService.socket.emit("endTurn");
  };
</script>

<style lang="scss">
  @import "../../shared/styles/mixins";
  @import "../../shared/styles/variables";

  .deck {
    position: relative;

    &__img {
      height: $card-height;
      width: $card-width;
    }

    &__cards {
      position: absolute;
      bottom: 0;
      left: 50%;
      padding: $spacing-sm;
      transform: translateX(-50%);
      background-color: $dark-grey;
      box-sizing: border-box;
    }
  }
</style>

<div class="deck" on:click={onEndTurn}>
  <span class="deck__cards">{$gameStore.player.deck.length} / 30</span>
  <img class="deck__img" src="assets/card-backs/default.jpg" alt="Deck">
</div>
