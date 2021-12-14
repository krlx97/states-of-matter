<script lang="ts">
  import Avatars from "./Avatars.svelte";
  import CardbackSkins from "./CardbackSkins.svelte";
  import CardSkins from "./CardSkins.svelte";

  const navs = [
    {name: "Avatars", component: Avatars},
    {name: "Card Skins", component: CardSkins},
    {name: "Cardback Skins", component: CardbackSkins}
  ];

  let selekted = navs[0];
</script>

<style lang="scss">
  @import "../../../styles/variables";

  .non-fungible__tokens {
    padding: $spacing-md;
  }
  nav {
    display: flex;
  }
  .selected {
    border-bottom: 2px solid $purple;
    box-sizing: border-box;
  }
</style>

<div class="non-fungible__tokens">
  <h3>Non Fungible Tokens</h3>

  <nav>
    {#each navs as nav}
      <div class:selected={selekted.name === nav.name} on:click={() => selekted = nav}>
        {nav.name}
      </div>
    {/each}
  </nav>

  <svelte:component this={selekted.component}/>
</div>