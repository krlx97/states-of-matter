<script lang="ts">
  import DeckBuilderComponent from "./DeckBuilder/DeckBuilder.svelte";
  import LeaderboardsComponent from "./Leaderboards/Leaderboards.svelte";
  import MarketComponent from "./Market/Market.svelte";
  import PlayComponent from "./Play/Play.svelte";
  import SidenavComponent from "./Sidenav/Sidenav.svelte";
  import WalletComponent from "./Inventory/Inventory.svelte";

  const views = [
    {name: "Play", component: PlayComponent},
    {name: "Deck Builder", component: DeckBuilderComponent},
    {name: "Leaderboards", component: LeaderboardsComponent},
    {name: "Inventory", component: WalletComponent},
    {name: "Market", component: MarketComponent},
  ];

  let currentView = views[0];
</script>

<style>
  .client {
    height: 100%;
    width: 100%;
    display: flex;
    /* background: linear-gradient(
      180deg,
      rgba(179, 105, 244, 0.05) 0%,
      rgba(0, 0, 0, 0) 10%
    ); */
    background-image: url("/assets/clientbg.png");
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }

  .client__views {
    /* flex-basis: 1152px; */
    /* display: flex;
    flex-direction: column; */
    flex-grow: 1;
    /* background-image: url("/assets/clientbg.png");
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat; */
  }

  /* .client__header {
    background: linear-gradient(
      180deg,
      rgba(179, 105, 244, 0.05) 0%,
      rgba(0, 0, 0, 0) 100%
    );
  } */

  /* .client__content {
    position: relative;
    flex-grow: 1;
  } */

  /* .logo {
    margin: 0 var(--spacing-md);
  } */

  /* .client__sidenav {
    flex-basis: 448px;
  } */

  .client__menu {
    padding: var(--spacing-md);
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--spacing-md);
    font-size: 32px;

    border: 0 solid;
    border-right-width: 1px;
    border-image: linear-gradient(
      180deg,
      rgba(63, 63, 63, 1) 0%,
      rgba(255, 255, 255, 1) 50%,
      rgba(63, 63, 63, 1) 100%
    ) 1;
  }
</style>

<div class="client">

  <div class="client__menu">
    <i class="fa-solid fa-play" on:click={() => currentView =     {name: "Play", component: PlayComponent}}></i>
    <i class="fa-brands fa-docker" on:click={() => currentView = {name: "Deck Builder", component: DeckBuilderComponent}}></i>
    <i class="fa-solid fa-trophy" on:click={() => currentView = {name: "Leaderboards", component: LeaderboardsComponent}}></i>
    <i class="fa-solid fa-warehouse" on:click={() => currentView = {name: "Inventory", component: WalletComponent}}></i>
    <i class="fa-solid fa-store" on:click={() => currentView = {name: "Market", component: MarketComponent}}></i>
  </div>

  <div class="client__views">

    <!-- <div class="client__header"> -->
      <!-- <img class="logo" src="assets/logo.png" alt="Logo"/> -->
      <!-- <div class="links">
        {#each views as view}
          <div
            class="link"
            class:linkActive={view.name === currentView.name}
            on:click={() => currentView = view}
            on:keypress={() => currentView = view}>
            {view.name}
          </div>
        {/each}
      </div> -->
    <!-- </div> -->

    <!-- <div class="client__content"> -->
      <svelte:component this={currentView.component}/>
    <!-- </div> -->

  </div>

  <div class="client__sidenav">
    <SidenavComponent/>
  </div>
</div>
