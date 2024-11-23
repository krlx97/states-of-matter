<script lang="ts">
  import {onMount} from "svelte";
  import {socketService, soundService} from "services";

  let banner: any;
  let isLocked = true;

  const onSetBanner = (): void => {
    if (!isLocked) {
      soundService.play("click");
      const bannerId = parseInt(banner.id.toString());
      socketService.socket.emit("setBanner", {bannerId});
    }
  };

  onMount((): void => {
    if (banner && banner.rarity === 0 && banner.owned) {
      isLocked = false;
    } else if (banner && banner.rarity !== 0 && banner.balance > 0) {
      isLocked = false;
    }
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
  class:banner="{!isLocked}"
  class:locked="{isLocked}"
  on:click="{onSetBanner}">
  <img src="images/items/{banner.id}.png" alt="Banner {banner.id}"/>
  {#if isLocked}
    <i class="lock">🔒</i>
  {/if}
</div>
