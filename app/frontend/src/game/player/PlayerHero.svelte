<script lang="ts">
  import {heroes} from "@som/shared/data";
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
    hero={heroes.find((hero) => hero.klass === $gameStore.player.hero.id)}
    health={$gameStore.player.hero.health}
    mana={$gameStore.player.hero.mana}
    isHealthBarVisible={true}
    isManaBarVisible={true}
  />
</div>
