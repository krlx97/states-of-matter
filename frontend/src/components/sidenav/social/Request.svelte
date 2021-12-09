<script lang="ts">
  import {FontAwesome} from "components";
  import {socketService} from "services";

  let username: string;

  const onAcceptFriend = (): void => {
    socketService.emit("acceptFriend", {username});
  };

  const onDeclineFriend = (): void => {
    socketService.emit("declineFriend", {username});
  };

  export {username};
</script>

<style>
  .request {
    margin-bottom: var(--spacing-sm);
    padding: var(--spacing-sm);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: rgb(var(--light-grey));
    border-radius: 4px;
    box-shadow: var(--elevation-sm);
  }
  .request:nth-last-child(1) {
    margin-bottom: 0;
  }
</style>

<div class="request">
  <p>
    {username}
  </p>
  <div>
    <button class="btn--icon-accent" on:click={onAcceptFriend}>
      <FontAwesome icon="check"/>
    </button>
    <button class="btn--icon-accent" on:click={onDeclineFriend}>
      <FontAwesome icon="trash"/>
    </button>
  </div>
</div>
