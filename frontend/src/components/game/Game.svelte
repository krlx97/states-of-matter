<script lang="ts">
  import {setContext} from "svelte";
  import {socketService} from "services";
  import {gameStore, playerStore} from "stores/data";
  import {selectedCard} from "./stores";

  import OpponentFields from "./opponent/OpponentFields.svelte";
  import PlayerFields from "./player/PlayerFields.svelte";

  setContext("selectedCard", selectedCard);

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
    <button class="btn-end btn--raised-accent" on:click={onEndGame}>END GAME</button>
  {/if}

  <OpponentFields/>
  <PlayerFields/>
</div>
