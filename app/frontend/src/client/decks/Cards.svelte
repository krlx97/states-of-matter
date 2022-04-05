<script lang="ts">
  import {cards} from "@som/shared/data";
  import {decksStore, playerStore} from "stores";
  import Card from "../../ui/Card.svelte";
  import Img from "../../ui/Img.svelte";

  let klass = 0;

  const onAddToDeck = (card: any): void => {
    const {id, klass, name} = card;
    const {deckId} = $playerStore;
    const deckSlot = $decksStore.deckSlots.find((deckSlot) => deckSlot.id === deckId);

    if (deckSlot.cardsInDeck >= 30) { return; }

    decksStore.update((store) => {
      const deckCard = store.deckCards.find((deckCard) => deckCard.id === id);
      const deckSlot = store.deckSlots.find((deckSlot) => deckSlot.id === deckId);

      if (deckCard) {
        if (deckCard.amount < 2) { deckCard.amount += 1; }
      } else {
        const amount = 1;
        store.deckCards.push({klass, id, name, amount});
      }

      deckSlot.cardsInDeck = store.deckCards.reduce((acc, {amount}) => acc += amount, 0);

      return store;
    });
  };
</script>

<style lang="scss">
  @import "../../shared/styles/variables";

  .cardss {
    display: flex;
    flex-direction: column;
  }
  .cards {
    height: calc($card-height * 2 + $spacing-md * 3);
    padding: $spacing-md;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: $spacing-md;
    box-sizing: border-box;
    overflow-y: scroll;

    scrollbar-width: thin;
    scrollbar-color: dark;
  }
  .cards::-webkit-scrollbar {
    width: 8px;
  }
  .cards::-webkit-scrollbar-track {
    background-color: $dark-grey;
  }
  .cards::-webkit-scrollbar-thumb {
    background-color: $light-grey;
    border: 1px solid transparent;
    border-radius: 8px;
    box-sizing: border-box;
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
    }
  }
</style>

<div class="cardss">
  <div class="klasses">
    <div class="klasses__klass" class:klasses__klass-selected={klass === 0} on:click={() => klass = 0}>
      <Img src="classes/48/{0}.png" alt="A"/>
    </div>
    <div class="klasses__klass" class:klasses__klass-selected={klass === 1} on:click={() => klass = 1}>
      <Img src="classes/48/{1}.png" alt="B"/>
    </div>
    <div class="klasses__klass" class:klasses__klass-selected={klass === 2} on:click={() => klass = 2}>
      <Img src="classes/48/{2}.png" alt="C"/>
    </div>
    <div class="klasses__klass" class:klasses__klass-selected={klass === 3} on:click={() => klass = 3}>
      <Img src="classes/48/{3}.png" alt="D"/>
    </div>
    <div class="klasses__klass" class:klasses__klass-selected={klass === 4} on:click={() => klass = 4}>
      <Img src="classes/48/{4}.png" alt="E"/>
    </div>
  </div>
  <div class="cards">
    {#each cards as card}
      {#if card.klass === klass}
        <div on:click={() => onAddToDeck(card)}>
          <Card {card} health={0} damage={0}/>
        </div>
      {/if}
    {/each}
  </div>
</div>
