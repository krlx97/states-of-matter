<script lang="ts">
  import Collection from "./collection/Collection.svelte";
  import Decks from "./decks/Decks.svelte";
  import Header from "./Header.svelte";
  import Play from "./play/Play.svelte";
  import Leaderboards from "./Leaderboards.svelte";
  import PatchNotes from "./PatchNotes.svelte";
  import Marketplace from "./Marketplace.svelte";
  import Wallet from "./Wallet.svelte";

  let view = "Collection";
</script>

<style>
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
  }
  .client__container__view {
    height: calc(100% - 128px);
  }
</style>

<div class="client">

  <div class="client__container">

    <div class="client__container__bar">
      <Header
        on:gotoPlay={() => view = "Play"}
        on:gotoDecks={() => view = "Decks"}
        on:gotoCollection={() => view = "Collection"}
        on:gotoMarketplace={() => view = "Marketplace"}
        on:gotoLeaderboards={() => view = "Leaderboards"}
        on:gotoPatchNotes={() => view = "PatchNotes"}
        on:gotoWallet={() => view = "Wallet"}
        on:gotoDevUI={() => view = "DevUI"}
      />
    </div>

    <div class="client__container__view">
      {#if view === "Play"}
        <Play/>
      {:else if view === "Decks"}
        <Decks/>
      {:else if view === "Collection"}
        <Collection/>
      {:else if view === "Marketplace"}
        <Marketplace/>
      {:else if view === "Leaderboards"}
        <Leaderboards/>
      {:else if view === "PatchNotes"}
        <PatchNotes/>
      {:else if view === "Wallet"}
        <Wallet/>
      {/if}
    </div>

  </div>
</div>