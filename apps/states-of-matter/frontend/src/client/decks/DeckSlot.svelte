<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {miscService, socketService} from "services";
  import {decksStore} from "stores";

  let areActionButtonsVisible = false;
  let deck: {
    id: number;
    name: string;
    klass: number;
    cardsInDeck: number;
  } = undefined;
  const dispatch = createEventDispatcher();

  $: progress = deck ? (deck.cardsInDeck / 30) * 100 : ($decksStore.selectedDeck.cardsInDeck / 30) * 100;

  const selectDeck = (): void => {
    socketService.socket.emit("selectDeck", {deckId: deck.id});
    dispatch("toggleDeckSlots");
  };

  const changeDeckName = (): void => {
    const {id} = $decksStore.selectedDeck;
    miscService.openModal("changeDeckName", {id});
  };

  const saveDeck = (): void => {
    const cards = $decksStore.deckCards.map(({id, amount}) => ({id, amount}));
    socketService.socket.emit("saveDeck", {cards});
  };

  const clearDeck = (): void => {
    $decksStore.deckCards = [];
    $decksStore.selectedDeck.cardsInDeck = 0;
  };

  const switchDeck = (): void => {
    dispatch("toggleDeckSlots");
  };

  export {areActionButtonsVisible, deck};
</script>

<style>
  .deck {
    position: relative;
    height: 96px;
    /* width: 256px; */
    padding: var(--spacing-md);
    display: flex;
    /* background-image: url(/assets/card.png); */
    /* background-color: rgb(var(--light-grey)); */
    /* border-radius: 4px; */
    box-sizing: border-box;
    /* box-shadow: var(--elevation-sm); */
    border-top-width: 1px;
    border-right-width: 0;
    border-bottom-width: 1px;
    border-left-width: 0;
    border-style: solid;
    border-image: linear-gradient(
      90deg,
      rgba(63,63,63,1) 0%,
      rgba(255,255,255,1) 50%,
      rgba(63,63,63,1) 100%
    ) 1;
    background: linear-gradient(
      180deg,
      rgba(179, 105, 244, 0.1) 0%,
      rgba(0, 0, 0, 0) 100%
      /* rgba(179, 105, 244, 0.1) 100% */
    );
  }

  .deck__img {
    margin-right: var(--spacing-md);
    height: 64px;
    width: 64px;
  }

  .deck__info {
    padding-right: var(--spacing-md);
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
  }

  .deck__info__title {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .deck__info__actions {
    margin-top: var(--spacing-sm);
    /* align-self: flex-end; */
    display: flex;
  }

  .bar {
    height: 4px;
    width: 100%;
    /* margin-top: var(--spacing-sm); */
    background-color: white;
    border-radius: 4px;
  }

  .bar__progress {
    height: 4px;
    background-color: rgb(var(--purple));
    border-radius: 4px;
    transition: width 250ms linear;
  }

  .margin {
    margin-right: 0.5em;
  }
</style>

<div class="deck">
  <img class="deck__img" src="assets/classes/48/{deck ? deck.klass : $decksStore.selectedDeck.klass}.png" alt="Class"/>
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
        <button class="button--icon margin" on:click={clearDeck}>
          <img src="assets/icons/delete.png" alt="Clear"/>
        </button>
        <button class="button--icon margin" on:click={changeDeckName}>
          <img src="assets/icons/write.png" alt="Rename"/>
        </button>
        <button class="button--icon margin" on:click={saveDeck}>
          <img src="assets/icons/save.png" alt="Save"/>
        </button>
        <!-- <button class="button--icon" on:click={switchDeck}>
          <img src="assets/icons/down.png" alt="Switch"/>
        </button> -->
      </div>
    {:else}
      <button class="button-icon" on:click={selectDeck}>
        <img src="assets/icons/check.png" alt="Select"/>
      </button>
    {/if}
  </div>
</div>
