<script lang="ts">
  import {socketService} from "services";

  import Button from "../ui/Button.svelte";
  import FontAwesome from "../ui/FontAwesome.svelte";
  import Modal from "../ui/Modal.svelte";
  import Text from "../ui/Text.svelte";

  let username = "";

  const onAddFriend = (): void => { socketService.addFriend({username}); };
</script>

<style lang="scss">
  @import "../shared/styles/mixins";

  form {@include flex()}
</style>

<Modal>
  <form on:submit|preventDefault={onAddFriend}>
    <input class="input--green" placeholder="Username" bind:value={username}>
    <Button type="submit">
      <FontAwesome icon="paper-plane"/>
      <Text>SEND</Text>
    </Button>
  </form>
</Modal>
