<script lang="ts">
  import {items} from "@som/shared/data"
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
    {#each items as item}
      {#if item.type === 1}
        <BannerComponent banner="{item}"/>
      {/if}
    {/each}
  </div>
</ModalComponent>
