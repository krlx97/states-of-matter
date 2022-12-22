<script lang="ts">
  import {gameStore} from "stores";
</script>

<style>
  .deck {
    position: relative;
  }

  .deck__img {
    height: var(--card-height);
    width: var(--card-width);
  }

  .deck__cards {
    position: absolute;
    bottom: -48px;
    left: 50%;
    width: 75%;
    text-align: center;
    padding: var(--spacing-sm);
    background-color: rgb(47, 47, 47);
    border-radius: 4px;
    box-sizing: border-box;
    /* box-shadow: var(--elevation-sm); */
    transform: translateX(-50%);
  }
</style>

<div class="deck">
  <img class="deck__img" src="assets/cards/card-back.png" alt="Deck"/>
  <div class="deck__cards">
    {$gameStore.player.deck.length} / 30
  </div>
</div>
