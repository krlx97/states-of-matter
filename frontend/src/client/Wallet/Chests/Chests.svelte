<script lang="ts">
  import {items} from "data";
  import {modalService} from "services";
  import {ItemComponent} from "ui";
  import ExploreComponent from "./modals/Explore.svelte";

  const onExplore = (id: any): void => {
    modalService.open(ExploreComponent, {id});
  };
</script>

<style>
  .container{
    max-height: calc(160px * 3 + var(--spacing-md) * 4);
    width: calc(112px * 5 + var(--spacing-md) * 6);
    padding: var(--spacing-md);
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-md);
    /* overflow-y: scroll; */
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
</style>

<div class="container">
  {#each items as item}
    {#if item.type === 0}
      <div on:click={() => onExplore(item.id)} on:keypress={() => onExplore(item.id)}>
        <ItemComponent {item}/>
      </div>
    {/if}
  {/each}
</div>
