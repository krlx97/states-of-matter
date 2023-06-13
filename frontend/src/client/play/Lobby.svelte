<script lang="ts">
  import {socketService} from "services";
  import {lobbyStore, playerStore} from "stores";

  const {socket} = socketService;

  const onStartGame = (): void => {
    socket.emit("startCustomGame");
  };

  const onCloseLobby = (): void => {
    socket.emit("closeLobby");
  };

  const onLeaveLobby = (): void => {
    socket.emit("leaveLobby");
  };
</script>

<style>
  .lobby {
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
    border: 1px solid rgb(127, 127, 127);
    border-radius: 8px;
    box-sizing: border-box;
    /* box-shadow: var(--elevation-sm); */
  }
  .challengee {
    justify-content: flex-end;
  }
  .host__avatar, .challengee__avatar {border-radius: 50%}
  .host__avatar {margin-right: var(--spacing-sm)}
  .challengee__avatar {margin-left: var(--spacing-sm)}

  .vs {
    margin: 0 var(--spacing-md);
  }
</style>

<div class="lobby">

  <h3>
    <div>Lobby ID:</div>
    <div>{$lobbyStore.id}</div>
  </h3>

  <div class="players">

    <div class="host">
      <img
        class="host__avatar"
        src="assets/avatars/{$lobbyStore.host.avatarId}.png"
        alt="Host avatar"
      />

      <div>
        <div>{$lobbyStore.host.name}</div>
        <br/>
        <div>Host</div>
      </div>
    </div>

    <h1 class="vs">
      VS
    </h1>

    <div class="challengee">
      <div>
        {$lobbyStore.challengee.name ? $lobbyStore.challengee.name : "Awaiting..."}
        <br/>
        <div>Challengee</div>
      </div>

      <img
        class="challengee__avatar"
        src="assets/avatars/{$lobbyStore.challengee.name ? $lobbyStore.challengee.avatarId : "unknown"}.png"
        alt="Challengee avatar"
      />
    </div>
  </div>

  <div>
    {#if $lobbyStore.host.name === $playerStore.name}
      <button class="button" disabled={!$lobbyStore.challengee.name} on:click={onStartGame}>
        START GAME
      </button>
      <button class="button" on:click={onCloseLobby}>
        CLOSE LOBBY
      </button>
    {:else}
      <button class="button" on:click={onLeaveLobby}>
        LEAVE LOBBY
      </button>
    {/if}
  </div>

</div>
