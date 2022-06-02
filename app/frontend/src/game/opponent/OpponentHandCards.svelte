<script lang="ts">
  import {gameStore, hoveredHandCardStore} from "stores";

  let opponentCards: Array<number> = [];

  gameStore.subscribe((game) => {
    opponentCards = [];

    for (let x = 0; x < $gameStore.opponent.hand; x += 1) {
      opponentCards.push(x);
    }

    opponentCards.reverse();
  });
</script>

<style lang="scss">
  @use "sass:math";
  @import "../../shared/styles/mixins";
  @import "../../shared/styles/variables";

  .player__hand {
    display: flex;
    position: absolute;
    top: -124px;
    left: 50%;
    transform: translateX(-50%);
  }
  .player__hand__card {
    height: $card-height-sm;
    width: $card-width-sm;
    transition: transform 225ms cubic-bezier(0.455, 0.03, 0.515, 0.955);
  }

  .player__deck__img {
    height: $card-height-sm;
    width: $card-width-sm;
  }
</style>

<div class="player__hand">
  {#each opponentCards as i}
    <div
      class="player__hand__card"
      style="transform: {$hoveredHandCardStore.i === i ? "translateY(124px)" : "translateY(0)"} ">
      <img class="player__deck__img" src="assets/card-backs/default.jpg" alt=""/>
    </div>
  {/each}
</div>
