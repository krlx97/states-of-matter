<script lang="ts">
  import {eccService, socketService} from "services";
  import {lobbyStore, playerStore} from "stores/data";

  const start = (): void => {
    const {publicKey, privateKey} = $playerStore;
    const {lobbyId} = $lobbyStore;
    const signature = eccService.sign(`startgame:${lobbyId}`, privateKey);

    socketService.emit("startGame", {lobbyId, publicKey, signature});
  };

  const onDestroyLobby = (): void => { socketService.emit("destroyLobby"); };
  const onLeaveLobby = (): void => { socketService.emit("leaveLobby"); };
</script>

<style>
  .lobby {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .players {
    margin: var(--spacing-md) 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .host, .challengee {
    width: 256px;
    padding: var(--spacing-sm);
    display: flex;
    align-items: center;
    background-color: rgb(var(--light-grey));
    border-radius: 4px;
    box-sizing: border-box;
    box-shadow: var(--elevation-sm);
  }
  .challengee {
    justify-content: flex-end;
  }
  .host__avatar, .challengee__avatar {
    border-radius: 50%;
  }
  .host__avatar {
    margin-right: var(--spacing-sm);
  }
  .challengee__avatar {
    margin-left: var(--spacing-sm);
  }

  .vs {
    margin: 0 var(--spacing-md);
    animation: glow 10s cubic-bezier(var(--ease-in-out-quart)) 0s infinite alternate;
  }
  @keyframes glow {
    from {
      color: rgb(var(--green));
      text-shadow: 0 0 16px rgb(var(--green));
    } to {
      color: rgb(var(--purple));
      text-shadow: 0 0 16px rgb(var(--purple));
    }
  }
</style>

<div class="lobby">

  <h3>
    Game ID #<span class="f--purple">{$lobbyStore.lobbyId}</span>
  </h3>

  <div class="players">

    <div class="host">
      <img class="host__avatar" src="assets/avatars/{$lobbyStore.host.avatarId}.jpg" alt="Host avatar" height="64" width="64">
      <p>
        {$lobbyStore.host.username}<br>
        <span class="f--purple">Host</span>
      </p>
    </div>

    <h1 class="vs">VS</h1>

    <div class="challengee">
      <p>
        {$lobbyStore.challengee.username ? $lobbyStore.challengee.username : "Awaiting..."}<br>
        <span class="f--green">Challengee</span>
      </p>
      <img class="challengee__avatar" src="assets/avatars/{$lobbyStore.challengee.username ? $lobbyStore.challengee.avatarId : "unknown"}.jpg" alt="Challengee avatar" height="64" width="64">
    </div>
  </div>

  <div>
    {#if $lobbyStore.host.username === $playerStore.username}
      <button class="btn--raised-primary" disabled={$lobbyStore.challengee.username === ""} on:click={start}>START GAME</button>
      <button class="btn--raised-primary" on:click={onDestroyLobby}>DESTROY LOBBY</button>
    {:else}
      <button class="btn--basic-primary" on:click={onLeaveLobby}>LEAVE LOBBY</button>
    {/if}
  </div>

</div>