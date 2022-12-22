<script lang="ts">
  import {gameStore} from "stores";
</script>

<style>
  .deck {
    position: relative;
  }

  .deck__cards {
    position: absolute;
    top: -48px;
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

  .deck__img {
    height: 216px;
    width: 144px;
  }
</style>

<div class="deck">
  <span class="deck__cards">{$gameStore.opponent.deck} / 30</span>
  <img class="deck__img" src="assets/cards/card-back.png" alt="Deck"/>
</div>
