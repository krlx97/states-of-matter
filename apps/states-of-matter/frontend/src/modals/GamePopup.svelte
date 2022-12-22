<script lang="ts">
  import {socketService} from "services";
  import {modalStore} from "stores";
  import Modal from "../ui/Modal.svelte";

  const onAccept = (): void => {
    socketService.socket.emit("acceptGame", {gameId: $modalStore.data.gameId});
  };

  const onDecline = (): void => {
    socketService.socket.emit("declineGame", {gameId: $modalStore.data.gameId});
  };
</script>

<style>
  h1 {
    text-align: center;
    margin: 0;
    margin-bottom: var(--spacing-md);
    font-size: 24px;
    font-weight: 900;
  }
  .red {color: rgb(var(--red));}
  .green {color: rgb(var(--green));}

  .players {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin-bottom: var(--spacing-md);
  }
</style>

<Modal>
  <h1>Game found</h1>
  <div class="players">
    <i
      class="fa-solid fa-user"
      class:green={$modalStore.data.playerA.hasAccepted}
      class:red={!$modalStore.data.playerA.hasAccepted}
    ></i>
    <i
      class:green={$modalStore.data.playerB.hasAccepted}
      class:red={!$modalStore.data.playerB.hasAccepted}
      class="fa-solid fa-user red"
    ></i>
  </div>
  <button on:click={onAccept}>ACCEPT</button>
  <button on:click={onDecline}>DECLINE</button>
</Modal>
