<script lang="ts">
  import {gameStore} from "stores";
  import PlayerHandCardComponent from "./PlayerHandCard.svelte";
    import { slide } from "svelte/transition";
</script>

<style>
  .hand-cards {
    position: absolute;
    bottom: -140px;
    left: 50%;
    display: flex;
    transform: translateX(-50%);
  }
</style>

<div class="hand-cards">
  {#key $gameStore.player.hand}
    {#each $gameStore.player.hand as card}
      <div in:slide>
        <PlayerHandCardComponent {card}/>
      </div>
    {/each}
  {/key}
</div>
