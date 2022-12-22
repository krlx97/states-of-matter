<script lang="ts">
  import {cards} from "@som/shared/data";
  import {CardType} from "@som/shared/enums";
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

      if (card.type !== CardType.HERO) {
        const {id, klass, name, manaCost} = card;
        const {amount} = deckCard;

        return {klass, id, name, amount, manaCost};
      }
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

<style>
  .decks {
    height: 100%;
    padding: var(--spacing-md);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-md);
    box-sizing: border-box;
  }
</style>

<div class="decks">
  <div>
    <SelectedDeck/>
    <DeckCards/>
  </div>
  <div>
    <HeroCards/>
    <Cards/>
  </div>
</div>
