<script lang="ts">
  import FungibleTokens from "./FungibleTokens.svelte";
  import NonfungibleTokens from "./NonfungibleTokens.svelte";

  const views = [
    {name: "Fungible", component: FungibleTokens},
    {name: "Non-Fungible", component: NonfungibleTokens}
  ];

  let currentView = views[0];
</script>

<style>
  .wallet {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .wallet__content {
    width: 100%;
    flex-grow: 1;
  }
</style>

<div class="wallet">
  <div class="links">
    {#each views as view}
      <div
        class="link"
        class:linkActive={view.name === currentView.name}
        on:click={() => currentView = view}
        on:keypress={() => currentView = view}
      >
        {view.name}
      </div>
    {/each}
  </div>

  <div class="wallet__content">
    <svelte:component this={currentView.component}/>
  </div>
</div>
