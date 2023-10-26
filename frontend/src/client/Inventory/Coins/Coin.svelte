<script lang="ts">
  import {fly, type FlyParams} from "svelte/transition";
  import {walletStore} from "stores";
  import {CurrencyComponent} from "ui";

  let coin;
  let isMenuToggled = false;

  const flyParams: FlyParams = {
    y: -8,
    duration: 225,
    opacity: 0
  };

  const onToggleMenu = (): void => {
    isMenuToggled = !isMenuToggled;
  };

  export {coin};
</script>

<style>
  .coin {
    position: relative;
    padding: var(--spacing-md) 0;
    width: 128px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-md);
    /* border: 1px solid rgb(127, 127, 127); */
    border-radius: 8px;
    
    /* background-color: rgb(31, 31, 31); */
    transition: box-shadow 333ms ease, border-color 333ms ease, transform 333ms ease, background 333ms ease;
  }

  .coin:hover {
    border-color: rgb(255, 255, 255);
    /* transform: translateY(-2px); */
    cursor: pointer;
background: linear-gradient(
      180deg,
      rgba(179, 105, 244, 0.1) 0%,
      rgba(0, 0, 0, 0) 50%,
      rgba(179, 105, 244, 0.1) 100%
    );
    /* background-color: rgb(31, 31, 31); */

  }

  .coin__text {
    text-align: center;
  }

  .coin__menu {
    position: absolute;
    top: 8px;
    left: 8px;
    z-index: 100;
  }
</style>

<div class="coin">
  <img src="assets/currencies/{coin.ticker}.png" alt="{coin.name}"/>
  <div class="coin__text">
    <CurrencyComponent name="{coin.ticker}" number="{$walletStore[coin.ticker].balance}" isIconVisible="{false}"/>
  </div>
  <button class="button-icon coin__menu" on:click={onToggleMenu}>
    <i class="fa-solid fa-bars"></i>
  </button>
  {#if isMenuToggled}
    <div class="menu" transition:fly={flyParams}>
      {#each coin.menuItems as menuItem}
        <button class="menu__link" on:click="{menuItem[1]}">
          {menuItem[0]}
        </button>
      {/each}
    </div>
  {/if}
</div>