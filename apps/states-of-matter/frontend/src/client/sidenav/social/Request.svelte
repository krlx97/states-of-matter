<script lang="ts">
  import {socketService} from "services";

  const {socket} = socketService;
  let username: string;

  const onAcceptFriend = (): void => {
    socket.emit("acceptFriend", {username});
  };

  const onDeclineFriend = (): void => {
    socket.emit("declineFriend", {username});
  };

  export {username};
</script>

<style>
  .request {
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

<div class="request">
  <div>{username}</div>
  <div>
    <button class="btn--icon-purple" on:click={onAcceptFriend}>
      <img src="assets/icons/check.png" alt="Accept">
    </button>
    <button class="btn--icon-purple" on:click={onDeclineFriend}>
      <img src="assets/icons/times.png" alt="Decline">
    </button>
  </div>
</div>
