<script lang="ts">
  import {Hero} from "components";
  import {heroes} from "data";
  import type {Klass} from "enums";
  import {socketService} from "services";
  import {playerStore} from "stores/data";
  import {decksStore} from "stores/view";

  const setDeckKlass = (klass: Klass) => {
    const {deckId} = $playerStore;
    socketService.emit("setDeckKlass", {deckId, klass});
  };
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
</style>

<div class="decks">
  {#each heroes as hero}
    <div class="decks__hero" on:click={() => setDeckKlass(hero.klass)}>
      <Hero {hero}/>
    </div>
  {/each}
</div>
