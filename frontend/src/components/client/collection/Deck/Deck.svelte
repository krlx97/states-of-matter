<script lang="ts">
  import {onMount} from "svelte";
  import Cards from "./Cards.svelte";
  import DeckCards from "./DeckCards.svelte";
  import {cards} from "data";
  import {playerStore} from "stores/data";
  import deckStore from "./stores/deckStore";

  import Decks from "../Decks/Decks.svelte"

  let klass = 0;

  $: deckCards = 1;

  onMount(() => {
    const {account: {deck_id}, decks} = $playerStore;
    const _deck = decks.find(({id}) => id === deck_id);
    const deckCards = [];
    let deckCardsAmount: number;
    const {name} = decks.find(({id}) => id === deck_id);

    _deck.cards.forEach((deckCard) => {
      const card = cards.find((card) => card.id === deckCard.id);
      const {id, klass, name} = card;
      const {amount} = deckCard;

      deckCards.push({klass, id, name, amount});
    });

    deckCardsAmount = deckCards.reduce((acc, {amount}) => acc += amount, 0);

    deckStore.update((store) => {
      store.name = name;
      store.cards = deckCards;
      store.cardsAmount = deckCardsAmount;

      return store;
    });
  });
</script>

<style lang="scss">
  @import "../../../../styles/mixins";
  @import "../../../../styles/variables";

  .deck {
    display: flex;
    box-shadow: $elevation-sm;
  }

  section {
  }

  .klasses {
    display: flex;
    justify-content: space-evenly;

    &__klass {
      display: flex;
      filter: grayscale(1);
      cursor: pointer;
      transition: filter 225ms ease;

      &:hover {
        filter: grayscale(0);
      }

      &-selected {
        filter: grayscale(0);
      }

      img {
        height: 64px;
        width: 64px;
      }
    }
  }
</style>

<div class="deck">
  <section>
    <div class="klasses">
      <div class="klasses__klass" class:klasses__klass-selected={klass === 0} on:click={() => klass = 0}>
        <img class="cards__header__class-img" src="assets/classes/{0}.png" alt="A">
      </div>
      <div class="klasses__klass" class:klasses__klass-selected={klass === 1} on:click={() => klass = 1}>
        <img class="cards__header__class-img" src="assets/classes/{1}.png" alt="B">
      </div>
      <div class="klasses__klass" class:klasses__klass-selected={klass === 2} on:click={() => klass = 2}>
        <img class="cards__header__class-img" src="assets/classes/{2}.png" alt="C">
      </div>
      <div class="klasses__klass" class:klasses__klass-selected={klass === 3} on:click={() => klass = 3}>
        <img class="cards__header__class-img" src="assets/classes/{3}.png" alt="D">
      </div>
      <div class="klasses__klass" class:klasses__klass-selected={klass === 4} on:click={() => klass = 4}>
        <img class="cards__header__class-img" src="assets/classes/{4}.png" alt="E">
      </div>
    </div>
    <Cards {klass}/>
  </section>
  <section>
    <DeckCards/>
  </section>
  <section>
    <Decks/>
  </section>
</div>
