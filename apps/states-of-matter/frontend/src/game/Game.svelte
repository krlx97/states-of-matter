<script lang="ts">
  import {socketService} from "services";
  import {gameStore, playerStore} from "stores";
  import BattleLog from "./BattleLog.svelte";
  import Opponent from "./opponent/Opponent.svelte";
  import Player from "./player/Player.svelte";

  const onEndTurn = (): void => {
    socketService.socket.emit("endTurn");
  };
</script>

<style>
  .game {
    height: 100%;
    width: 100%;
    display: flex;
    background-image: url("/assets/gamebg.png");
    background-position: center;
    background-size: cover;

  }

  .game__timer {
    width: 160px;
    /* display: flex;
    flex-direction: column; */
  }

  .game__main {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }


  /* TIMER */
  .game__timer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .game__timer button {
    
  }

  .bar {
    height: 90%;
    width: 12px;
    /* margin: var(--spacing-md) 0 var(--spacing-md) 0; */
    /* box-sizing: border-box; */
    margin-left: 8px;
    background-color: rgb(31, 31, 31);
  }
  .progress {
    height: 60%;
    width: 8px;
    margin: 2px;
    /* box-sizing: border-box; */
    background-color: rgb(var(--purple));
  }

  .info {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
  }

  .glow {
    animation: glow 1s ease-in-out infinite alternate;
  }

  @keyframes glow {
    from {
      text-shadow: 0 0 0 rgb(var(--purple));
    } to {
      text-shadow: 2px 2px 16px rgb(var(--purple));
    }
  }


  .bgd {
    /* width: 75%; */
    /* text-align: center; */
    padding: var(--spacing-sm) var(--spacing-lg);
    background-color: rgb(var(--dark-grey));
    border-radius: 8px;
    box-sizing: border-box;
  }
</style>

<div class="game">
  <div class="game__logs">
    <BattleLog/>
  </div>
  <div class="game__main">
    <Opponent/>
    <Player/>
  </div>
  <div class="game__timer">
    <div class="info">
      <div class="bgd" class:glow={$gameStore.opponent.name === $gameStore.currentPlayer}>{$gameStore.opponent.name}</div>
      <button on:click={onEndTurn}>END TURN</button>
      <div class="bgd" class:glow={$playerStore.name === $gameStore.currentPlayer}>{$gameStore.player.name}</div>
    </div>
    <div class="bar">
      <div class="progress"></div>
    </div>
  </div>
</div>
