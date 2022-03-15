<script lang="ts">
  import {socketService} from "services";

  import Button from "../ui/Button.svelte";
  // import FontAwesome from "../ui/FontAwesome.svelte";
  import Form from "../ui/Form.svelte";
  import Input from "../ui/Input.svelte";
  import Modal from "../ui/Modal.svelte";
  // import Text from "../ui/Text.svelte";

  let username = "";

  const onAddFriend = (): void => { socketService.addFriend({username}); };
</script>

<!-- <style lang="scss">
  @import "../shared/styles/mixins";

  form {@include flex()}
</style> -->

<Modal>
  <Form on:submit={onAddFriend}>
    <Input placeholder="Username" bind:value={username}/>
    <Button type="submit">SEND</Button>
  </Form>
</Modal>
