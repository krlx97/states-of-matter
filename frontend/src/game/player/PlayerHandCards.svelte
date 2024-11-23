<script lang="ts">
  import {gameStore} from "stores";
  import PlayerHandCardComponent from "./PlayerHandCard.svelte";
</script>

<style>
  .hand-cards {
    position: absolute;
    bottom: -140px;
    left: 50%;
    display: flex;
    transform: translateX(-50%);
    z-index: 10;
  }
</style>

<div class="hand-cards">
  {#key $gameStore.player.hand}
    {#each $gameStore.player.hand as card}
      <PlayerHandCardComponent {card}/>
    {/each}
  {/key}
</div>
