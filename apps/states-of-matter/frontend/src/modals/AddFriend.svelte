<script lang="ts">
  import {socketService} from "services";
  import Modal from "../ui/Modal.svelte";

  let username = "";

  const onAddFriend = (): void => {
    socketService.socket.emit("addFriend", {username});
  };
</script>

<Modal>
  <form on:submit|preventDefault={onAddFriend}>
    <label>
      <div>Username</div>
      <input placeholder="Username" type="text" bind:value={username}/>
    </label>
    <button class="btn--raised-purple">SEND</button>
  </form>
</Modal>
