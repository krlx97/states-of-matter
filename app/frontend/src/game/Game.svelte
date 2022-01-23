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

  .game {
    height: 100%;
    width: 100%;
    @include flex(column, center, center);
  }
</style>

<div class="game">
  <Opponent/>
  <Player/>
</div>
