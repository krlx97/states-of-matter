<script lang="ts">
  import {socketService, soundService} from "services";
  import {gameStore, nodeStore, playerStore, selectedCardStore} from "stores";
  import {ButtonComponent} from "ui";

  $: height = $nodeStore.barHeight;

  const onEndTurn = (): void => {
    $selectedCardStore.field = undefined;
    $selectedCardStore.graveyard = undefined;
    $selectedCardStore.hand = undefined;

    soundService.play("endTurn");
    socketService.socket.emit("endTurn");
  };
</script>

<style>
  .game-timer {
    position: absolute;
    top: 50%;
    right: 0;
    height: 66%;
    width: 160px;
    display: flex;
    align-items: center;
    transform: translateY(-50%);
    /* margin-right: var(--md); */
  }

  .bar {
    height: 90%;
    width: 12px;
    /* margin: var(--md) 0 var(--md) 0; */
    /* box-sizing: border-box; */
    margin-left: 8px;
    background-color: rgb(31, 31, 31);
  }
  .progress {
    height: 60%;
    width: 8px;
    margin: 2px;
    /* box-sizing: border-box; */
    background-color: rgb(var(--primary));
  }

.info {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
  }

  .glow {
    animation: glow4 1s ease-in-out infinite alternate;
    color: rgb(var(--primary));
  }

  @keyframes glow4 {
    from {
      text-shadow: 0 0 0 rgb(var(--primary));
      transform: scale(1);
    } to {
      text-shadow: 2px 2px 32px rgb(var(--primary));
      transform: scale(1.2);
    }
  }


  .bgd {
    /* width: 75%; */
    /* text-align: center; */
    padding: var(--sm) var(--lg);
    background-color: rgb(var(--dark-grey));
    border-radius: 8px;
    box-sizing: border-box;
  }
</style>

<div class="game-timer">
  <div class="info">
    <div class="bgd" class:glow={$gameStore.opponent.name === $gameStore.currentPlayer}>{$gameStore.opponent.name}</div>
    <ButtonComponent on:click={onEndTurn}>END TURN</ButtonComponent>
    <div class="bgd" class:glow={$playerStore.name === $gameStore.currentPlayer}>{$gameStore.player.name}</div>
  </div>
  <div class="bar">
    <div class="progress" style:height></div>
  </div>
</div>
