<script lang="ts">
  import {modalService, soundService} from "services";
  import {inventoryStore, playerStore} from "stores";
  import {ButtonComponent, CurrencyComponent, MenuComponent, TextComponent} from "ui";
  import Unlock from "./modals/Unlock.svelte";
  import Craft from "../Items/modals/Craft.svelte";
  import Transfer from "../Items/modals/Transfer.svelte";

  let isMenuToggled = false;

  const onViewRewards = (): void => {
    soundService.play("click");
  };

  const onCraft = (): void => {
    modalService.open(Craft, {id: 1});
    soundService.play("click");
  };

  const onTransfer = (): void => {
    modalService.open(Transfer, {id: 1});
    soundService.play("click");
  };

  const onUnlock = (): void => {
    modalService.open(Unlock);
    soundService.play("click");
  };

  const onToggleMenu = (): void => {
    soundService.play("click");
    isMenuToggled = !isMenuToggled;
  };
</script>

<style>
  .bar {
    position: relative;
    height: 96px;
    width: 96px;
    /* padding: var(--md); */
    /* width: 192px; */
    display: flex;
    align-items: center;
    justify-content: center;
    /* flex-direction: column; */
    /* align-items: center; */
    /* gap: var(--md); */
    /* background-color: rgb(var(--dark-grey)); */
    /* border: 1px solid rgb(var(--grey)); */
    /* border-radius: 50%; */
    /* overflow: hidden; */
    cursor: pointer;
  }

  .bar__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--md);
  }

  .bar__header__title {
    font-size: var(--lg);
  }
  .bar__header__actions {
    display: flex;
    gap: var(--md);
  }

  .bar__currency {
    align-self: center;
  }

.item__title {
    position: absolute;
    bottom: 0;
    left: 0;
    /* height: 24px; */
    /* width: 100%; */
    padding: var(--xs);;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    font-size: var(--xs);
    background-color: rgb(var(--primary));
    /* z-index: 250; */
    border-radius: 50%;
  }
</style>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="bar" on:click="{onToggleMenu}">

  <!-- <div style="overflow: hidden;"> -->
  <img src="images/items/1.png"/>
  <!-- </div> -->

  <!-- <div class="bar__header"> -->
    <div class="item__title">
      <!-- <div>Chest</div> -->
      <div>{$inventoryStore.chests}</div>
    </div>
  <!-- </div> -->

  {#if isMenuToggled}
    <MenuComponent items="{[
      ["TRANSFER", onTransfer],
      ["CRAFT", onCraft],
      ["UNLOCK", onUnlock]
    ]}"/>
  {/if}
</div>
