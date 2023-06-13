<script lang="ts">
  import {socketService} from "services";
  import {gameStore, selectedCardStore, playerStore} from "stores";
  import {CardComponent} from "ui";

  $: isAttackable = $selectedCardStore.field !== undefined;

  const onAttackHero = (): void => {
    const attacker = $selectedCardStore.field;

    if ($gameStore.currentPlayer !== $playerStore.name) { return; }
    if (!attacker) { return; }

    socketService.socket.emit("attackHero", {attacker});
  };
</script>

<style>
  .hero {
    /* height: 216px;
    width: 144px; */
    border: 2px solid rgb(96, 133, 29);
    border-radius: 8px;
  }

.isAttackable {
    /* animation: glow2 1s cubic-bezier(var(--ease-in-out-quart)) infinite; */
    position: relative;
    cursor: pointer;
  }
 .isAttackable::after {
    content: "";
    position: absolute;
    border-radius: 8px;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    box-shadow: 0 0 8px 2px rgb(var(--green));
    animation: isAttackableGlow 1s cubic-bezier(var(--ease-in-out-quad)) infinite alternate;
  }

  @keyframes isAttackableGlow {
    from {opacity: 0;}
    to {opacity: 1;}
  }
</style>

<div class="hero" class:isAttackable on:click={onAttackHero} on:keypress={onAttackHero}>
  <CardComponent
    card={$gameStore.opponent.hero}
    health={$gameStore.opponent.hero.health}
    mana={$gameStore.opponent.hero.mana}
    isClient={false}
  />
</div>
