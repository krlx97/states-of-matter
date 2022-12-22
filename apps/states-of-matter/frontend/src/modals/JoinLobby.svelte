<script lang="ts">
  import {socketService} from "services";
  import Modal from "../ui/Modal.svelte";

  let lobbyId: number;

  const onJoinLobby = (): void => {
    socketService.socket.emit("joinLobby", {lobbyId});
  };
</script>

<Modal>
  <form on:submit|preventDefault={onJoinLobby}>
    <label>
      <div>Lobby ID</div>
      <input placeholder="Lobby ID" type="number" bind:value={lobbyId}/>
    </label>
    <button class="btn--raised-purple">JOIN</button>
  </form>
</Modal>
