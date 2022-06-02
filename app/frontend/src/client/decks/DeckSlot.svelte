<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {miscService, socketService} from "services";
  import {decksStore, playerStore} from "stores";
  import Button from "../../ui/Button.svelte";

  let areActionButtonsVisible = false;
  let deck: {
    id: number;
    name: string;
    klass: number;
    cardsInDeck: number;
  } = undefined;
  const dispatch = createEventDispatcher();

  $: progress = deck ? (deck.cardsInDeck / 30) * 100 : ($decksStore.selectedDeck.cardsInDeck / 30) * 100;

  const selectDeck = () => {
    socketService.socket.emit("selectDeck", {deckId: deck.id});
    dispatch("toggleDeckSlots");
  };

  const changeDeckName = () => {
    const {id} = $decksStore.selectedDeck;
    miscService.openModal("changeDeckName", {id});
  };

  const saveDeck = () => {
    const cards = $decksStore.deckCards.map(({id, amount}) => ({id, amount}));
    socketService.socket.emit("saveDeck", {cards});
  };

  const clearDeck = () => {
    $decksStore.deckCards = [];
    $decksStore.selectedDeck.cardsInDeck = 0;
  };

  const switchDeck = (): void => {
    dispatch("toggleDeckSlots");
  };

  export {areActionButtonsVisible, deck};
</script>

<style lang="scss">
  @import "../../shared/styles/variables";

  .deck {
    position: relative;
    height: 96px;
    width: 256px;
    // margin: $spacing-md;
    padding: $spacing-md;
    display: flex;
    // background-image: url(/assets/card.png);
    background-color: $light-grey;
    border-radius: 4px;
    box-sizing: border-box;
    box-shadow: $elevation-sm;

    &__img {
      margin-right: $spacing-md;
    }

    &__info {
      // height: 96px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      // justify-content: space-between;

      &__title {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      &__actions {
        align-self: flex-end;
      }
    }
  }

  .decktitle {
    display: flex;
    justify-content: space-between;
  }

  .bar {
    height: 4px;
    width: 100%;
    margin-top: $spacing-sm;
    background-color: white;
    border-radius: 4px;

    &__progress {
      height: 4px;
      background-color: $purple;
      border-radius: 4px;
      transition: width 250ms linear;
    }
  }
</style>

<div class="deck">
  <img class="deck__img" src="assets/classes/64/{deck ? deck.klass : $decksStore.selectedDeck.klass}.png" alt="Class"/>
  <div class="deck__info">
    <div class="deck__info__title">
      <div>{deck ? deck.name : $decksStore.selectedDeck.name}</div>
      <div>{deck ? deck.cardsInDeck : $decksStore.selectedDeck.cardsInDeck} / 30</div>
    </div>
    <div class="bar">
      <div class="bar__progress" style="width: {progress}%"></div>
    </div>
    {#if areActionButtonsVisible}
      <div class="deck__info__actions">
        <Button style="icon" color="grey" on:click={changeDeckName}>
          <img src="assets/icons/write.png" alt="Rename"/>
        </Button>
        <Button style="icon" color="grey" on:click={clearDeck}>
          <img src="assets/icons/delete.png" alt="Delete"/>
        </Button>
        <Button style="icon" color="grey" on:click={saveDeck}>
          <img src="assets/icons/save.png" alt="Save"/>
        </Button>
        <Button style="icon" color="grey" on:click={switchDeck}>
          <img src="assets/icons/down.png" alt="Switch"/>
        </Button>
      </div>
    {:else}
      <Button style="icon" color="grey" on:click={selectDeck}>
        <img src="assets/icons/check.png" alt="Check"/>
      </Button>
    {/if}
  </div>
</div>
