<script lang="ts">
  import {playerStore} from "stores";
  import Governance from "./Governance.svelte";
  import Leaderboards from "./leaderboards/Leaderboards.svelte";
  import Market from "./Market.svelte";
  import Collection from "./collection/Collection.svelte";
  import Decks from "./decks/Decks.svelte";
  import Play from "./play/Play.svelte";
  import Img from "../ui/Img.svelte";
  import Text from "../ui/Text.svelte";

  const views = [
    {name: "Play",          component: Play},
    {name: "Decks",         component: Decks},
    {name: "Collection",    component: Collection},
    {name: "Market",        component: Market},
    {name: "Leaderboards",  component: Leaderboards},
    {name: "Governance",    component: Governance}
  ];

  let currentView = views[0];
</script>

<style lang="scss">
  @import "../shared/styles/variables";
  @import "../shared/styles/mixins";

  .client {
    height: 100%;
    width: 100%;
    @include flex(column);
    background-image: url("/assets/clientbg.png");
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;

    &__header {
      height: 128px;
      @include flex($align-items: center, $justify-content: space-between);
      border-bottom: 2px solid $light-grey;
      box-sizing: border-box;

      &__currencies {display: flex}
      &__currency {
        width: 160px;
        @include flex(column, center, center);
        font-size: $font-lg;
      }
    }

    &__content {height: calc(100% - 128px)}
  }

  .links {display: flex}
  .link--active {border-bottom: 2px solid $purple;}
  .link { padding: 1em }
  .link:hover {
    background-color: $purple;
    cursor: pointer;
  }
</style>

<div class="client">
  <div class="client__header">
    <div style="display: flex; align-items: center;"> <!-- ;w; -->
      <img src="assets/logo.png" alt="Logo" style="margin: 0 1em"/>
      <div class="links">
        {#each views as view}
          <div
            class="link"
            class:link--active={view.name === currentView.name}
            on:click={() => currentView = view}>
            {view.name}
          </div>
        {/each}
      </div>
    </div>
    <div class="client__header__currencies">
      <div class="client__header__currency">
        <Img src="currencies/LMT.png" alt="LMT"/>
        <br/>
        <Text>{$playerStore.wallet[1]}</Text>
      </div>
      <div class="client__header__currency">
        <Img src="currencies/DMT.png" alt="DMT"/>
        <br/>
        <Text>{$playerStore.wallet[2]}</Text>
      </div>
    </div>
  </div>
  <div class="client__content">
    <svelte:component this={currentView.component}/>
  </div>
</div>
