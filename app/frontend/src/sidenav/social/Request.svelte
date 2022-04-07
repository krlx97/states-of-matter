<script lang="ts">
  import {socketService} from "shared/services";
  import Button from "../../ui/Button.svelte";
  import FontAwesome from "../../ui/FontAwesome.svelte";
  import Text from "../../ui/Text.svelte";

  let username: string;

  const onAcceptFriend = (): void => { socketService.socket.emit("acceptFriend", {username}); };
  const onDeclineFriend = (): void => { socketService.socket.emit("declineFriend", {username}); };

  export {username};
</script>

<style lang="scss">
  @import "../../shared/styles/mixins";
  @import "../../shared/styles/variables";

  .request {
    margin: $spacing-md;
    padding: $spacing-md;
    @include flex($align-items: center, $justify-content: space-between);
    background-color: $light-grey;
    border-radius: 4px;
    box-shadow: $elevation-sm;
  }
</style>

<div class="request">
  <Text>{username}</Text>
  <div>
    <Button style="icon" on:click={onAcceptFriend}>
      <FontAwesome icon="check"/>
    </Button>
    <Button style="icon" on:click={onDeclineFriend}>
      <FontAwesome icon="trash"/>
    </Button>
  </div>
</div>
