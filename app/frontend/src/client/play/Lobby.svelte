<script lang="ts">
  import {eccService, socketService} from "services";
  import {lobbyStore, playerStore} from "stores";
  import Button from "../../ui/Button.svelte";
  import Text from "../../ui/Text.svelte";

  const onStartGame = (): void => {
    const {publicKey, privateKey} = $playerStore;
    const {lobbyId} = $lobbyStore;
    const signature = eccService.sign(`startgame:${lobbyId}`, privateKey);

    socketService.socket.emit("startGame", {lobbyId});
  };

  const onDestroyLobby = (): void => { socketService.socket.emit("destroyLobby"); };
  const onLeaveLobby = (): void => { socketService.socket.emit("leaveLobby"); };
</script>

<style lang="scss">
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
  .host__avatar, .challengee__avatar {border-radius: 50%}
  .host__avatar {margin-right: var(--spacing-sm)}
  .challengee__avatar {margin-left: var(--spacing-sm)}

  .vs {
    margin: 0 var(--spacing-md);
  }
</style>

<div class="lobby">

  <h3>
    <Text>Lobby ID:</Text>
    <Text color="purple">{$lobbyStore.lobbyId}</Text>
  </h3>

  <div class="players">

    <div class="host">
      <img
        class="host__avatar"
        src="assets/avatars/{$lobbyStore.host.avatarId}.png"
        alt="Host avatar"
      />

      <div>
        <Text>{$lobbyStore.host.username}</Text>
        <br/>
        <Text color="purple">Host</Text>
      </div>
    </div>

    <h1 class="vs">
      VS
    </h1>

    <div class="challengee">
      <div>
        {$lobbyStore.challengee.username ? $lobbyStore.challengee.username : "Awaiting..."}
        <br/>
        <Text color="green">Challengee</Text>
      </div>

      <img
        class="challengee__avatar"
        src="assets/avatars/{$lobbyStore.challengee.username ? $lobbyStore.challengee.avatarId : "unknown"}.png"
        alt="Challengee avatar"
      />
    </div>
  </div>

  <div>
    {#if $lobbyStore.host.username === $playerStore.username}
      <Button disabled={!$lobbyStore.challengee.username} on:click={onStartGame}>
        START GAME
      </Button>
      <Button on:click={onDestroyLobby}>
        DESTROY LOBBY
      </Button>
    {:else}
      <Button style="outlined" on:click={onLeaveLobby}>
        LEAVE LOBBY
      </Button>
    {/if}
  </div>

</div>
