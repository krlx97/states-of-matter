<script lang="ts">
  import {gameStore} from "stores";
</script>

<style>
  .deck {
    position: relative;
    border: 2px solid rgb(var(--purple));
    border-radius: 8px;
  }

  .deck__cards {
    position: absolute;
    top: -48px;
    left: 50%;
    width: 75%;
    padding: var(--spacing-sm);
    background-color: rgb(31, 31, 31);
    border-radius: 8px;
    box-sizing: border-box;
    text-align: center;
    transform: translateX(-50%);
  }
</style>

<div class="deck">
  <img src="assets/cards/card-back.png" alt="Deck"/>
  <div class="deck__cards">{$gameStore.opponent.deck} / 30</div>
</div>
