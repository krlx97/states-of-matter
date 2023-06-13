<script lang="ts">
  import {socketService} from "services";
  import {ModalComponent} from "ui";

  const avatars = [0, 1, 2, 3, 4];

  const onSetAvatar = (avatarId: number): void => {
    socketService.socket.emit("setAvatar", {avatarId});
  };
</script>

<style>
  .avatars {
    display: flex;
    gap: var(--spacing-md);
  }

  .avatar {
    cursor: pointer;
    filter: grayscale(0.4);
    transition: filter 250ms ease-in-out;
  }

  .avatar:hover {
    filter: grayscale(0);
  }
</style>

<ModalComponent>
  <div class="avatars">
    {#each avatars as avatar}
      <img
        class="avatar"
        src="assets/avatars/{avatar}.png"
        alt="Avatar {avatar}"
        on:click={() => onSetAvatar(avatar)}
        on:keypress={() => onSetAvatar(avatar)}
      />
    {/each}
  </div>
</ModalComponent>
