<script lang="ts">
  import Governance from "./Governance.svelte";
  import Leaderboards from "./leaderboards/Leaderboards.svelte";
  import Market from "./Market.svelte";
  import Decks from "./decks/Decks.svelte";
  import Play from "./play/Play.svelte";
  import Sidenav from "./sidenav/Sidenav.svelte";

  const views = [
    {name: "Play",          component: Play},
    {name: "Decks",         component: Decks},
    {name: "Market",        component: Market},
    {name: "Leaderboards",  component: Leaderboards},
    {name: "Governance",    component: Governance}
  ];

  let currentView = views[0];
</script>

<style>
  .client {
    height: 100%;
    width: 100%;
    display: flex;
    background: linear-gradient(
      180deg,
      rgba(179, 105, 244, 0.05) 0%,
      rgba(0, 0, 0, 0) 10%
    );
  }

  .client__views {
    flex-basis: 1152px;
    display: flex;
    flex-direction: column;
    background-image: url("/assets/clientbg.png");
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }

  /* .client__header {
    background: linear-gradient(
      180deg,
      rgba(179, 105, 244, 0.05) 0%,
      rgba(0, 0, 0, 0) 100%
    );
  } */

  .client__content {
    flex-grow: 1;
  }

  /* .logo {
    margin: 0 var(--spacing-md);
  } */

  .client__sidenav {
    flex-basis: 448px;
  }
</style>

<div class="client">

  <div class="client__views">

    <!-- <div class="client__header"> -->
      <!-- <img class="logo" src="assets/logo.png" alt="Logo"/> -->
      <div class="links">
        {#each views as view}
          <div
            class="link"
            class:linkActive={view.name === currentView.name}
            on:click={() => currentView = view}
            on:keypress={() => currentView = view}>
            {view.name}
          </div>
        {/each}
      </div>
    <!-- </div> -->

    <div class="client__content">
      <svelte:component this={currentView.component}/>
    </div>

  </div>

  <div class="client__sidenav">
    <Sidenav/>
  </div>
</div>