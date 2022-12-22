<script lang="ts">
  import {gameStore, playerStore} from "stores";
  import Card from "../../ui/Card.svelte";
</script>

<style>
  .hero {
    position: relative;
    height: var(--card-height);
    width: var(--card-width);
  }

  .player-name {
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

<div class="hero">
  <!-- <div class="player-name">{$playerStore.name}</div> -->
  <Card
    card={$gameStore.player.hero}
    health={$gameStore.player.hero.health}
    mana={$gameStore.player.hero.mana}
    isClient={false}
  />
</div>
