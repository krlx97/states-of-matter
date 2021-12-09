<script lang="ts">
  import {Modal} from "components";
  import {socketService} from "services";

  let username = "";

  const onAddFriend = (): void => {
    socketService.emit("addFriend", {username});
  };
</script>

<style lang="scss">
  form {
    display: flex;
    flex-direction: row;
  }
</style>

<Modal>
  <form>
    <input class="input--green" placeholder="Username" bind:value={username}>
    <button class="btn--raised-accent" on:click={onAddFriend}>
      <i class="fas fa-paper-plane fa-fw"></i> SEND
    </button>
  </form>
</Modal>
