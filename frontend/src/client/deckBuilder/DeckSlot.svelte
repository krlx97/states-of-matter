<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {socketService} from "services";
  import {ProgressBarComponent} from "ui";
  import type {PlayerDeckView} from "@som/shared/types/frontend";

  const dispatch = createEventDispatcher();
  let deck: PlayerDeckView;
  const progress = deck.cardsInDeck / 30 * 100;

  const selectDeck = (): void => {
    socketService.socket.emit("selectDeck", {deckId: deck.id});
    dispatch("toggleDeckSlots");
  };

  export {deck};
</script>

<style>
  .deck-slot {
    padding: var(--spacing-md);
    display: flex;
    align-items: center;
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
    cursor: pointer;
  }

  .deck-slot:hover {
    background: linear-gradient(
      180deg,
      rgba(179, 105, 244, 0.4) 0%,
      rgba(0, 0, 0, 0) 100%
    );
  }

  .deck-slot__img {
    margin-right: var(--spacing-md);
    display: flex;
    align-items: center;
  }

  .deck-slot__info {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .deck-slot__info__title {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
</style>

<div class="deck-slot" on:click={selectDeck} on:keypress={selectDeck}>
  <div class="deck-slot__img">
    <img src="assets/classes/48/{deck.klass}.png" alt="Class"/>
  </div>
  <div class="deck-slot__info">
    <div class="deck-slot__info__title">
      <div>{deck.name}</div>
      <div>{deck.cardsInDeck} / 30</div>
    </div>
    <ProgressBarComponent bars={[{color: "purple", progress}]}/>
  </div>
</div>
