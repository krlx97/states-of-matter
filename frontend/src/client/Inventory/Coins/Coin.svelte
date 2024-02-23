<script lang="ts">
  import {soundService} from "services";
  import {inventoryStore} from "stores";
  import {CurrencyComponent, MenuComponent} from "ui";

  let coin: any;
  let isMenuToggled = false;
  $: number = $inventoryStore[coin.ticker as "ecr" | "enrg"];

  const onToggleMenu = (): void => {
    soundService.play("click");
    isMenuToggled = !isMenuToggled;
  };

  export {coin};
</script>

<style>
  .coin {
    position: relative;
    padding: var(--md) 0;
    width: 160px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--xl);
    border: 1px solid transparent;
    border-radius: 8px;
    transition: border-color 333ms cubic-bezier(var(--ease-in-out-quad));
  }

  .coin:hover {
    border-color: rgba(var(--grey), var(--opacity-sm));
    cursor: pointer;
  }

  .coin__text {
    text-align: center;
  }
</style>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="coin" on:click="{onToggleMenu}">
  <img src="images/currencies/{coin.ticker}.png" alt="{coin.name}"/>
  <div class="coin__text">
    <CurrencyComponent name="{coin.ticker}" {number} isIconVisible="{false}"/>
  </div>
  {#if isMenuToggled}
    <MenuComponent items="{coin.menuItems}"/>
  {/if}
</div>
