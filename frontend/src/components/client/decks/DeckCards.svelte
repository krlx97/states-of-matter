<script lang="ts">
  import {socketService} from "services";
import { playerStore } from "stores/data";
  import {decksStore} from "stores/view";

  const saveDeck = (): void => {
    const cards = $decksStore.deckCards.map(({id, amount}) => ({id, amount}));
    socketService.emit("saveDeck", {cards});
  };

  const removeFromDeck = (id: number): void => {
    const {deckId} = $playerStore;

    decksStore.update((store) => {
      const deckCard = store.deckCards.find((deckCard) => deckCard.id === id);
      const deckSlot = store.deckSlots.find((deckSlot) => deckSlot.id === deckId);

      if (deckCard.amount > 1) {
        deckCard.amount -= 1;
      } else {
        const i = store.deckCards.indexOf(deckCard);
        store.deckCards.splice(i, 1);
      }

      deckSlot.cardsInDeck = store.deckCards.reduce((acc, {amount}) => acc += amount, 0);
      // deckSlot.cardsInDeck -= 1;

      return store;
    });
  };

  const clearDeck = (): void => {
    $decksStore.deckCards = [];
    $decksStore.cardsInDeck = 0;
  };
</script>

<style lang="scss">
    @import "../../../styles/variables";

  .deck {
    height: 100%;
    position: relative;
    width: calc(256px + $spacing-md * 2);
    display: flex;
    flex-direction: column;
  }
  .deck__toolbar {
    height: 64px;
    padding: 0 $spacing-md;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .deck__cards {
    margin-top: $spacing-md;
    // height: calc($game-card-height * 3 + $spacing-md * 4);
    width: calc(248px + 16px * 2);
    overflow-y: scroll;
    box-sizing: border-box;
    scrollbar-width: thin;
    scrollbar-color: dark;
  }
  .deck__cards::-webkit-scrollbar {
    width: 8px;
  }
  .deck__cards::-webkit-scrollbar-track {
    background-color: transparent;
  }
  .deck__cards::-webkit-scrollbar-thumb {
    background-color: $dark-grey;
    border: 1px solid transparent;
    border-radius: 8px;
    box-sizing: border-box;
  }

  .card {
    margin: 0 $spacing-md $spacing-md $spacing-md;
    display: flex;
    align-items: center;
    background-color: $dark-grey;
    border-radius: 4px;
    box-shadow: $elevation-sm;
    cursor: pointer;
    // overflow: hidden;

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

<div class="deck">
  <div class="deck__toolbar">
    <!-- <div>
      {$decksStore.deckCards.length} / 30
    </div> -->
    <div>
      <button class="btn--icon" title="Clear deck" on:click={clearDeck}>
        <i class="fas fa-trash fa-fw"></i>
      </button>
      <button class="btn--icon" title="Save deck" on:click={saveDeck}>
        <i class="fas fa-save fa-fw"></i>
      </button>
    </div>
  </div>
  <div class="deck__cards">
    {#each $decksStore.deckCards as card}
      <div class="card" on:click={() => removeFromDeck(card.id)}>
        <img
          class="card__img"
          src="assets/cards/{card.klass}/{card.id}.jpg"
          alt={card.name}/>
        <div class="card__text">
          <span>{card.name}</span><br>
          <span>{card.amount} / 2</span>
        </div>
      </div>
    {/each}
  </div>
</div>
