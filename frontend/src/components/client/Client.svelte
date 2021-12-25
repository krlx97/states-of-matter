<script lang="ts">
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
    border-bottom: 2px solid rgb(var(--light-grey));
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
    border-bottom: 2px solid rgb(var(--purple));
  }
  li {
    // border: 1px solid red;
    padding: 1em;
  }
  li:hover {
    background-color: rgb(var(--purple));
    cursor: pointer;
  }

  .header__currencies {
    display: flex;
    flex-direction: column;
    justify-content: center;

    // border: 2px solid red;
    margin-right: 2em;
    padding: 1em;
  }
  .header__currency {
    display: flex;
    align-items: center;
    font-size: 2rem;

    .icon {
      height: 48px;
      width: 48px;
      // margin-right: 0.7em;
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
          <img class="icon" src="assets/currencies/shard.png" alt="SOM"/>
          123123.465
        </div>
        <div class="header__currency">
          <img class="icon" src="assets/currencies/som.png" alt="AURA"/>
          1324
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
