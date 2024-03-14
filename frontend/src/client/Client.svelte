<script lang="ts">
  import {soundService} from "services";
  import {LinkComponent, TextComponent} from "ui";
  import DeckBuilderComponent from "./DeckBuilder/DeckBuilder.svelte";
  import InventoryComponent from "./Inventory/Inventory.svelte";
  import LeaderboardsComponent from "./Leaderboards/Leaderboards.svelte";
  import PatchNotesComponent from "./PatchNotes/PatchNotes.svelte";
  import PlayComponent from "./Play/Play.svelte";
  import SidenavComponent from "./Sidenav/Sidenav.svelte";

  const views = [
    {name: "Play",          component: PlayComponent},
    {name: "Deck Builder",  component: DeckBuilderComponent},
    {name: "Leaderboards",  component: LeaderboardsComponent},
    {name: "Inventory",     component: InventoryComponent},
    {name: "Patch notes",   component: PatchNotesComponent}
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
    background-color: rgba(var(--dark-grey), 0.333);
    backdrop-filter: blur(var(--md));
    border: 0 solid;
    border-bottom-width: 1px;
    border-image: linear-gradient(
      90deg,
      rgb(var(--dark-grey)) 0%,
      rgba(var(--grey), 0.3333) 50%,
      rgb(var(--dark-grey)) 100%
    ) 1;
    box-sizing: border-box;
  }

  .client__views__nav__currencies {
    display: flex;
    align-items: center;
    gap: var(--md);
    margin-left: auto;
  }

  .client__views__view {
    flex-grow: 1;
  }

  .logo {
    padding-right: var(--xl);
  }

  a {
    color: rgb(var(--white));
    text-decoration: none;
  }
</style>

<div class="client">

  <div class="client__views">

    <div class="client__views__nav">
      <img class="logo" src="images/logo.png" alt="Logo" height="32"/>

      {#each views as view}
        <LinkComponent
          color="white"
          isActive="{view === currentView}"
          on:click="{() => onChangeView(view)}">
          {view.name}
        </LinkComponent>
      {/each}

      <div class="client__views__nav__currencies">
        <!-- <div>
          <TextComponent isBold size="xl">
            v0.4.0
          </TextComponent>
        </div> -->
        <a href="https://discord.gg/wD9K74V8mT" target="_blank"><i class="fa-brands fa-discord fa-2x"></i></a>
        <a href="https://twitter.com/EternitasGames" target="_blank"><i class="fa-brands fa-x-twitter fa-2x"></i></a>
        <a href="https://github.com/krlx97" target="_blank"><i class="fa-brands fa-github fa-2x"></i></a>
        <a href="https://www.telos.net/getting-started-with-zero" target="_blank"><img src="images/telos.png" alt="TelosZero"/></a>
        <a href="https://www.telos.net/getting-started-with-evm" target="_blank"><img src="images/telosevm.png" alt="TelosEVM"/></a>
        <a href="https://cultureblock.io/" target="_blank"><img height="32" src="images/telosculture.webp" alt="CultureBlock"/></a>
      </div>
    </div>

    <div class="client__views__view">
      <svelte:component this="{currentView.component}"/>
    </div>

  </div>

  <SidenavComponent/>

</div>
