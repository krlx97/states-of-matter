<script lang="ts">
  import {socketService} from "services";
  import {gameStore, selectedCardStore, playerStore} from "stores";
  import Hero from "../../ui/HeroSm.svelte";

  const onAttackHero = (): void => {
    const attacker = $selectedCardStore.field;

    if ($gameStore.currentPlayer !== $playerStore.username) { return; }
    if (!attacker) { return; }

    socketService.socket.emit("attackHero", {attacker});
  };
</script>

<style lang="scss">
  @import "../../shared/styles/variables";

  .hero {
    height: $card-height-sm;
    width: $card-width-sm;
    overflow: hidden;
  }
</style>

<div class="hero" on:click={onAttackHero}>
  <Hero
    hero={$gameStore.opponent.hero}
    health={$gameStore.opponent.hero.health}
    mana={$gameStore.opponent.hero.mana}
    isHealthBarVisible={true}
    isManaBarVisible={true}
  />
</div>
