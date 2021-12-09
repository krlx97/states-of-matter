<script lang="ts">
  import {eccService, miscService, socketService} from "services";
  import {playerStore} from "stores/data";
  import {get} from "svelte/store";

  let deck;

  const selectDeck = (id: number): void => {
    const {public_key, private_key} = $playerStore;
    const deck_id = id;
    const signature = eccService.sign(`selectdeck:${deck_id}`, private_key);

    socketService.emit("selectDeck", {deck_id, public_key, signature});
  };

  const changeDeckName = (id: number): void => {
    miscService.openModal("changeDeckName", {id});
  };

  const changeDeckClass = (id: number): void => {
    miscService.openModal("setDeckKlass", {id});
  };

  export {deck};
</script>

<style lang="scss">
  @import "../../../../styles/variables";

  .deck {
    margin: 0 $spacing-md $spacing-md 0;
    background-color: $dark-grey;
    box-shadow: $elevation-sm;
    transition: box-shadow 225ms ease-in-out;

    &:hover { box-shadow: $elevation-lg; }

    &__img {
      height: 160px;
      width: 160px;
      cursor: pointer;
    }

    &__footer {
      width: 100%;
      padding: $spacing-sm;
      display: flex;
      box-sizing: border-box;
      font-size: $font-md;

      &__info {
        flex-grow: 1;
      }

      &__actions {
        display: flex;
        align-items: center;
      }
    }
  }
</style>

<div class="deck">
  <img
    on:click={() => selectDeck(deck.id)}
    class="deck__img"
    src="assets/classes/{deck.klass}.png"
    alt="Class">

  <div class="deck__footer">
    <div class="deck__footer__info">
      <div>{deck.name}</div>
      <div>
        {deck.cardsInDeck} / 30
        {#if deck.cardsInDeck < 30}
          <i class="fas fa-exclamation fa-fw"></i>
        {:else}
          <i class="fas fa-check fa-fw"></i>
        {/if}
      </div>
    </div>

    <div class="deck__footer__actions">
      <button class="btn--icon" on:click={() => changeDeckClass(deck.id)}>
        <i class="fas fa-exchange-alt fa-fw"></i>
      </button>
      <button class="btn--icon" on:click={() => changeDeckName(deck.id)}>
        <i class="fas fa-edit fa-fw"></i>
      </button>
    </div>
  </div>
</div>
