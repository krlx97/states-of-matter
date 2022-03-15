<script lang="ts">
  import {decksStore} from "client/stores";
  import {playerStore} from "stores/data";

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
    border-radius: 4px;
    box-shadow: $elevation-sm;
    cursor: pointer;

    &__img {
      height: 48px;
      width: 48px;
      margin-right: $spacing-md;
    }

    &__text { flex-grow: 1; }
  }
</style>

<div class="card" on:click={onRemoveFromDeck}>
  <img
    class="card__img"
    src="assets/cards/{card.klass}/{card.id}.jpg"
    alt={card.name}/>
  <div class="card__text">
    <Text>{card.name}</Text>
    <Text>{card.amount} / 2</Text>
  </div>
</div>
