<script lang="ts">
  import {socketService} from "services";
  import {game} from "game/stores";

  const onDrawCard = (): void => {
    const {gameId} = $game;
    socketService.emit("drawCard", {gameId});
  };
</script>

<style lang="scss">
  @import "../../../styles/mixins";
  @import "../../../styles/variables";

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

<div class="deck" on:click={onDrawCard}>
  <span class="deck__cards">{$game.player.deck.length} / 30</span>
  <img class="deck__img" src="assets/card-backs/default.jpg" alt="Deck">
</div>
