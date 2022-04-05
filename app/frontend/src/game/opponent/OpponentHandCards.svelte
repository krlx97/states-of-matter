<script lang="ts">
  import {gameStore} from "stores";
</script>

<style lang="scss">
  @use "sass:math";
  @import "../../shared/styles/mixins";
  @import "../../shared/styles/variables";

  .player__hand {
    display: flex;
    position: absolute;
    top: -134px;
    left: 50%;
    transform: translateX(-50%);
  }
  .player__hand__card {
    height: $card-height-sm;
    width: $card-width-sm;
    transition: transform 225ms cubic-bezier(0.455, 0.03, 0.515, 0.955);
  }
  .player__hand__card:not(:first-child) {
    margin-left: math.div(-$card-width, 2);
  }

  .player__deck__img {
    height: $card-height-sm;
    width: $card-width-sm;
  }
</style>

<div class="player__hand">
  {#each Array($gameStore.opponent.hand) as _}
    <div class="player__hand__card">
      <img class="player__deck__img" src="assets/card-backs/default.jpg" alt=""/>
    </div>
  {/each}
</div>
