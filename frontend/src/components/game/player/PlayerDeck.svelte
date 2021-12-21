<script lang="ts">
  import {socketService} from "services";
  import {gameStore, playerStore} from "stores/data";

  const onDrawCard = (): void => {
    const {gameId} = $gameStore;
    socketService.emit("drawCard", {gameId});
  };
</script>

<style lang="scss">
  @import "../../../styles/mixins";
  @import "../../../styles/variables";

  .player__deck {
    position: relative;
    height: $card-height;
    width: $card-width;
  }

  .player__deck__img {
    height: calc($game-card-height + 32px);
    width: $game-card-width;
  }

  .numofcards {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-shadow: 2px 2px 4px black;
  }
</style>

<div class="player__deck" on:click={onDrawCard}>
  <div class="numofcards">
    {#if $gameStore.playerA.username === $playerStore.username}
      {$gameStore.playerA.deck.length} / 30
    {:else}
      {$gameStore.playerB.deck.length} / 30
    {/if}
  </div>
  <img class="player__deck__img" src="assets/card-backs/default.jpg" alt="Deck">
</div>
