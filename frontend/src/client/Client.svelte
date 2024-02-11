<script lang="ts">
  import {soundService} from "services";
  import {inventoryStore} from "stores";
  import {CurrencyComponent, LinkComponent} from "ui";
  import DeckBuilderComponent from "./DeckBuilder/DeckBuilder.svelte";
  import InventoryComponent from "./Inventory/Inventory.svelte";
  import LeaderboardsComponent from "./Leaderboards/Leaderboards.svelte";
  import PlayComponent from "./Play/Play.svelte";
  import SidenavComponent from "./Sidenav/Sidenav.svelte";

  const views = [
    {name: "Play",          component: PlayComponent},
    {name: "Deck Builder",  component: DeckBuilderComponent},
    {name: "Leaderboards",  component: LeaderboardsComponent},
    {name: "Inventory",     component: InventoryComponent}
  ];

  let currentView = views[0];

  const onChangeView = (view: any): void => {
    soundService.play("click");
    currentView = view;
  };
</script>

<style>
  .client {
    height: 100%;
    width: 100%;
    display: flex;
    background-image: url("/images/clientbg.png");
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }

  .client__views {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .client__views__nav {
    height: 64px;
    padding: 0 var(--md);
    display: flex;
    align-items: center;
    gap: var(--md);
    backdrop-filter: blur(4px);
    background-color: rgba(31, 31, 31, 0.2);
    border: 0 solid;
    border-bottom-width: 1px;
    border-image: linear-gradient(
      90deg,
      rgb(var(--dark-grey), 1) 0%,
      rgb(var(--grey), 1) 50%,
      rgb(var(--dark-grey), 1) 100%
    ) 1;
    box-sizing: border-box;
  }

  .client__views__nav__currencies {
    display: flex;
    gap: 32px;
    margin-left: auto;
  }

  .client__views__view {
    flex-grow: 1;
  }
</style>

<div class="client">

  <div class="client__views">

    <div class="client__views__nav">
      <img src="images/logo.png" alt="Logo" height="48"/>

      {#each views as view}
        <LinkComponent
          color="white"
          isActive="{view === currentView}"
          on:click="{() => onChangeView(view)}">
          {view.name}
        </LinkComponent>
      {/each}

      <div class="client__views__nav__currencies">
        <CurrencyComponent iconSize="sm" name="ees" number="{$inventoryStore.ees}"/>
        <CurrencyComponent iconSize="sm" name="ecr" number="{$inventoryStore.ecr}"/>
        <CurrencyComponent iconSize="sm" name="enrg" number="{$inventoryStore.enrg}"/>
      </div>
    </div>

    <div class="client__views__view">
      <svelte:component this="{currentView.component}"/>
    </div>
  </div>

  <SidenavComponent/>

</div>
