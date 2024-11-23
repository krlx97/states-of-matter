<script lang="ts">
  import {modalService, socketService, soundService} from "services";
  import {ItemComponent, MenuComponent} from "ui";
  import TransferComponent from "./modals/Transfer.svelte";
  import CraftComponent from "./modals/Craft.svelte";
  import TransferShard from "./modals/TransferShard.svelte";
  import { inventoryStore, modalStore, playerStore } from "stores";
  import { items } from "@som/shared/data";
  import { onMount } from "svelte";

  let item: any;
  let clientItem = items.find((i) => BigInt(i.id) === item.id);
  let isMenuToggled = false;

  // let invitem: any = $inventoryStore.collectibles.items.find((i) => i.id === BigInt(skin.id));
  // let selectedSkin = $playerStore.skins.find(({cardId}): boolean => clientItem?.type === 2 && clientItem.cardId === cardId);
  // let isSelected = BigInt(selectedSkin.skinId) === item.id;

  let skin: any;
  let selectedSkin: any = $playerStore.skins[0];
  // let invitem: any = $inventoryStore.collectibles.items.find((i) => i.id === BigInt(item.id));
  let isSelected = BigInt(selectedSkin.skinId) === item?.id;
  onMount((): void => {
    if (!clientItem) { return; }

    if (clientItem.type === 2) {
      selectedSkin = $playerStore.skins.find(({cardId}): boolean => clientItem.cardId === cardId);
      // invitem = $inventoryStore.collectibles.items.find((i) => i.id === BigInt(item.id));
      isSelected = BigInt(selectedSkin.skinId) === item.id;
      console.log(selectedSkin.skinId, item.id, isSelected);
    }
  });

  const onToggleMenu = (): void => {
    if (item.rarity === 0) {
      return;
    }

    isMenuToggled = !isMenuToggled;
    soundService.play("click");
  };

  const onSelectSkin = (): void => {
    // return console.log(item, clientItem);
    if (item.rarity !== 0 && item.balance < 1 || clientItem?.type !== 2) { return; }

    soundService.play("click");

    socketService.socket.emit("selectSkin" as any, {
      cardId: clientItem.cardId,
      skinId: clientItem.id
    });
  };

  const onTransferItem = (): void => {
    modalService.open(TransferComponent, {item});
    soundService.play("click");
  };

  const onCraft = (): void => {
    modalStore.open("Craft", {item});
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
  <ItemComponent isGrayscaled isActiveBorder={isSelected} {item}/>
  {#if isMenuToggled}
    <MenuComponent items="{[
      ["SELECT", onSelectSkin],
      ["TRANSFER", onTransferItem],
      ["TRANSFER []", onTransferShard],
      ["CRAFT", onCraft],
    ]}"/>
  {/if}
</div>
