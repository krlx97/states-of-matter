<script lang="ts">
  import {cards} from "@som/shared/data";
  import {miscService} from "services";
  import {decksStore, playerStore} from "stores";
  import Card from "../../ui/Card.svelte";
  import Img from "../../ui/Img.svelte";

  let selectedKlass = 0;
  const klasses = [0, 1, 2, 3, 4];

  const onAddToDeck = (card: any): void => {
    const {id, klass, name, manaCost} = card;
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
        store.deckCards.push({klass, id, name, amount, manaCost});
      }

      deckSlot.cardsInDeck = store.deckCards.reduce((acc, {amount}) => acc += amount, 0);

      store.deckCards.sort((a, b) => a.manaCost - b.manaCost);

      return store;
    });
  };

  const onViewLore = (card: any): void => {
    miscService.openModal("cardLore", card);
  };
</script>

<style lang="scss">
  @import "../../shared/styles/variables";

  .cards {
    display: flex;
    flex-direction: column;

    &__klasses {
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

    &__list {
      height: calc($card-height * 2 + $spacing-sm * 3);
      padding: $spacing-sm;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: repeat(3, 1fr);
      gap: $spacing-sm;
      box-sizing: border-box;
      overflow-y: scroll;
      scrollbar-width: thin;
      scrollbar-color: dark;

      &::-webkit-scrollbar {
        width: 8px;
      }
      &::-webkit-scrollbar-track {
        background-color: $dark-grey;
      }
      &::-webkit-scrollbar-thumb {
        background-color: $light-grey;
        border: 1px solid transparent;
        border-radius: 8px;
        box-sizing: border-box;
      }
    }
  }
</style>

<div class="cards">
  <div class="cards__klasses">
    {#each klasses as klass}
      <div
        class="cards__klasses__klass"
        class:cards__klasses__klass-selected={klass === selectedKlass}
        on:click={() => selectedKlass = klass}
      >
        <Img src="classes/48/{klass}.png" alt="Klass {klass}"/>
      </div>
    {/each}
  </div>
  <div class="cards__list">
    {#each cards as card}
      {#if card.klass === selectedKlass}
        <div
          on:click={() => onAddToDeck(card)}
          on:contextmenu|preventDefault={() => onViewLore(card)}
        >
          <Card {card} health={0} damage={0}/>
        </div>
      {/if}
    {/each}
  </div>
</div>
