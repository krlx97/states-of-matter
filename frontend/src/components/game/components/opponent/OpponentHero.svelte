<script lang="ts">
  import {HeroComponent} from "components";
  import {heroes} from "data";
  import {gameStore, selectedCardStore} from "game/stores";
  import {socketService} from "services";
import { playerStore } from "stores/data";

  const onAttackCard = (): void => {
    if ($gameStore.currentPlayer !== $playerStore.username) { return; }

    let attacker: string;
    const attacked = "hero";

    if ($selectedCardStore.field === "hero") {
      attacker = "hero";
    } else {
      attacker = `minion${$selectedCardStore.field}`;
    }

    socketService.emit("attackCard", {attacker, attacked});
  };
</script>

<style lang="scss">
  @import "../../../../styles/variables";

  .hero {
    height: $card-height;
    width: $card-width;
  }
</style>

<div class="hero" on:click={onAttackCard}>
  <HeroComponent
    hero={heroes.find((hero) => hero.klass === $gameStore.opponent.hero.id)}
    health={$gameStore.opponent.hero.health}
    mana={$gameStore.opponent.hero.mana}
    isHealthBarVisible={true}
    isManaBarVisible={true}
  />
</div>
