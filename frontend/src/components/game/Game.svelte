<script lang="ts">
  import {socketService} from "services";
  import {gameStore, playerStore} from "stores/data";

  import OpponentFieldsComponent from "./opponent/OpponentFields.svelte";
  import PlayerFieldsComponent from "./player/PlayerFields.svelte";

  const onEndGame = (): void => {
    const {gameId} = $gameStore;
    socketService.emit("exitGame", {gameId});
  };
</script>

<style lang="scss">
  @import "../../styles/mixins";
  @import "../../styles/variables";

  // .scene { perspective: 1280px; }

  .game {
    position: relative;
    height: 100%;
    width: 100%;
    // transform-style: preserve-3d;
    // transform-origin: center center;
    @include d-flex(column, center, center);
    // transform: perspective(1280px) rotateX(25deg);
  }

  .btn-end {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>

<!-- <div class="scene"> -->
  <div class="game">
    {#if $gameStore.playerA.username === $playerStore.username}
      <button class="btn-end btn--raised-accent" on:click={onEndGame}>
        END GAME
      </button>
    {/if}
  
    <OpponentFieldsComponent/>
    <PlayerFieldsComponent/>
  </div>
<!-- </div> -->
