<script lang="ts">
  import {Button, FontAwesome, Modal, Text} from "components";
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
  <form on:submit|preventDefault={onAddFriend}>
    <input class="input--green" placeholder="Username" bind:value={username}>
    <Button type="submit">
      <FontAwesome icon="paper-plane"/> <Text>SEND</Text>
    </Button>
  </form>
</Modal>
