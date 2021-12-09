<script lang="ts">
  import {onMount} from "svelte";
  import {playerStore} from "stores/data";
  import decksStore from "./stores/decksStore";
  import Deck from "./Deck.svelte";

  onMount(() => {
    $decksStore = $playerStore.decks.map((deck) => {
      const {id, name, klass, cards} = deck;
      let cardsInDeck = 0;

      if (cards.length) {
        cardsInDeck = cards.reduce((acc, {amount}) => acc += amount, 0);
      }

      return {id, name, klass, cardsInDeck};
    });
  });
</script>

<style lang="scss">
  @import "../../../../styles/variables";

  .decks {
    display: flex;
    flex-direction: column;
    align-items: center;

    &__wrapper {
      height: 600px;
      width: calc($game-card-width * 1 + $spacing-md * 2);
      padding: $spacing-md 0 0 $spacing-md;
      display: flex;
      flex-direction: column;
      // flex-wrap: wrap;
      box-sizing: border-box;
      box-shadow: $elevation-sm;
      overflow-y: scroll;
    }

    &__btn { margin: $spacing-md 0; }
  }
</style>

<div class="decks">
  <div class="decks__wrapper">
    {#each $decksStore as deck}
      <Deck {deck}/>
    {/each}
  </div>

  <button class="decks__btn btn--raised-accent">
    UNLOCK NEW DECK SLOT
    (1 <img src="assets/currencies/telos.png" width="12" height="12" alt="TLOS">)
  </button>
</div>
