<script lang="ts">
  import {miscService, socketService} from "services";
  import Button from "../../ui/Button.svelte";

  const onMakeLobby = () => { socketService.socket.emit("makeLobby"); };
  const onJoinLobby = () => { miscService.openModal("joinLobby"); };

  const onJoinCasualQueue = (): void => {
    socketService.socket.emit("joinCasualQueue");
  };
</script>

<style lang="scss">
  .play-screens {
    display: flex;
    height: 100%;
    width: 100%;
  }
  .play-screen {
    flex-basis: 33.3333%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    box-sizing: border-box;
    transition: border-color 225ms ease-in-out;
  }
  .casual:hover {
    border-top-color: rgb(var(--blue));
    border-bottom-color: rgb(var(--blue));
  }
  .ranked:hover {
    border-top-color: rgb(var(--purple));
    border-bottom-color: rgb(var(--purple));
  }
  .custom:hover {
    border-top-color: rgb(var(--green));
    border-bottom-color: rgb(var(--green));
  }
</style>

<div class="play-screens">
  <div class="play-screen casual">
    <h1>CASUAL</h1>
    <p>Play for fun</p>
    <Button color="green" on:click={onJoinCasualQueue}>
      QUEUE
    </Button>
  </div>

  <div class="play-screen ranked">
    <h1>RANKED</h1>
    <p>Rank up and earn SOM rewards</p>
    <p>Ranked coming soon... 😉</p>
  </div>

  <div class="play-screen custom">
    <h1>CUSTOM</h1>
    <p>Challenge your friends</p>
    <div>
      <Button color="green" on:click={onMakeLobby}>
        MAKE
      </Button>
      <Button style="outlined" color="green" on:click={onJoinLobby}>
        JOIN
      </Button>
    </div>
  </div>
</div>
