<script lang="ts">
  import {Modal} from "components";
  import {socketService} from "services";

  let lobbyId: number;

  const onJoinLobby = (): void => {
    socketService.emit("joinLobby", {lobbyId});
  };
</script>

<Modal>
  <form on:submit|preventDefault={onJoinLobby}>
    <h3>
      Lobby ID
    </h3>
    <input placeholder="Lobby ID" type="number" bind:value={lobbyId}/>
    <button class="btn--raised-blue">
      JOIN
    </button>
  </form>
</Modal>
