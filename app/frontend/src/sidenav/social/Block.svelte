<script type="ts">
  import {socketService} from "shared/services";
  import FontAwesome from "../../ui/FontAwesome.svelte";

  let username: string;

  const onUnblock = (): void => { socketService.unblockFriend({username}); };

  export {username};
</script>

<style>
  .block {
    margin-bottom: var(--spacing-sm);
    padding: var(--spacing-sm);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: rgb(var(--light-grey));
    border-radius: 4px;
    box-shadow: var(--elevation-sm);
  }
  .block:nth-last-child(1) {
    margin-bottom: 0;
  }
</style>

<div class="block">
  <p>
    {username}
  </p>
  <button class="btn--icon-accent" on:click={onUnblock}>
    <FontAwesome icon="trash"/>
  </button>
</div>