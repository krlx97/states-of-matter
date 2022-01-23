<script lang="ts">
  import {heroes} from "@som/shared/data";
  import {gameStore, selectedCardStore} from "game/stores";
  import {socketService} from "services";
  import {playerStore} from "stores/data";

  import Hero from "../../ui/Hero.svelte";

  const onAttackCard = (): void => {
    if ($gameStore.currentPlayer !== $playerStore.username) { return; }

    let attacker: any; // ;w;
    const attacked = "hero";

    if ($selectedCardStore.field === "hero") {
      attacker = "hero";
    } else {
      attacker = `minion${$selectedCardStore.field}`;
    }

    socketService.attackCard({attacker, attacked});
  };
</script>

<style lang="scss">
  @import "../../shared/styles/variables";

  .hero {
    height: $card-height;
    width: $card-width;
  }
</style>

<div class="hero" on:click={onAttackCard}>
  <Hero
    hero={heroes.find((hero) => hero.klass === $gameStore.opponent.hero.id)}
    health={$gameStore.opponent.hero.health}
    mana={$gameStore.opponent.hero.mana}
    isHealthBarVisible={true}
    isManaBarVisible={true}
  />
</div>
