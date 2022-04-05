<script lang="ts">
  import {socketService} from "services";
  import Modal from "../ui/Modal.svelte";
  import Button from "../ui/Button.svelte";
  import Text from "../ui/Text.svelte";

  let lobbyId: number;

  const onJoinLobby = () => {
    socketService.socket.emit("joinLobby", {lobbyId});
  };
</script>

<Modal>
  <form on:submit|preventDefault={onJoinLobby}>
    <Text>
      Lobby ID
    </Text>
    <input placeholder="Lobby ID" type="number" bind:value={lobbyId}/>
    <Button type="submit">
      JOIN
    </Button>
  </form>
</Modal>
