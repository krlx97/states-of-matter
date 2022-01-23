<script lang="ts">
  import {onDestroy, onMount} from "svelte";
  import {socketService} from "services";
  import * as responses from "client/responses";

  import Governance from "./Governance.svelte";
  import Leaderboards from "./Leaderboards.svelte";
  import Market from "./Market.svelte";
  import Collection from "./collection/Collection.svelte";
  import Decks from "./decks/Decks.svelte";
  import Play from "./play/Play.svelte";
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

  onMount(() => { socketService.listen(responses); });
  onDestroy(() => { socketService.forget(responses); });
</script>

<style lang="scss">
  @import "../shared/styles/variables";
  @import "../shared/styles/mixins";

  .client {
    height: 100%;
    width: 100%;
    @include flex(column);

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

  nav {display: flex;}
  ul {
    list-style-type: none;
    display: flex;
  }
  .link--active {border-bottom: 2px solid $purple;}
  li { padding: 1em }
  li:hover {
    background-color: $purple;
    cursor: pointer;
  }
</style>

<div class="client">

  <div class="client__header">

    <nav>
      <ul class="links">
        {#each views as view}
          <li
            class="link"
            class:link--active={view.name === currentView.name}
            on:click={() => currentView = view}
          >{view.name}</li>
        {/each}
      </ul>
    </nav>

    <div class="client__header__currencies">
      <div class="client__header__currency">
        <img src="assets/currencies/somt.png" alt="SOMT"/>
        <Text>123123456.4657</Text>
      </div>
      <div class="client__header__currency">
        <img src="assets/currencies/soma.png" alt="SOMA"/>
        <Text>1324</Text>
      </div>
    </div>

  </div>

  <div class="client__content">
    <svelte:component this={currentView.component}/>
  </div>

</div>
