<script lang="ts">
  import {socketService, soundService} from "services";
  import {ButtonComponent} from "ui";

  let name: string;
  const {socket} = socketService;

  const onAcceptFriend = (): void => {
    socket.emit("acceptFriend", {name});
        soundService.play("click");
  };

  const onDeclineFriend = (): void => {
    socket.emit("declineFriend", {name});
        soundService.play("click");
  };

  export {name};
</script>

<style>
  .request {
    padding: var(--md);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(
      180deg,
      rgba(179, 105, 244, 0.1) 0%,
      rgba(0, 0, 0, 0) 50%,
      rgba(179, 105, 244, 0.1) 100%
    );
    border: 1px solid rgb(var(--grey));
    border-radius: 8px;
  }

  .request__actions {
    display: flex;
    gap: var(--md);
  }
</style>

<div class="request">
  <div>{name}</div>
  <div class="request__actions">
    <ButtonComponent isIcon on:click="{onAcceptFriend}">✔</ButtonComponent>
    <ButtonComponent isIcon on:click="{onDeclineFriend}">×</ButtonComponent>
  </div>
</div>
