<script lang="ts">
  import {socketService, soundService} from "services";
    import { ButtonComponent } from "ui";

  let name: string;

  const onUnblock = (): void => {
    socketService.socket.emit("unblockFriend", {name});
    soundService.play("click");
  };

  export {name};
</script>

<style>
  .block {
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
</style>

<div class="block">
  <div>{name}</div>
  <ButtonComponent isIcon on:click="{onUnblock}">×</ButtonComponent>
</div>
