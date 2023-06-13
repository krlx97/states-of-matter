<script lang="ts">
  import {socketService} from "services";

  let name: string;

  const onUnblock = (): void => {
    socketService.socket.emit("unblockFriend", {name});
  };

  export {name};
</script>

<style>
  .block {
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
</style>

<div class="block">
  <div>{name}</div>
  <button class="button--icon" on:click={onUnblock}>
    <i class="fa-solid fa-xmark"></i>
  </button>
</div>
