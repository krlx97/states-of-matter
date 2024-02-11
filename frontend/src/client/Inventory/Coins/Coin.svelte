<script lang="ts">
  import {soundService} from "services";
  import {inventoryStore} from "stores";
  import {CurrencyComponent, MenuComponent} from "ui";

  let coin: any;
  let isMenuToggled = false;
  const number = $inventoryStore[coin.ticker as "ecr" | "enrg"];

  const onToggleMenu = (): void => {
    isMenuToggled = !isMenuToggled;
    soundService.play("click");
  };

  export {coin};
</script>

<style>
  .coin {
    position: relative;
    padding: var(--md) 0;
    width: 128px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md);
    border: 1px solid transparent;
    border-radius: 8px;
    cursor: pointer;
    transition: border-color 400ms ease, background-color 400ms ease;
  }

  .coin:hover {
    border-color: rgb(var(--grey));
    background-color: rgb(var(--dark-grey));
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
