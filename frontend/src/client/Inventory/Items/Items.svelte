<script lang="ts">
  import {items} from "@som/shared/data";
  import {ButtonComponent, CurrencyComponent, LinkComponent, SelectComponent} from "ui";
  import { modalService, soundService } from "services";
  import { inventoryStore } from "stores";
  import { onDestroy, onMount } from "svelte";
  import ItemComponent from "./Item.svelte";
  import Unlock from "./modals/Unlock.svelte";

  const inDevelopment = [
    11110n, 11120n, 11130n, 11140n, 11150n, 11160n,
    11300n, 11310n, 11320n, 11400n, 11410n, 11420n,
    11610n, 11620n, 11630n, 11640n, 11650n, 11660n,
    11800n, 11810n, 11820n, 11900n, 11910n, 11920n,
    12110n, 12120n, 12130n, 12140n, 12150n, 12160n,
    12300n, 12310n, 12320n, 12400n, 12410n, 12420n
  ];

  let currentSort = "Initial";
  let sortAscending = true;
  let selectedRarity = "All";
  let selectedType = "All";
  const x = $inventoryStore.collectibles.items.filter((itm) => !inDevelopment.includes(itm.id));
  let filteredItems = x;
  let scrollTimeout: NodeJS.Timeout;
  let inc = 0;
  let unsub: any;

  const onScroll = () => {
    // item hover animation quick fix, find a better way
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    scrollTimeout = setTimeout(() => {
      inc += 1;
    }, 333);
  };

  const onFilterItems = (): void => {
    filteredItems = x
      .filter((item) => {
        if (selectedRarity === "All") {
          return true;
        } else {
          if (selectedRarity === "Common" && item.rarity === 0) {
            return true;
          } else if (selectedRarity === "Uncommon" && item.rarity === 1) {
            return true;
          } else if (selectedRarity === "Rare" && item.rarity === 2) {
            return true;
          } else if (selectedRarity === "Epic" && item.rarity === 3) {
            return true;
          } else if (selectedRarity === "Legendary" && item.rarity === 4) {
            return true;
          } /*else if (selectedRarity === "Mythic" && item.rarity === 5) {
            return true;
          } */else {
            return false;
          }
        }
      })
      .filter((item) => {
        if (selectedType === "All") {
          return true;
        } else {
          if (selectedType === "Avatar" && item.type === 0) {
            return true;
          } else if (selectedType === "Banner" && item.type === 1) {
            return true;
          } else if (selectedType === "Skin" && item.type === 2) {
            return true;
          } else {
            return false;
          }
        }
      });
  };

  const onSortInitial = (): void => {
    currentSort = "Initial";
    sortAscending = true;
    filteredItems = filteredItems.sort((a, b) => parseInt(a.id.toString()) - parseInt(b.id.toString()));

    soundService.play("click");
  };

  const onSortBalance = (): void => {
    if (currentSort === "Balance") {
      sortAscending = !sortAscending;
    } else {
      sortAscending = true;
      currentSort = "Balance";
    }

    filteredItems = filteredItems.sort((a, b) => {
      if (a.rarity === 0 && b.rarity !== 0) {
        return 1; // Common rarity (0) always comes after others
      } else if (b.rarity === 0 && a.rarity !== 0) {
        return -1; // Common rarity (0) always comes after others
      } else if (a.rarity === 0 && b.rarity === 0) {
        return 0; // Both are common rarity, leave them as is
      } else if (a.rarity !== 0 && b.rarity !== 0) {
        return sortAscending ? Number(a.balance - b.balance) : Number(b.balance - a.balance);
      }

      return 0;
    });

    soundService.play("click");
  };

  const onRandomItem = (): void => {
    modalService.open(Unlock);
  };

  onMount(() => {
    unsub = inventoryStore.subscribe((store) => {
      onFilterItems();
    });
  });

  onDestroy(() => {
    unsub();
  });
</script>

<style>
  .items {
    display: flex;
    flex-direction: column;
    gap: var(--md);
  }
  .container {
    /* for 3 items and their gaps */
    height: calc(166px * 3 + var(--md) * 4);
    /* for 8 items, their gaps, and scroll bar */
    width: calc(110px * 8 + var(--md) * 9 + 4px);
    padding: var(--md);
    box-sizing: border-box;
    overflow-y: scroll;
  
  }
  .container::-webkit-scrollbar {
    width: 4px;
  }

  .container::-webkit-scrollbar-track {
    border-radius: 8px;
  }

  .container::-webkit-scrollbar-thumb {
    background-color: rgb(var(--grey));
    border-radius: 8px;
  }

  .container__inner {
    display: flex;
    flex-wrap: wrap;
    gap: var(--md);
  }

  .nav {
    width: 100%;
    /* margin: 0 auto; */
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 calc(var(--md) * 2);
    box-sizing: border-box;
  }
</style>

<div class="items">
  <div class="nav">
    <div style="display: flex; gap: var(--md);">
      <SelectComponent
        values="{[
          "All",
          "Common",
          "Uncommon",
          "Rare",
          "Epic",
          "Legendary"
        ]}"
        label="Rarity"
        bind:selected="{selectedRarity}"
        on:change="{onFilterItems}"/>
      <SelectComponent
        values="{[
          "All",
          "Avatar",
          "Banner",
          "Skin"
        ]}"
        label="Type"
        bind:selected="{selectedType}"
        on:change="{onFilterItems}"/>
    </div>

    <div style="display: flex; gap: var(--md);">
      <LinkComponent color="{currentSort === "Initial" ? "primary" : "white"}" on:click="{onSortInitial}">
        Initial
      </LinkComponent>
      <LinkComponent color="{currentSort === "Balance" ? "primary" : "white"}" on:click="{onSortBalance}">
        Balance
        {#if currentSort === "Balance"}
          <i class="fa-solid fa-sort-{sortAscending ? "up" : "down"}"></i>
        {/if}
      </LinkComponent>
    </div>

    <ButtonComponent on:click="{onRandomItem}">
      <img src="images/currencies/sm/shard.png" alt="Shard Pack"/>
      SHARD PACKS {$inventoryStore.collectibles.shardPacks}
    </ButtonComponent>
  </div>

  <div class="container" on:scroll="{onScroll}">
    {#key inc}
      <div class="container__inner">
        {#key filteredItems}
          {#each filteredItems as item}
            <ItemComponent {item}/>
          {/each}
        {/key}
      </div>
    {/key}
  </div>
</div>
