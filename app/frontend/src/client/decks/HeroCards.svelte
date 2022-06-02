<script lang="ts">
  import {heroes} from "@som/shared/data";
  import {socketService} from "services";
  import {playerStore} from "stores"
  import Hero from "../../ui/Hero.svelte";
  import type {CardKlass} from "@som/shared/enums";

  const setDeckKlass = (klass: CardKlass): void => {
    const {deckId} = $playerStore;
    socketService.socket.emit("setDeckKlass", {deckId, klass});
  };
</script>

<style lang="scss">
  @import "../../shared/styles/variables";

  .heroes {
    display: flex;
    padding: 0 $spacing-sm $spacing-sm 0;
    box-sizing: border-box;

    &__hero {
      margin: $spacing-sm 0 0 $spacing-sm;
    }
  }
</style>

<div class="heroes">
  {#each heroes as hero}
    <div class="heroes__hero" on:click={() => setDeckKlass(hero.klass)}>
      <Hero {hero}/>
    </div>
  {/each}
</div>
