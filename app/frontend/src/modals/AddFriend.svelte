<script lang="ts">
  import {socketService} from "services";
  import {Button, Form, Input, Modal} from "ui";

  let username = "";

  const onAddFriend = () => {
    socketService.socket.emit("addFriend", {username});
  };
</script>

<Modal>
  <Form on:submit={onAddFriend}>
    <Input placeholder="Username" bind:value={username}/>
    <Button type="submit">SEND</Button>
  </Form>
</Modal>
