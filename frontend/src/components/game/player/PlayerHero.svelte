<script lang="ts">
  import {HeroComponent} from "components";
  import {heroes} from "data";
  import {game} from "game/stores";
</script>

<style lang="scss">
  @import "../../../styles/variables";

  .hero {
    height: $card-height;
    width: $card-width;
  }
</style>

<div class="hero">
  <HeroComponent
    hero={heroes.find((hero) => hero.klass === $game.player.hero.id)}
    health={$game.player.hero.health}
    mana={$game.player.hero.mana}
    isHealthBarVisible={true}
    isManaBarVisible={true}
  />
</div>
