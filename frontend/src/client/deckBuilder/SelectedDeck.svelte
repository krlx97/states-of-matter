<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {modalService, socketService} from "services";
  import {deckStore} from "stores";
  import {ProgressBarComponent} from "ui";
  import ChangeDeckNameComponent from "./modals/ChangeDeckName.svelte";

  $: progress = $deckStore.cardsInDeck / 30 * 100;

  const dispatch = createEventDispatcher();

  const clearDeck = (): void => {
    $deckStore.cards = [];
    $deckStore.cardsInDeck = 0;
  };

  const changeDeckName = (): void => {
    modalService.open(ChangeDeckNameComponent);
  };

  const saveDeck = (): void => {
    const {id, name, klass} = $deckStore;
    const cards = $deckStore.cards.map(({id, amount}) => ({id, amount}));
    const deck = {id, name, klass, cards};

    socketService.socket.emit("saveDeck", {deck});
  };

  const switchDeck = (): void => {
    dispatch("toggleDeckSlots");
  };
</script>

<style>
  .selected-deck {
    padding: var(--spacing-md);
    display: flex;
    background: linear-gradient(
      180deg,
      rgba(179, 105, 244, 0.1) 0%,
      rgba(0, 0, 0, 0) 100%
    );
    border: 1px solid;
    border-right-width: 0;
    border-left-width: 0;
    border-image: linear-gradient(
      90deg,
      rgba(63,63,63,1) 0%,
      rgba(255,255,255,1) 50%,
      rgba(63,63,63,1) 100%
    ) 1;
    box-sizing: border-box;
  }

  .selected-deck__img {
    margin-right: var(--spacing-md);
    display: flex;
    align-items: center;
  }

  .selected-deck__info {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .selected-deck__info__title {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .selected-deck__info__actions {
    display: flex;
    justify-content: center;
    gap: var(--spacing-sm);
  }
</style>

<div class="selected-deck">

  <div class="selected-deck__img">
    <img src="assets/classes/48/{$deckStore.klass}.png" alt="Class"/>
  </div>

  <div class="selected-deck__info">

    <div class="selected-deck__info__title">
      <div>{$deckStore.name}</div>
      <div>{$deckStore.cardsInDeck}/30</div>
    </div>

    <ProgressBarComponent bars="{[{
      color: "purple",
      progress
    }]}"/>

    <div class="selected-deck__info__actions">
      <button class="button-icon" on:click="{clearDeck}">
        <i class="fa-solid fa-trash"></i>
      </button>
      <button class="button-icon" on:click="{changeDeckName}">
        <i class="fa-solid fa-pen-to-square"></i>
      </button>
      <button class="button-icon" on:click="{saveDeck}">
        <i class="fa-solid fa-floppy-disk"></i>
      </button>
      <button class="button-icon" on:click="{switchDeck}">
        <i class="fa-solid fa-arrows-rotate"></i>
      </button>
    </div>

  </div>

</div>
