<script lang="ts">
  import DeckCard from "./DeckCard.svelte";
  import {eccService, socketService} from "services";
  import {playerStore} from "stores/data";
  import deckStore from "./stores/deckStore";

  const saveDeck = (): void => {
    const {public_key, private_key} = $playerStore;
    const cards = $deckStore.cards.map(({id, amount}) => ({id, amount}));
    const signature = eccService.sign(`savedeck:${cards.length}`, private_key);

    socketService.emit("saveDeck", {cards, public_key, signature});
  };

  const removeFromDeck = (event): void => {
    deckStore.update((store) => {
      const deckCard = store.cards.find((deckCard) => deckCard.id === event.detail);

      if (deckCard.amount > 1) {
        deckCard.amount -= 1;
      } else {
        const i = store.cards.indexOf(deckCard);
        store.cards.splice(i, 1);
      }

      store.cardsAmount = $deckStore.cards.reduce((acc, {amount}) => acc += amount, 0);

      return store;
    });
  };

  const clearDeck = (): void => {
    $deckStore.cards = [];
    $deckStore.cardsAmount = 0;
  };
</script>

<style lang="scss">
    @import "../../../../styles/variables";

  .deck {
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
    height: calc($game-card-height * 3 + $spacing-md * 4);
    width: calc(248px + 16px * 2);
    overflow-y: scroll;
    box-sizing: border-box;
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
</style>

<div class="deck">
  <div class="deck__toolbar">
    <div>
      {$deckStore.cardsAmount} / 30
    </div>
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
    {#each $deckStore.cards as card}
      <DeckCard {card} on:removeFromDeck={removeFromDeck}/>
    {/each}
  </div>
</div>
