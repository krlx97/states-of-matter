<script lang="ts">
  import {PlayerStatus} from "@som/shared/enums";
  import {onDestroy, onMount} from "svelte";
  import {miscService, socketService} from "services";
  import {casualQueueJoinTime, playerStore} from "stores";

  $: isInCasualQueue = $playerStore.status === PlayerStatus.IN_CASUAL_QUEUE;
  $: isInRankedQueue = $playerStore.status === PlayerStatus.IN_RANKED_QUEUE;

  let interval: NodeJS.Timer;
  let timeInQueue = "";

  const onMakeLobby = (): void => {
    socketService.socket.emit("makeLobby");
  };

  const onJoinLobby = (): void => {
    miscService.openModal("joinLobby");
  };

  const onJoinCasualQueue = (): void => {
    socketService.socket.emit("joinCasualQueue");
  };

  const onLeaveCasualQueue = (): void => {
    socketService.socket.emit("leaveCasualQueue");
  };

  const onJoinRankedQueue = (): void => {
    socketService.socket.emit("joinRankedQueue");
  };

  const onLeaveRankedQueue = (): void => {
    socketService.socket.emit("leaveRankedQueue");
  };

  onMount((): void => {
    interval = setInterval((): void => {
      const date = new Date(Date.now() - $casualQueueJoinTime);
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();

      timeInQueue = `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    }, 1000);
  });

  onDestroy((): void => {
    clearInterval(interval);
  });
</script>

<style>
  .modes {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
  }

  .modes__mode {
    padding: 1em;
    flex-basis: 33.3333%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .modes__mode__info {
    margin-block: 1em;
    font-size: 16px;
    line-height: 1.4em;
  }

  .icon {
    height: 16px;
    width: 16px;
    vertical-align: middle;
  }

  .add-margin {
    margin-right: var(--spacing-md);
  }
</style>

<div class="modes">
  <div class="modes__mode">
    <h2>CASUAL</h2>
    <div class="modes__mode__info">
      {#if isInCasualQueue}
        <h4>Queue time: {timeInQueue}</h4>
      {/if}
      Play for fun, gain experience points and receive
      1,000.0000 <img class="icon" src="assets/currencies/VMT.png" alt="VMT"/>
      whenever you level up.
    </div>
    {#if isInCasualQueue}
      <button on:click={onLeaveCasualQueue}>LEAVE</button>
    {:else}
      <button on:click={onJoinCasualQueue} disabled={isInRankedQueue}>
        PLAY
      </button>
    {/if}
  </div>

  <div class="modes__mode">
    <h2>RANKED</h2>
    <div class="modes__mode__info">
      {#if isInRankedQueue}
        <h4>Queue time: {timeInQueue}</h4>
      {/if}
      Top 100 ranked players earn 10% (0.1% each) daily from the VMT rewards
      pool.
    </div>
    {#if isInRankedQueue}
      <button on:click={onLeaveRankedQueue}>LEAVE</button>
    {:else}
      <button on:click={onJoinRankedQueue} disabled={isInCasualQueue}>
        PLAY
      </button>
    {/if}
  </div>

  <div class="modes__mode">
    <h2>CUSTOM</h2>
    <div class="modes__mode__info">
      Challenge your friends. You will not receive any rewards for playing this
      mode.
    </div>
    <div>
      <button
        class="add-margin"
        on:click={onMakeLobby}
        disabled={isInCasualQueue || isInRankedQueue}>
        CREATE
      </button>
      <button
        on:click={onJoinLobby}
        disabled={isInCasualQueue || isInRankedQueue}>
        JOIN
      </button>
    </div>
  </div>
</div>
