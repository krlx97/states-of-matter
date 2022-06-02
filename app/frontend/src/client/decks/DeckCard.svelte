<script lang="ts">
  import {decksStore, playerStore} from "stores";
  import Text from "../../ui/Text.svelte";

  let card: any;

  const onRemoveFromDeck = (): void => {
    const {deckId} = $playerStore;

    decksStore.update((store) => {
      const deckCard = store.deckCards.find((deckCard) => deckCard.id === card.id);
      const deckSlot = store.deckSlots.find((deckSlot) => deckSlot.id === deckId);

      if (deckCard.amount > 1) {
        deckCard.amount -= 1;
      } else {
        const i = store.deckCards.indexOf(deckCard);
        store.deckCards.splice(i, 1);
      }

      deckSlot.cardsInDeck = store.deckCards.reduce((acc, {amount}) => acc += amount, 0);

      store.deckCards.sort((a, b) => a.manaCost - b.manaCost);

      return store;
    });
  };

  export {card};
</script>

<style lang="scss">
  @import "../../shared/styles/mixins";
  @import "../../shared/styles/variables";

  .card {
    margin: $spacing-md;
    @include flex($align-items: center);
    background-color: $dark-grey;
    border: 2px solid $light-grey;
    // box-shadow: $elevation-sm;
    box-sizing: border-box;
    cursor: pointer;

    &__img {
      height: 48px;
      width: 48px;
      margin-right: $spacing-sm;
    }

    &__text {
      flex-grow: 1;
    }

    &__attr {
      margin-right: $spacing-sm;
      @include flex(column, center, center);
    }
  }
</style>

<div class="card" on:click={onRemoveFromDeck}>
  <img
    class="card__img"
    src="assets/cards/{card.klass}/{card.id}.jpg"
    alt={card.name}
  />
  <div class="card__text">
    <Text>{card.name}</Text>
    <Text>{card.amount} / 2</Text>
  </div>
  <div class="card__attr">
    <img
      src="assets/attrs/mana.png"
      alt={card.name}
      height=24
      width=24
    />
    <div>{card.manaCost}</div>
  </div>
</div>
