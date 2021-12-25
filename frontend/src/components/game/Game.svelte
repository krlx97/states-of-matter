<script lang="ts">
  import {onDestroy, onMount} from "svelte";
  import {socketService} from "services";
  import responses from "game/responses";
  import {game} from "game/stores";
  import Opponent from "./opponent/Opponent.svelte";
  import Player from "./player/Player.svelte";
  import {Button} from "components";

  const onEndGame = (): void => {
    const {gameId} = $game;
    socketService.emit("exitGame", {gameId});
  };

  onMount(() => { socketService.listenToResponses(responses); });
  onDestroy(() => { socketService.unlisten(responses); });
</script>

<style lang="scss">
  @import "../../styles/mixins";
  @import "../../styles/variables";

  .game {
    position: relative;
    height: 100%;
    width: 100%;
    @include flex(column, center, center);

    &__btn {
      position: absolute;
      top: 0;
      left: 0;
    }
  }
</style>

<div class="game">
  <div class="game__btn">
    <Button on:click={onEndGame}>
      END GAME
    </Button>
  </div>

  <Opponent/>
  <Player/>
</div>
