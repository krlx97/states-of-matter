<script lang="ts">
  import {socketService, soundService} from "services";
  import {inventoryStore} from "stores";
    import { onMount } from "svelte";

  let banner: any;
  let balance = $inventoryStore.items.find((item) => item.id === banner.id)?.balance;
  let bal = 0n;

  const onSetBanner = (): void => {
    const balance = $inventoryStore.items.find((item) => item.id === banner.id)?.balance;

    if (balance && balance > 0) {
      const bannerId = banner.id;
      socketService.socket.emit("setBanner", {bannerId});
      soundService.play("click");
    }
  };

  onMount((): void => {
    const balance = $inventoryStore.items.find((item) => item.id === banner.id)?.balance;
    bal = balance || 0n;
  });

  export {banner};
</script>

<style>
  .banner {
    position: relative;
    cursor: pointer;
    filter: grayscale(0.5);
    transition: filter 400ms ease-in-out;
  }

  .banner:hover {
    filter: grayscale(0);
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
  class:banner="{bal > 0}"
  class:locked="{bal < 1}"
  on:click="{onSetBanner}">
  <img src="images/items/{banner.id}.png" alt="Banner {banner.id}"/>
  {#if bal < 1}
    <i class="lock">🔒</i>
  {/if}
</div>
