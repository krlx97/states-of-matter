<script lang="ts">
  import {gameStore} from "stores";
  import Hero from "../../ui/Hero.svelte";
</script>

<style lang="scss">
  @import "../../shared/styles/variables";

  .hero {
    height: $card-height;
    width: $card-width;
  }
</style>

<div class="hero">
  <Hero
    hero={$gameStore.player.hero}
    health={$gameStore.player.hero.health}
    mana={$gameStore.player.hero.mana}
    isHealthBarVisible={true}
    isManaBarVisible={true}
  />
</div>
