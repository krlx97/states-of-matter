<script lang="ts">
  import { CardComponent } from "ui";
import BattleLogsComponent from "./BattleLogs/BattleLogs.svelte";
  import GameTimerComponent from "./GameTimer.svelte";
  import OpponentComponent from "./opponent/Opponent.svelte";
  import PlayerComponent from "./player/Player.svelte";
    import { gameStore } from "stores";

</script>

<style>
  .game {
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    background-image: url("/assets/gamebg.png");
    background-position: center;
    background-size: cover;
    overflow: hidden;
  }

  .game__main {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .trap-trigger {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    /* background-color: rgba(var(--solid), 0.95); */
    z-index: 1000;
  }
</style>

<div class="game">
  <!-- <div class="trap-trigger">
    <CardComponent card={$gameStore.player.trap}/>
  </div> -->
  <BattleLogsComponent/>
  <div class="game__main">
    <OpponentComponent/>
    <PlayerComponent/>
  </div>
  <GameTimerComponent/>
</div>
