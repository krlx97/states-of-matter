<script lang="ts">
  import {heroes} from "@som/shared/data";
  import {socketService} from "services";
  import {playerStore} from "stores"
  import Hero from "../../ui/Hero.svelte";
  import type {CardKlass} from "@som/shared/enums";

  const setDeckKlass = (klass: CardKlass) => {
    const {deckId} = $playerStore;
    socketService.socket.emit("setDeckKlass", {deckId, klass});
  };
</script>

<style lang="scss">
  @import "../../shared/styles/variables";

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
