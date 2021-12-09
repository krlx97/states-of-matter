<script lang="ts">
  import {Card} from "components";
  import {cards} from "data";
  import deckStore from "./stores/deckStore";

  let klass: number;

  const onAddToDeck = (card): void => {
    const {id, klass, name} = card;

    if ($deckStore.cardsAmount >= 30) { return; }

    deckStore.update((store) => {
      const deckCard = store.cards.find((deckCard) => deckCard.id === id);

      if (deckCard) {
        if (deckCard.amount < 2) { deckCard.amount += 1; }
      } else {
        const amount = 1;
        store.cards.push({klass, id, name, amount});
      }

      store.cardsAmount = store.cards.reduce((acc, {amount}) => acc += amount, 0);

      return store;
    });
  };

  export {klass};
</script>

<style lang="scss">
  @import "../../../../styles/variables";

  .cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: $spacing-md;
  }
</style>

<div class="cards">
  {#each cards as card}
    {#if card.klass === klass}
      <div on:click={() => onAddToDeck(card)}>
        <Card {card}/>
      </div>
    {/if}
  {/each}
</div>
