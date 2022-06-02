<script lang="ts">
  import Avatars from "./Avatars/Avatars.svelte";
  import CardBackSkins from "./CardBackSkins.svelte";
  import CardBorderSkins from "./CardBorderSkins.svelte";
  import CardSkins from "./CardSkins.svelte";

  const routes = [
    {name: "Cards",           component: CardSkins},
    {name: "Card Borders",    component: CardBorderSkins},
    {name: "Card Backs",      component: CardBackSkins},
    {name: "Avatars",         component: Avatars},
  ];

  let selekted = routes[0];
</script>

<style lang="scss">
  @import "../../shared/styles/variables";

  .skins {
    padding: $spacing-md;
    display: flex;
    flex-direction: column;
  }
  nav {
    display: flex;

    div {padding: 1em;}
  }
  .selected {
    border-bottom: 2px solid $purple;
    box-sizing: border-box;
  }
</style>

<div class="skins">
  <nav>
    {#each routes as route}
      <div
        class:selected={selekted.name === route.name}
        on:click={() => selekted = route}
      >
        {route.name}
      </div>
    {/each}
  </nav>

  <svelte:component this={selekted.component}/>
</div>
