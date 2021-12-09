<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {fly} from "svelte/transition";

  import type {FlyParams} from "svelte/transition";
  import type {DeckCard} from "./stores/deckStore.models";

  const dispatch = createEventDispatcher();
  const inFly: FlyParams = {x: -100, duration: 225};
  let card: DeckCard;

  const onRemoveFromDeck = (): void => {
    dispatch("removeFromDeck", card.id);
  };

  export {card};
</script>

<style lang="scss">
  @import "../../../../styles/variables";

  .card {
    margin: 0 $spacing-md $spacing-md $spacing-md;
    display: flex;
    align-items: center;
    background-color: $light-grey;
    border-radius: 4px;
    cursor: pointer;
    overflow: hidden;

    &__img {
      height: 48px;
      width: 48px;
      margin-right: $spacing-md;
    }

    &__text {
      flex-grow: 1;
    }
  }
</style>

<div class="card" on:click={onRemoveFromDeck} in:fly={inFly}>

  <img
    class="card__img"
    src="assets/cards/{card.klass}/{card.id}.jpg"
    alt={card.name}>

  <div class="card__text">
    <span>{card.name}</span><br>
    <span>{card.amount} / 2</span>
  </div>

</div>
