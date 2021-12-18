<script lang="ts">
  import {HeroComponent} from "components";
  import {heroes} from "data";
  import {gameStore, playerStore} from "stores/data";
</script>

<style lang="scss">
  @import "../../../styles/variables";

  .hero {
    height: $game-card-height;
    width: $game-card-width;
  }
</style>

<div class="hero">
  {#if $gameStore.playerA.username !== $playerStore.username}
    <HeroComponent hero={heroes.find((hero) => hero.klass === $gameStore.playerA.hero.id)}/>
  {:else if $gameStore.playerB.username !== $playerStore.username}
    <HeroComponent hero={heroes.find((hero) => hero.klass === $gameStore.playerB.hero.id)}/>
  {/if}
</div>
