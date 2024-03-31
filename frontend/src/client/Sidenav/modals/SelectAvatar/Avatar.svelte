<script lang="ts">
  import {onMount} from "svelte";
  import {socketService, soundService} from "services";

  let avatar: any;
  let isLocked = true;

  const onSetAvatar = (): void => {
    if (!isLocked) {
      soundService.play("click");
      const avatarId = parseInt(avatar.id.toString());
      socketService.socket.emit("setAvatar", {avatarId});
    }
  };

  onMount((): void => {
    if (avatar && avatar.rarity === 0 && avatar.owned) {
      isLocked = false;
    } else if (avatar && avatar.rarity !== 0 && avatar.balance > 0) {
      isLocked = false;
    }
  });

  export {avatar};
</script>

<style>
  .avatar {
    position: relative;
    cursor: pointer;
    transition: filter 400ms ease-in-out;
  }

  .avatar:hover img {
    border: 1px solid rgb(var(--grey));
  }

  img {
    border: 1px solid transparent;
    border-radius: 50%;
    transition: border 400ms ease;
  }

  .locked {
    filter: grayscale(1);
    cursor: not-allowed;
  }

  .lock {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-shadow: 0 0 8px black;
  }
</style>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class:avatar="{!isLocked}"
  class:locked="{isLocked}"
  on:click="{onSetAvatar}">
  <img src="images/items/{avatar.id}.png" alt="Avatar {avatar.id}"/>
  {#if isLocked}
    <i class="lock">🔒</i>
  {/if}
</div>
