<script lang="ts">
  import Avatars from "./Avatars.svelte";

  const navLinks = [
    {ref: undefined, name: "Avatars"},
    {ref: undefined, name: "Card Skins"},
    {ref: undefined, name: "Card Back Skins"}
  ];
  let view = "Deck";

  const setNavActive = (ref) => {
    navLinks.forEach((navLink) => {
      navLink.ref.classList.remove("f--purple");
    });

    ref.classList.add("f--purple");
  };

  const gotoView = (ref, name) => {
    view = name;
    setNavActive(ref);
  };
</script>

<style lang="scss">
  @import "../../../styles/mixins";
  @import "../../../styles/variables";

  .collection {
    height: 100%;
    width: 100%;
    @include d-flex(column, space-between, center);
  }

  nav {
    padding: $spacing-md;
    display: flex;
    box-sizing: border-box;
  }
  main {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .coming-soon {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4rem;
  }
</style>

<div class="collection">
  <nav>
    {#each navLinks as {ref, name}}
      <div on:click={() => gotoView(ref, name)}>
        <i class="fas fa-circle fa-fw" bind:this={ref}></i> {name}
      </div>
    {/each}
  </nav>
  <main>
    {#if view === "Avatars"}
      <Avatars/>
    {:else if view === "Card Skins"}
      <p class="coming-soon">Card Skins coming soon... 😉</p>
    {:else if view === "Card Back Skins"}
      <p class="coming-soon">Card Back Skins coming soon... 😉</p>
    {/if}
  </main>
</div>
