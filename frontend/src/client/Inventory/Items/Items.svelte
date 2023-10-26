<script lang="ts">
  import {items} from "data";
    import { modalService } from "services";
  import {ItemComponent} from "ui";
    import ExploreChest from "./modals/ExploreChest.svelte";
    import ExploreShard from "./modals/ExploreShard.svelte";
    import ExploreSkin from "./modals/ExploreSkin.svelte";

  const views = [{
    name: "Chests",
    type: 0
  }, {
    name: "Shards",
    type: 1
  }, {
    name: "Skins",
    type: 2
  }];

  const explorers = new Map([
    [0, ExploreChest],
    [1, ExploreShard],
    [2, ExploreSkin],
  ]);

  let currentView = views[0];

  const onExplore = (id: number): void => {
    modalService.open(explorers.get(currentView.type), {id});
  };
</script>

<style>
  .items {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }
  .container {
    height: calc(175px * 3 + var(--spacing-md) * 4);
    width: calc(112px * 5 + var(--spacing-md) * 6);
    padding: var(--spacing-md);
    box-sizing: border-box;
    overflow: hidden;
  }
  .container::-webkit-scrollbar {
    width: 8px;
  }
  .container::-webkit-scrollbar-track {
    background-color: rgb(63, 63, 63);
    border-radius: 8px;
  }
  .container::-webkit-scrollbar-thumb {
    background-color: rgb(127, 127, 127);
    border-radius: 8px;
  }

  .container__inner {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-md);
  }
</style>

<div class="items">
  <div class="nav">
    {#each views as view}
      <button
        class="nav__link"
        class:linkActive={view.name === currentView.name}
        on:click={() => currentView = view}>
        {view.name}
      </button>
    {/each}
  </div>

  <div class="container">
    <div class="container__inner">
      {#each items as item}
        {#if item.type === currentView.type}
          <div on:click={() => onExplore(item.id)} on:keypress={() => onExplore(item.id)}>
            <ItemComponent {item}/>
          </div>
        {/if}
      {/each}
    </div>
  </div>
</div>
