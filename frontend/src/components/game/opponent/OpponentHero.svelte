<script lang="ts">
  import {Hero} from "components";
  import {heroes} from "data";
  import {gameStore, playerStore} from "stores/data";
</script>

<style lang="scss">
  @import "../../../styles/variables";

  .hero {
    height: $game-field-height;
    width: $game-field-width;
  }
</style>

<div class="hero">
  {#if $gameStore.playerA.username !== $playerStore.username}
    <Hero hero={heroes.find((hero) => hero.klass === $gameStore.playerA.hero.id)}/>
  {:else if $gameStore.playerB.username !== $playerStore.username}
    <Hero hero={heroes.find((hero) => hero.klass === $gameStore.playerB.hero.id)}/>
  {/if}
</div>
