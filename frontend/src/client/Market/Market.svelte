<script lang="ts">
  import {onMount} from "svelte";
  import {modalService, socketService} from "services";
  import {accountStore, marketItemsStore} from "stores";
  import ListItemComponent from "./modals/ListItem.svelte";
  import MarketItemComponent from "./MarketItem.svelte";
    import BindMetamask from "../../auth/BindMetamask.svelte";

  const onListItem = (): void => {
    modalService.open(ListItemComponent);
  };

  onMount((): void => {
    socketService.socket.on("getMarketItems" as any, (params) => {
      $marketItemsStore = [...params.items];
    });

    socketService.socket.emit("getMarketItems" as any);
  });
</script>

<style>
  .market {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-md);
  }

  .items {
    width: calc(384px * 2 + var(--spacing-md));
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-md);
  }
</style>

{#if $accountStore.publicKey}
  <div class="market">
    <div class="items">
      {#if $marketItemsStore.length}
        {#each $marketItemsStore as item}
          <MarketItemComponent {item}/>
        {/each}
      {:else}
        No items for sale...
      {/if}
    </div>
    <button on:click={onListItem}>LIST ITEM</button>
  </div>
{:else}
  <BindMetamask/>
{/if}