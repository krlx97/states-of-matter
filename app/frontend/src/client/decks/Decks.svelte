<script lang="ts">
  import {cards} from "@som/shared/data";
  import {onMount} from "svelte";
  import {decksStore, playerStore} from "stores";
  import Cards from "./Cards.svelte";
  import SelectedDeck from "./SelectedDeck.svelte";
  import DeckCards from "./DeckCards.svelte";
  import HeroCards from "./HeroCards.svelte";

  onMount((): void => {
    const {deckId} = $playerStore;
    const deck = $playerStore.decks.find((deck) => deck.id === deckId);

    $decksStore.deckCards = deck.cards.map((deckCard) => {
      const card = cards.find((card) => card.id === deckCard.id);
      const {id, klass, name, manaCost} = card;
      const {amount} = deckCard;

      return {klass, id, name, amount, manaCost};
    }).sort((a, b) => a.manaCost - b.manaCost);

    $decksStore.deckSlots = $playerStore.decks.map((deck) => {
      const {id, name, klass, cards} = deck;
      let cardsInDeck = 0;

      if (cards.length) {
        cardsInDeck = cards.reduce((acc, {amount}) => acc += amount, 0);
      }

      return {id, name, klass, cardsInDeck};
    });

    $decksStore.selectedDeck = $decksStore.deckSlots.find((slot) => slot.id === $playerStore.deckId);
  });
</script>

<style lang="scss">
  @import "../../shared/styles/mixins";
  @import "../../shared/styles/variables";

  .decks {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    &__deck {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    &__cards {
      height: 100%;
      margin: 0 $spacing-md;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }
</style>

<div class="decks">
  <div class="decks__cards">
    <HeroCards/>
    <Cards/>
  </div>
  <div class="decks__deck">
    <SelectedDeck/>
    <DeckCards/>
  </div>
</div>
