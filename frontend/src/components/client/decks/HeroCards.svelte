<script lang="ts">
  import {Hero} from "components";
  import {heroes} from "data";
  import {decksStore} from "stores/view";
</script>

<style lang="scss">
  @import "../../../styles/variables";

  .decks {
    display: flex;
    padding: 0 $spacing-md $spacing-md 0;
    box-sizing: border-box;

    &__hero {
      margin: $spacing-md 0 0 $spacing-md;
    }
  }

  .deck {
    margin: 0 $spacing-md $spacing-md 0;
    background-color: $dark-grey;
    box-shadow: $elevation-sm;
    transition: box-shadow 225ms ease-in-out;

    &:hover { box-shadow: $elevation-lg; }

    &__img {
      height: 64px;
      width: 64px;
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

<div class="decks">
  {#each $decksStore.deckSlots as deck}
    <div class="decks__hero">
      <Hero hero={heroes.get(deck.klass)}/>
    </div>
  {/each}
</div>
