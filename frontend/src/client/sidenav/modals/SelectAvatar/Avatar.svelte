<script lang="ts">
  import {socketService, soundService} from "services";
  import {inventoryStore} from "stores";
    import { onMount } from "svelte";

  let avatar: any;
  let bal = 0n;

  const onSetAvatar = (): void => {
    const balance = $inventoryStore.items.find((item) => item.id === avatar.id)?.balance;
    bal = balance || 0n;

    if (balance && balance > 0) {
      const avatarId = avatar.id;
      socketService.socket.emit("setAvatar", {avatarId});
      soundService.play("click");
    }
  };

  onMount((): void => {
    const balance = $inventoryStore.items.find((item) => item.id === avatar.id)?.balance;
    bal = balance || 0n;
  });

  export {avatar};
</script>

<style>
  .avatar {
    position: relative;
    cursor: pointer;
    /* filter: grayscale(0.5); */
    transition: filter 400ms ease-in-out;
  }

  .avatar:hover img {
    border: 1px solid rgb(var(--grey));
    /* filter: grayscale(0); */
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
  class:avatar="{bal > 0}"
  class:locked="{bal < 1}"
  on:click="{onSetAvatar}">
  <img src="images/items/{avatar.id}.png" alt="Avatar {avatar.id}"/>
  {#if bal < 1}
    <i class="lock">🔒</i>
  {/if}
</div>
