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
    hero={heroes.find((hero) => hero.klass === $game.opponent.hero.id)}
    health={$game.opponent.hero.health}
    mana={$game.opponent.hero.mana}
    isHealthBarVisible={true}
    isManaBarVisible={true}
  />
</div>
