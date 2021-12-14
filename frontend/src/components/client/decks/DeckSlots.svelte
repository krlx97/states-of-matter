<script lang="ts">
  import {miscService, socketService} from "services";
  import {playerStore} from "stores/data";
  import {decksStore} from "stores/view";

  const selectDeck = (deckId: number): void => {
    socketService.emit("selectDeck", {deckId});
  };

  const changeDeckName = (id: number): void => {
    miscService.openModal("changeDeckName", {id});
  };
</script>

<style lang="scss">
  @import "../../../styles/variables";

  .decks {
    padding: $spacing-md;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }

  .selected {
    border-bottom: 2px solid $purple;
    box-sizing: border-box;
  }

  .deck {
    width: 256px;
    margin-bottom: $spacing-md;
    padding: $spacing-sm;
    display: flex;
    background-color: $dark-grey;
    box-sizing: border-box;
    box-shadow: $elevation-sm;
    transition: box-shadow 225ms ease-in-out;

    &:hover {
      box-shadow: $elevation-lg;
      cursor: pointer;
    }

    &__img {
      height: 64px;
      width: 64px;
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

<div class="decks">
  {#each $decksStore.deckSlots as deck}

    <div class="deck" class:selected={deck.id === $playerStore.deckId} on:click={() => selectDeck(deck.id)}>
      <img class="deck__img" src="assets/classes/{deck.klass}.png" alt="Class"/>

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
          <button class="btn--icon" on:click={() => changeDeckName(deck.id)}>
            <i class="fas fa-edit fa-fw"></i>
          </button>
        </div>
      </div>
    </div>

  {/each}
</div>
