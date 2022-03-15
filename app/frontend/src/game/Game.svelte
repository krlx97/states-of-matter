<script lang="ts">
  import {onDestroy, onMount} from "svelte";
  import {socketService} from "services";
  import * as responses from "game/responses";

  import Opponent from "./opponent/Opponent.svelte";
  import Player from "./player/Player.svelte";

  onMount((): void => { socketService.listen(responses); });
  onDestroy((): void => { socketService.forget(responses); });
</script>

<style lang="scss">
  @import "../shared/styles/mixins";
  @import "../shared/styles/variables";

  // .game-outter {
  //   height: 100%;
  //   width: 100%;
  //   perspective: 1024px;
  // }
  .game {
    height: 100%;
    width: 100%;
    @include flex(column, center, center);
    // transform-style: preserve-3d;
    // transform: rotateX(7deg);
  }
</style>

<div class="game-outter">
  <div class="game">
    <Opponent/>
    <Player/>
  </div>
</div>
