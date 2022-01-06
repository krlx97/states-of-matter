<script lang="ts">
  import {HeroComponent} from "components";
  import {heroes} from "data";
  import {gameStore, selectedCardStore} from "game/stores";
  import {playerStore} from "stores/data";

  $: isSelected = $selectedCardStore.field === "hero";

  const onAttackSelect = (): void => {
    if ($gameStore.currentPlayer !== $playerStore.username) { return; }
    if ($selectedCardStore.hand.gid) { $selectedCardStore.hand.gid = 0; }

    if ($selectedCardStore.field === "hero") {
      $selectedCardStore.field = "";
    } else {
      $selectedCardStore.field = "hero";
    }
  };
</script>

<style lang="scss">
  @import "../../../../styles/variables";

  .isSelected {
    box-shadow: 0 0 4px 2px $purple;
  }

  .hero {
    height: $card-height;
    width: $card-width;
  }
</style>

<div class="hero" class:isSelected on:click={onAttackSelect}>
  <HeroComponent
    hero={heroes.find((hero) => hero.klass === $gameStore.player.hero.id)}
    health={$gameStore.player.hero.health}
    mana={$gameStore.player.hero.mana}
    isHealthBarVisible={true}
    isManaBarVisible={true}
  />
</div>
