<script lang="ts">
  import DeckBuilderComponent from "./deckBuilder/DeckBuilder.svelte";
  import LeaderboardsComponent from "./leaderboards/Leaderboards.svelte";
  import MarketComponent from "./Market/Market.svelte";
  import PlayComponent from "./play/Play.svelte";
  import SidenavComponent from "./sidenav/Sidenav.svelte";
  import WalletComponent from "./Wallet/Wallet.svelte";

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
    position: relative;
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
    <SidenavComponent/>
  </div>
</div>
