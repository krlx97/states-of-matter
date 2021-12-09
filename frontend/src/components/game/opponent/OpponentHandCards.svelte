<script lang="ts">
  import {gameStore, playerStore} from "stores/data";
</script>

<style lang="scss">
  @use "sass:math";
  @import "../../../styles/mixins";
  @import "../../../styles/variables";

  .player__hand {
    display: flex;
  }
  .player__hand__card {
    height: $game-field-height;
    width: $game-field-width;
    transition: transform 225ms cubic-bezier(0.455, 0.03, 0.515, 0.955);
  }
  .player__hand__card:not(:first-child) {
    margin-left: math.div(-$game-field-width, 2);
  }

  .player__deck__img {
    height: $game-field-height;
    width: $game-field-width;
  }
</style>

<div class="player__hand">
  {#if $gameStore.playerA.username !== $playerStore.username}
    {#each $gameStore.playerA.hand as {id, gid}}
      <div class="player__hand__card">
        <img class="player__deck__img" src="assets/card-backs/default.jpg" alt="">
      </div>
    {/each}
  {:else if $gameStore.playerB.username !== $playerStore.username}
    {#each $gameStore.playerB.hand as {id, gid}}
      <div class="player__hand__card">
        <img class="player__deck__img" src="assets/card-backs/default.jpg" alt="">
      </div>
    {/each}
  {/if}
</div>
