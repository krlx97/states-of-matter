<script lang="ts">
  import {PlayerStatus} from "@som/shared/enums";
  import {miscService, socketService} from "services";
  import {casualQueueJoinTime, playerStore} from "stores";
  import { onDestroy, onMount } from "svelte";
  import Button from "../../ui/Button.svelte";
  import Text from "../../ui/Text.svelte";

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

  onDestroy((): void => { clearInterval(interval); });
</script>

<style lang="scss">
  .modes {
    display: flex;
    height: 100%;
    width: 100%;

    &__mode {
      padding: 1em;
      flex-basis: 33.3333%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;

      &__info {
        margin-block: 1em;
        font-size: 16px;
        line-height: 1.5em;
      }
    }
  }
</style>

<div class="modes">
  <div class="modes__mode">
    <h2>CASUAL QUEUE</h2>
    <div class="modes__mode__info">
      {#if isInCasualQueue}
        <h4>Queue time: {timeInQueue}</h4>
      {/if}
      Play for fun, gain experience points and receive
      <img src="assets/currencies/DMT.png" height="16" width="16" alt="DMT"/>
      tokens whenever you level up.
    </div>
    {#if isInCasualQueue}
      <Button on:click={onLeaveCasualQueue}>
        LEAVE QUEUE
      </Button>
    {:else}
      <Button on:click={onJoinCasualQueue} disabled={isInRankedQueue}>
        ENTER QUEUE
      </Button>
    {/if}
  </div>

  <div class="modes__mode">
    <h2>RANKED QUEUE</h2>
    <div class="modes__mode__info">
      {#if isInRankedQueue}
        <h4>Queue time: {timeInQueue}</h4>
      {/if}
      Top 100 ranked players will participate in governance and earn 0.25% of
      daily issued
      <img src="assets/currencies/LMT.png" height="16" width="16" alt="LMT"/>
      tokens.
    </div>
    {#if isInRankedQueue}
      <Button on:click={onLeaveRankedQueue}>
        LEAVE QUEUE
      </Button>
    {:else}
      <Button on:click={onJoinRankedQueue} disabled={isInCasualQueue}>
        ENTER QUEUE
      </Button>
    {/if}
  </div>

  <div class="modes__mode">
    <h2>CUSTOM LOBBY</h2>
    <div class="modes__mode__info">
      Challenge your friends. You will not receive any rewards for playing this
      mode.
    </div>
    <div>
      <Button on:click={onMakeLobby} disabled={isInCasualQueue || isInRankedQueue}>
        MAKE LOBBY
      </Button>
      <Button style="outlined" on:click={onJoinLobby} disabled={isInCasualQueue || isInRankedQueue}>
        JOIN LOBBY
      </Button>
    </div>
  </div>
</div>
