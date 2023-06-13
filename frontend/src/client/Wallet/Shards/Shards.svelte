<script lang="ts">
  import {items} from "data";
  import Shard from "./Shard.svelte";
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
    {#if item.type === 1}
      <Shard shard={item}/>
    {/if}
  {/each}
</div>
