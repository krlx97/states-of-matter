<script lang="ts">
  import {modalService, soundService} from "services";
  import {ItemComponent, MenuComponent} from "ui";
  import DisenchantComponent from "./modals/Disenchant.svelte";
  import TransferComponent from "./modals/Transfer.svelte";
  import CraftComponent from "./modals/Craft.svelte";

  let item: any;
  let isMenuToggled = false;
  const {id} = item;

  const onToggleMenu = (): void => {
    if (item.rarity === 0) {
      return;
    }

    isMenuToggled = !isMenuToggled;
    soundService.play("click");
  };

  const onTransfer = (): void => {
    modalService.open(TransferComponent, {id});
    soundService.play("click");
  };

  const onCraft = (): void => {
    modalService.open(CraftComponent, {id});
    soundService.play("click");
  };

  const onDisenchant = (): void => {
    modalService.open(DisenchantComponent, {id});
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
  <ItemComponent {item}/>
  {#if isMenuToggled}
    <MenuComponent items="{[
      ["TRANSFER", onTransfer],
      ["CRAFT", onCraft],
      ["DISENCHANT", onDisenchant]
    ]}"/>
  {/if}
</div>
