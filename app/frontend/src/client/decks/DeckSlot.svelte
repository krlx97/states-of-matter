<script lang="ts">
  import {miscService, socketService} from "services";
  import {playerStore} from "stores/data";
  import {decksStore} from "client/stores";

  import Button from "../../ui/Button.svelte";
  import ProgressBar from "../../ui/ProgressBar.svelte";

  let deck: any;

  const selectDeck = (): void => {
    socketService.selectDeck({deckId: deck.id});
  };

  const changeDeckName = (): void => {
    miscService.openModal("changeDeckName", {id: deck.id});
  };

  const saveDeck = (): void => {
    const cards = $decksStore.deckCards.map(({id, amount}) => ({id, amount}));
    socketService.saveDeck({cards});
  };

  const clearDeck = (): void => {
    $decksStore.deckCards = [];
    $decksStore.cardsInDeck = 0;
  };

  $:progress = (deck.cardsInDeck / 30) * 100;

  export {deck};
</script>

<style lang="scss">
  @import "../../shared/styles/variables";

  .selected {
    border-bottom: 2px solid $purple;
    box-sizing: border-box;
  }

  .deck {
    width: 256px;
    margin-bottom: $spacing-md;
    padding: $spacing-sm;
    display: flex;
    background-color: $light-grey;
    box-sizing: border-box;
    box-shadow: $elevation-sm;
    border-radius: 4px;
    transition: box-shadow 225ms ease-in-out;

    &:hover {
      box-shadow: $elevation-lg;
    }

    &__img {
      
      cursor: pointer;

      // border: 1px solid red;
      // box-sizing: border-box;
    }

    &__footer {
      width: 100%;
      margin-left: $spacing-sm;
      display: flex;
      font-size: $font-md;

      // border: 1px solid green;
      // box-sizing: border-box;

      &__info {
        flex-grow: 1;
      }

      &__actions {
        display: flex;
        // flex-direction: column;
        // align-items: center;
        // justify-content: center;
      }
    }
  }

  .decktitle {
    display: flex;
    justify-content: space-between;
  }
</style>

<div class="deck" class:selected={deck.id === $playerStore.deckId}>
  <img class="deck__img" src="assets/classes/64/{deck.klass}.png" alt="Class" on:click={selectDeck}/>

  <div class="deck__footer">
    <div class="deck__footer__info">

      <div class="decktitle">
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

      <ProgressBar color={"purple"} progress={progress}/>

      <div class="deck__footer__actions">
        <Button style="icon" color="grey" on:click={changeDeckName}>
          <i class="fas fa-edit fa-fw"></i>
        </Button>
        <Button style="icon" color="grey" on:click={clearDeck}>
          <i class="fas fa-trash fa-fw"></i>
        </Button>
        <Button style="icon" color="grey" on:click={saveDeck}>
          <i class="fas fa-save fa-fw"></i>
        </Button>
      </div>
    </div>

    
  </div>
</div>
