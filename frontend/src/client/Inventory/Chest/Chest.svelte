<script lang="ts">
  import {modalService, soundService} from "services";
  import {inventoryStore} from "stores";
  import {MenuComponent} from "ui";
  import UnlockComponent from "./modals/Unlock.svelte";
  import CraftComponent from "../Items/modals/Craft.svelte";
  import TransferComponent from "../Items/modals/Transfer.svelte";

  const id = 1;
  let isMenuToggled = false;

  const onToggleMenu = (): void => {
    soundService.play("click");
    isMenuToggled = !isMenuToggled;
  };

  const onTransfer = (): void => {
    soundService.play("click");
    modalService.open(TransferComponent, {id});
  };

  const onCraft = (): void => {
    soundService.play("click");
    modalService.open(CraftComponent, {id});
  };

  const onUnlock = (): void => {
    soundService.play("click");
    modalService.open(UnlockComponent);
  };
</script>

<style>
  .bar {
    position: relative;
    height: 96px;
    width: 96px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .item__title {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: var(--xs);;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    font-size: var(--xs);
    background-color: rgb(var(--primary));
    border-radius: 50%;
  }
</style>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="bar" on:click="{onToggleMenu}">

  <img src="images/items/1.png" alt="Chest"/>

  <div class="item__title">{$inventoryStore.chests}</div>

  {#if isMenuToggled}
    <MenuComponent items="{[
      ["TRANSFER", onTransfer],
      ["CRAFT", onCraft],
      ["UNLOCK", onUnlock]
    ]}"/>
  {/if}
</div>
