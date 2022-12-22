<script type="ts">
  import {socketService} from "services";

  let username: string;

  const onUnblock = (): void => {
    socketService.socket.emit("unblock", {username});
  };

  export {username};
</script>

<style>
  .block {
    margin: var(--spacing-md);
    padding: var(--spacing-md);
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top-width: 1px;
    border-right-width: 0;
    border-bottom-width: 1px;
    border-left-width: 0;
    border-style: solid;
    border-image: linear-gradient(
      90deg,
      rgba(63,63,63,1) 0%,
      rgba(255,255,255,1) 50%,
      rgba(63,63,63,1) 100%
    ) 1;
    background: linear-gradient(
      180deg,
      rgba(179, 105, 244, 0.1) 0%,
      rgba(0, 0, 0, 0) 50%,
      rgba(179, 105, 244, 0.1) 100%
    );
  }
</style>

<div class="block">
  <div>{username}</div>
  <button class="btn--icon-purple" on:click={onUnblock}>
    <img src="assets/icons/delete.png" alt="Unblock"/>
  </button>
</div>
