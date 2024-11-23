<script lang="ts">
  import MenuItem from "./MenuItem.svelte";
  import {fly, type FlyParams} from "svelte/transition";

  const flyParams: FlyParams = {
    y: -8,
    duration: 400,
    opacity: 0
  };
  let items: any[] = [];
  export {items};
</script>

<style>
  .menu {
    position: absolute;
    top: calc(100% + var(--xs));
    left: 0;
    display: flex;
    width: 128px;
    flex-direction: column;
    gap: var(--md);
    background-color: rgb(31, 31, 31);
    /* transform: translateX(-50%); */
    z-index: 105;
    cursor: initial;
    padding: var(--md);
    box-sizing: border-box;
    border-top-width: 0;
    border-right-width: 1px;
    border-bottom-width: 0;
    border-left-width: 1px;
    border-style: solid;
    border-image: linear-gradient(
      180deg,
      rgba(63,63,63,1) 0%,
      rgba(255,255,255,1) 50%,
      rgba(63,63,63,1) 100%
    ) 1;
  }
</style>

<div class="menu" in:fly="{flyParams}">
  {#each items as item}
    <MenuItem {item}/>
  {/each}
</div>