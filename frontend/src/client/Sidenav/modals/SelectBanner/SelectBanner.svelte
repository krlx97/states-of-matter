<script lang="ts">
  import {inventoryStore} from "stores";
  import {ModalComponent} from "ui";
  import BannerComponent from "../SelectBanner/Banner.svelte";
</script>

<style>
  .banners {
    display: flex;
    flex-direction: column;
    gap: var(--md);
  }
</style>

<ModalComponent width="384px">
  <div class="banners">
    {#each $inventoryStore.collectibles.items as item}
      {#if item.type === 1}
        <BannerComponent banner="{item}"/>
      {/if}
    {/each}
  </div>
</ModalComponent>
