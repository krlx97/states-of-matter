<script lang="ts">
  import {gameStore} from "stores";
</script>

<style>
  .deck {
    position: relative;
  }

  .deck__cards {
    position: absolute;
    bottom: -36px;
    left: 50%;
    width: 75%;
    padding: 4px var(--xs);
    background-color: rgb(var(--dark-grey));
    border-radius: 8px;
    box-sizing: border-box;
    text-align: center;
    transform: translateX(-50%);
    font-size: var(--xs);
  }
</style>

<div class="deck">
  <img src="images/card/card-back.png" alt="Deck"/>
  <div class="deck__cards">
    Deck<br/>
    {$gameStore.opponent.deck} / 30
  </div>
</div>
