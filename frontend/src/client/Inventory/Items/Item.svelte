<script lang="ts">
  import {modalService, soundService} from "services";
  import {ItemComponent, MenuComponent} from "ui";
  import TransferComponent from "./modals/Transfer.svelte";
  import CraftComponent from "./modals/Craft.svelte";
  import TransferShard from "./modals/TransferShard.svelte";

  let item: any;
  let isMenuToggled = false;

  const onToggleMenu = (): void => {
    if (item.rarity === 0) {
      return;
    }

    isMenuToggled = !isMenuToggled;
    soundService.play("click");
  };

  const onTransferItem = (): void => {
    modalService.open(TransferComponent, {item});
    soundService.play("click");
  };

  const onCraft = (): void => {
    modalService.open(CraftComponent, {item});
    soundService.play("click");
  };

  const onTransferShard = (): void => {
    modalService.open(TransferShard, {item});
    soundService.play("click");
  };

  export {item};
</script>

<style>
  .item {
    position : relative;
  }
</style>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="item" on:click="{onToggleMenu}">
  <ItemComponent isGrayscaled {item}/>
  {#if isMenuToggled}
    <MenuComponent items="{[
      ["TRANSFER ITEM", onTransferItem],
      ["TRANSFER SHARD", onTransferShard],
      ["CRAFT", onCraft],
    ]}"/>
  {/if}
</div>
