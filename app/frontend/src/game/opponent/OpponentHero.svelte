<script lang="ts">
  import {heroes} from "@som/shared/data";
  import {socketService} from "services";
  import {gameStore, selectedCardStore, playerStore} from "stores";
  import Hero from "../../ui/HeroSm.svelte";

  const onAttackCard = () => {
    if ($gameStore.currentPlayer !== $playerStore.username) { return; }

    let attacker: any; // ;w;
    const attacked = "hero";

    if ($selectedCardStore.field === "hero") {
      attacker = "hero";
    } else {
      attacker = `minion${$selectedCardStore.field}`;
    }

    socketService.socket.emit("attackCard", {attacker, attacked});
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

<div class="hero" on:click={onAttackCard}>
  <Hero
    hero={heroes.find((hero) => hero.klass === $gameStore.opponent.hero.id)}
    health={$gameStore.opponent.hero.health}
    mana={$gameStore.opponent.hero.mana}
    isHealthBarVisible={true}
    isManaBarVisible={true}
  />
</div>
