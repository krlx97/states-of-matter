<script lang="ts">
  import {socketService} from "services";
  import {ModalComponent} from "ui";

  let id: number;

  const onJoinLobby = (): void => {
    socketService.socket.emit("joinLobby", {id});
  };
</script>

<ModalComponent>
  <form on:submit|preventDefault={onJoinLobby}>
    <label>
      <div>Lobby ID</div>
      <input placeholder="Lobby ID" type="number" bind:value={id}/>
    </label>
    <button>JOIN</button>
  </form>
</ModalComponent>
