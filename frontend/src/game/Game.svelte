<script lang="ts">
  import BattleLogsComponent from "./BattleLogs/BattleLogs.svelte";
  import GameTimerComponent from "./GameTimer.svelte";
  import OpponentComponent from "./opponent/Opponent.svelte";
  import PlayerComponent from "./player/Player.svelte";
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
</style>

<div class="game">
  <BattleLogsComponent/>
  <div class="game__main">
    <OpponentComponent/>
    <PlayerComponent/>
  </div>
  <GameTimerComponent/>
</div>
