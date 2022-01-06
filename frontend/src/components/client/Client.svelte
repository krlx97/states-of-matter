<script lang="ts">
  import {Text} from "components";
  import Governance from "./Governance.svelte";
  import Leaderboards from "./Leaderboards.svelte";
  import Market from "./Market.svelte";
  import Collection from "./collection/Collection.svelte";
  import Decks from "./decks/Decks.svelte";
  import Play from "./play/Play.svelte";

  let view = "Decks";

  const views = [
    "Play",
    "Decks",
    "Collection",
    "Market",
    "Leaderboards",
    "Governance"
  ];
</script>

<style lang="scss">
  @import "../../styles/variables";
  @import "../../styles/mixins";

  .client {
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
  }
  .client__container {
    width: 100%;
  }
  .client__container__bar {
    height: 128px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2px solid $light-grey;
    box-sizing: border-box;
  }
  .client__container__view {
    height: calc(100% - 128px);
  }

  nav {
    display: flex;
  }
  ul {
    list-style-type: none;
    display: flex;

  }
  .link--active {
    border-bottom: 2px solid $purple;
  }
  li { padding: 1em }
  li:hover {
    background-color: $purple;
    cursor: pointer;
  }

  .header__currencies { display: flex }
  .header__currency {
    width: 160px;
    @include flex(column, center, center);
    font-size: $font-lg;

    img {
      margin-bottom: $spacing-sm;
    }
  }
</style>

<div class="client">

  <div class="client__container">

    <div class="client__container__bar">
      <nav>
        <ul class="links">
          {#each views as wiew}
            <li class="link" class:link--active={view === wiew} on:click={() => view = wiew}>{wiew}</li>
          {/each}
        </ul>
      </nav>
      <div class="header__currencies">
        <div class="header__currency">
          <img src="assets/currencies/somt.png" alt="SOMT"/>
          <Text>123123456.4657</Text>
        </div>
        <div class="header__currency">
          <img src="assets/currencies/soma.png" alt="SOMA"/>
          <Text>1324</Text>
        </div>
      </div>
    </div>

    <div class="client__container__view">
      {#if view === "Play"}
        <Play/>
      {:else if view === "Decks"}
        <Decks/>
      {:else if view === "Collection"}
        <Collection/>
      {:else if view === "Market"}
        <Market/>
      {:else if view === "Leaderboards"}
        <Leaderboards/>
      {:else if view === "Governance"}
        <Governance/>
      {/if}
    </div>

  </div>
</div>
