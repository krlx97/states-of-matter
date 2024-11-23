<script lang="ts">
  import {inventoryStore} from "stores";
  import {ModalComponent} from "ui";
  import AvatarComponent from "./Avatar.svelte";
</script>

<style>
  .avatars {
    display: flex;
    gap: var(--md);
  }
</style>

<ModalComponent>
  <div class="avatars">
    {#each $inventoryStore.collectibles.items as item}
      {#if item.type === 0}
        <AvatarComponent avatar="{item}"/>
      {/if}
    {/each}
  </div>
</ModalComponent>
