<script lang="ts">
  import {socketService} from "services";
  import {modalStore} from "stores";
  import Modal from "../ui/Modal.svelte";

  const onUnfriend = (): void => {
    const {username} = $modalStore.data;
    socketService.socket.emit("unfriend", {username});
  };
</script>

<Modal>
  <p>
    Are you sure you want to remove {$modalStore.data.username} from your
    friends list?
  </p>
  <button class="btn--raised-accent" on:click={onUnfriend}>YES</button>
  <button class="btn--basic-accent">NO</button>
</Modal>
