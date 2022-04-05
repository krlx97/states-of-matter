<script lang="ts">
  import Opponent from "./opponent/Opponent.svelte";
  import Player from "./player/Player.svelte";
</script>

<style lang="scss">
  @import "../shared/styles/mixins";
  @import "../shared/styles/variables";

  .game {
    height: 100%;
    width: 100%;
    @include flex(column, center, center);
    background-image: url("/assets/gamebg.png");
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }
</style>

<div class="game">
  <Opponent/>
  <Player/>
</div>
