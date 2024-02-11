<script lang="ts">
  import {gameStore} from "stores";

  let opponentCards: Array<number> = [];

  gameStore.subscribe((game) => {
    opponentCards = [];

    for (let x = 0; x < $gameStore.opponent.hand; x += 1) {
      opponentCards.push(x);
    }

    opponentCards.reverse();
  });
</script>

<style>
  .player__hand {
    display: flex;
    position: absolute;
    top: -288px;
    left: 50%;
    transform: translateX(-50%);
  }
  .player__hand__card {
    height: 216px;
    width: 144px;
    transition: transform 225ms cubic-bezier(0.455, 0.03, 0.515, 0.955);
  }

  .player__deck__img {
    height: 216px;
    width: 144px;
  }
</style>

<div class="player__hand">
  {#each opponentCards as i}
    <div
      class="player__hand__card"
      >
      <img class="player__deck__img" src="images/card/card-back.png" alt="Hand Card"/>
    </div>
  {/each}
</div>
