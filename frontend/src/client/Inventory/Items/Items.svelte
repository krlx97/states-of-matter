<script lang="ts">
  import {items} from "@som/shared/data";
  import {ButtonComponent, CurrencyComponent, LinkComponent, SelectComponent} from "ui";
  import ItemComponent from "./Item.svelte";
    import { modalService, soundService } from "services";
    import Unlock from "./modals/Unlock.svelte";
    import { inventoryStore } from "stores";
    import { onDestroy, onMount } from "svelte";

const inDevelopment = [
    11110, 11120, 11130, 11140, 11150, 11160,
    11300, 11310, 11320, 11400, 11410, 11420,
    11610, 11620, 11630, 11640, 11650, 11660,
    11800, 11810, 11820, 11900, 11910, 11920,
    12110, 12120, 12130, 12140, 12150, 12160,
    12300, 12310, 12320, 12400, 12410, 12420
  ];
  let currentSort = "Initial";
  let sortAscending = true;

  let selectedRarity = "All";
  let selectedType = "All";
    const x = items.filter((itm) => !inDevelopment.includes(itm.id));

  let filteredItems = x;
  let scrollTimeout: NodeJS.Timeout;
  let inc = 0;

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
          } else if (selectedRarity === "Mythic" && item.rarity === 5) {
            return true;
          } else {
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
    filteredItems = filteredItems.sort((a, b) => a.id - b.id);

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
      }
      if (b.rarity === 0 && a.rarity !== 0) {
        return -1; // Common rarity (0) always comes after others
      }
      if (a.rarity === 0 && b.rarity === 0) {
        return 0; // Both are common rarity, leave them as is
      }

      let aInventory = $inventoryStore.items.find((item): boolean => item.id === BigInt(a.id));
      let bInventory = $inventoryStore.items.find((item): boolean => item.id === BigInt(b.id));

      if (!aInventory || !bInventory) {
        return 0;
      }

      return sortAscending ? Number(aInventory.balance - bInventory.balance) : Number(bInventory.balance - aInventory.balance);
    });

    soundService.play("click");
  };

  const onSortSupply = (): void => {
    if (currentSort === "Supply") {
      sortAscending = !sortAscending;
    } else {
      sortAscending = true;
      currentSort = "Supply";
    }

    filteredItems = filteredItems.sort((a, b) => {
      if (a.rarity === 0 && b.rarity !== 0) {
        return 1; // Common rarity (0) always comes after others
      }
      if (b.rarity === 0 && a.rarity !== 0) {
        return -1; // Common rarity (0) always comes after others
      }
      if (a.rarity === 0 && b.rarity === 0) {
        return 0; // Both are common rarity, leave them as is
      }

      let aInventory = $inventoryStore.items.find((item): boolean => item.id === BigInt(a.id));
      let bInventory = $inventoryStore.items.find((item): boolean => item.id === BigInt(b.id));

      if (!aInventory || !bInventory) {
        return 0;
      }

      return sortAscending ? Number(aInventory.supply - bInventory.supply) : Number(bInventory.supply - aInventory.supply);
    });

    soundService.play("click");
  };

  const onRandomItem = (): void => {
    modalService.open(Unlock);
  };

  let unsub;
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
      <LinkComponent color="{currentSort === "Supply" ? "primary" : "white"}" on:click="{onSortSupply}">
        Supply
        {#if currentSort === "Supply"}
          <i class="fa-solid fa-sort-{sortAscending ? "up" : "down"}"></i>
        {/if}
      </LinkComponent>
    </div>
    <!-- <CurrencyComponent iconSize="sm" name="shard" number="{12n}"/> -->

    <ButtonComponent on:click={onRandomItem}>CRAFT RANDOM</ButtonComponent>
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
