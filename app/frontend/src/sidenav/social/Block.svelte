<script type="ts">
  import {socketService} from "shared/services";
  import Button from "../../ui/Button.svelte";
  import FontAwesome from "../../ui/FontAwesome.svelte";
  import Text from "../../ui/Text.svelte";

  let username: string;

  const onUnblock = (): void => { socketService.unblockFriend({username}); };

  export {username};
</script>

<style lang="scss">
  @import "../../shared/styles/mixins";
  @import "../../shared/styles/variables";

  .block {
    margin: $spacing-md;
    padding: $spacing-md;
    @include flex($align-items: center, $justify-content: space-between);
    background-color: $light-grey;
    border-radius: 4px;
    box-shadow: $elevation-sm;
  }
</style>

<div class="block">
  <Text>{username}</Text>
  <Button style="icon" on:click={onUnblock}>
    <FontAwesome icon="trash"/>
  </Button>
</div>
