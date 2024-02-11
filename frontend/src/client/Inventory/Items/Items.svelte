<script lang="ts">
  import {items} from "@som/shared/data";
  import {SelectComponent} from "ui";
  import ItemComponent from "./Item.svelte";

  let selectedRarity = "All";
  let selectedType = "All";
  let filteredItems = [...items];
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
    filteredItems = [...items]
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
    display: flex;
    gap: var(--md);
  }
</style>

<div class="items">
  <div class="nav">
    <SelectComponent
      values="{[
        "All",
        "Common",
        "Uncommon",
        "Rare",
        "Epic",
        "Legendary",
        "Mythic",
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
