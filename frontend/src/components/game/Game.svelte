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

  .game {
    position: relative;
    height: 100%;
    width: 100%;
    @include d-flex(column, center, center);
  }

  .btn-end {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>

<div class="game">
  {#if $gameStore.playerA.username === $playerStore.username}
    <button class="btn-end btn--raised-accent" on:click={onEndGame}>
      END GAME
    </button>
  {/if}

  <OpponentFieldsComponent/>
  <PlayerFieldsComponent/>
</div>
