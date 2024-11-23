<script lang="ts">
  import {socketService, soundService} from "services";
  import {lobbyStore, playerStore} from "stores";
  import {ButtonComponent, PlayerFrameComponent, TextComponent} from "ui";
  import Chat from "./Chat.svelte";

  const {socket} = socketService;

  const onStartGame = (): void => {
    soundService.play("click");
    socket.emit("startCustomGame");
  };

  const onCloseLobby = (): void => {
    soundService.play("click");
    socket.emit("closeLobby");
  };

  const onLeaveLobby = (): void => {
    soundService.play("click");
    socket.emit("leaveLobby");
  };
</script>

<style>
  .lobby {
    display: flex;
    justify-content: center;
  }

  .lobby__actions {
    display: flex;
    justify-content: center;
    gap: var(--md);
  }

  .players {
    margin: var(--md) 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }

  .vs {
    margin: 0 var(--md);
  }

  .lobby-playerz {
    flex-basis: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>

<div class="lobby">
  <Chat/>

  <div class="lobby-playerz">

    <TextComponent color="primary" size="xl">Lobby ID: {$lobbyStore.id}</TextComponent>

    <div class="players">
      <PlayerFrameComponent {...$lobbyStore.host} isMutual={false}/>

      <h1 class="vs">VS</h1>

      {#if $lobbyStore.challengee}
        <PlayerFrameComponent {...$lobbyStore.challengee} isMutual={false}/>
      {:else}
        <div>Awaiting opponent...</div>
      {/if}
    </div>

    <div class="lobby__actions">
      {#if $lobbyStore.host.name === $playerStore.name}
        <ButtonComponent
          disabled="{!$lobbyStore.challengee}"
          on:click="{onStartGame}">
          START GAME
        </ButtonComponent>
        <ButtonComponent on:click="{onCloseLobby}">CLOSE LOBBY</ButtonComponent>
      {:else}
        <ButtonComponent on:click="{onLeaveLobby}">LEAVE LOBBY</ButtonComponent>
      {/if}
    </div>

  </div>

</div>
