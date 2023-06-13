<script lang="ts">
  import {socketService} from "services";

  let name: string;
  const {socket} = socketService;

  const onAcceptFriend = (): void => {
    socket.emit("acceptFriend", {name});
  };

  const onDeclineFriend = (): void => {
    socket.emit("declineFriend", {name});
  };

  export {name};
</script>

<style>
  .request {
    padding: var(--spacing-md);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(
      180deg,
      rgba(179, 105, 244, 0.1) 0%,
      rgba(0, 0, 0, 0) 50%,
      rgba(179, 105, 244, 0.1) 100%
    );
    border: 1px solid;
    border-right-width: 0;
    border-left-width: 0;
    border-image: linear-gradient(
      90deg,
      rgba(63, 63, 63, 1) 0%,
      rgba(255, 255, 255, 1) 50%,
      rgba(63, 63, 63, 1) 100%
    ) 1;
  }

  .request__actions {
    display: flex;
    gap: var(--spacing-md);
  }
</style>

<div class="request">
  <div>{name}</div>
  <div class="request__actions">
    <button class="button--icon" on:click={onAcceptFriend}>
      <i class="fa-solid fa-check"></i>
    </button>
    <button class="button--icon" on:click={onDeclineFriend}>
      <i class="fa-solid fa-xmark"></i>
    </button>
  </div>
</div>
