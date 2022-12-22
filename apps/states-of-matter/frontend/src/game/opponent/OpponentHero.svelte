<script lang="ts">
  import {socketService} from "services";
  import {gameStore, selectedCardStore, playerStore} from "stores";
  import Card from "../../ui/Card.svelte";

  const onAttackHero = (): void => {
    const attacker = $selectedCardStore.field;

    if ($gameStore.currentPlayer !== $playerStore.name) { return; }
    if (!attacker) { return; }

    socketService.socket.emit("attackHero", {attacker});
  };
</script>

<style>
  .hero {
    height: 216px;
    width: 144px;
  }

  .opponent-name {
    position: absolute;
    top: -64px;
    left: 50%;
    /* width: 75%; */
    text-align: center;
    padding: var(--spacing-sm);
    background-color: rgb(var(--dark-grey));
    border-radius: 4px;
    box-sizing: border-box;
    box-shadow: var(--elevation-sm);
    transform: translateX(-50%);
  }
</style>

<div class="hero" on:click={onAttackHero} on:keypress={onAttackHero}>
  <!-- <div class="opponent-name">{$gameStore.opponent.name}</div> -->
  <Card
    card={$gameStore.opponent.hero}
    health={$gameStore.opponent.hero.health}
    mana={$gameStore.opponent.hero.mana}
    isClient={false}
  />
</div>
