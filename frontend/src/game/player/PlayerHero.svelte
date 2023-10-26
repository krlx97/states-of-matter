<script lang="ts">
  import {gameStore} from "stores";
  import {CardComponent} from "ui";
</script>

<style>
  .hero {
    position: relative;
    /* border: 2px solid rgb(96, 133, 29);
    border-radius: 8px; */
    z-index: 0;
  }
</style>

<div class="hero">
  <CardComponent
    card={$gameStore.player.hero}
    health={$gameStore.player.hero.health}
    mana={$gameStore.player.hero.mana}
    isClient={false}
  />
</div>
