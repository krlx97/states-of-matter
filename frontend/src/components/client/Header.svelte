<script lang="ts">
  import {createEventDispatcher, onMount} from "svelte";

  const dispatch = createEventDispatcher();

  let linksRef, playLinkRef, decksLinkRef, collectionLinkRef, marketplaceLinkRef, leaderboardsLinkRef, walletLinkRef, patchNotesLinkRef, devUIRef;

  const setLinkActive = (ref) => {
    linksRef.forEach((linkRef) => {
      linkRef.classList.remove("link--active");
    });

    ref.classList.add("link--active");
  };

  const gotoPlay = () => {
    setLinkActive(playLinkRef);
    dispatch("gotoPlay");
  };
  const gotoDecks = () => {
    setLinkActive(decksLinkRef);
    dispatch("gotoDecks");
  }
  const gotoCollection = () => {
    setLinkActive(collectionLinkRef);
    dispatch("gotoCollection");
  };
  const gotoMarketplace = () => {
    setLinkActive(marketplaceLinkRef);
    dispatch("gotoMarketplace");
  };
  const gotoLeaderboards = () => {
    setLinkActive(leaderboardsLinkRef);
    dispatch("gotoLeaderboards");
  };
  const gotoWallet = () => {
    setLinkActive(walletLinkRef);
    dispatch("gotoWallet");
  };
  const gotoPatchNotes = () => {
    setLinkActive(patchNotesLinkRef);
    dispatch("gotoPatchNotes");
  };
  const gotoDevUI = () => {
    setLinkActive(devUIRef);
    dispatch("gotoDevUI");
  };

  onMount(() => {
    linksRef = document.querySelectorAll(".link");

    playLinkRef = document.getElementById("playLink");
    decksLinkRef = document.getElementById("decksLink");
    collectionLinkRef = document.getElementById("collectionLink");
    marketplaceLinkRef = document.getElementById("marketplaceLink");
    leaderboardsLinkRef = document.getElementById("leaderboardsLink");
    walletLinkRef = document.getElementById("walletLink");
    patchNotesLinkRef = document.getElementById("patchNotesLink");
    devUIRef = document.getElementById("devUILink");
  });
</script>

<style>
  .header {
    height: 128px;
    display: flex;
    justify-content: space-between;
    border-bottom: 2px solid rgb(var(--light-grey));
    box-sizing: border-box;
  }
  .links {
    margin: 0;
    padding-left: var(--spacing-md);
    height: 100%;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    list-style-type: none;
  }
  .link {
    margin-right: var(--spacing-md);
    padding: var(--spacing-md);
    border-bottom: 2px solid transparent;
    box-sizing: border-box;
    cursor: pointer;
    transition: background-color 225ms ease-in-out;
  }
  .link--active {
    border-bottom: 2px solid rgb(var(--purple));
  }
  .link:hover {
    background-color: rgb(var(--purple));
  }

  .header__currencies {
    width: 256px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .header__currency {
    /* margin-bottom: var(--spacing-sm); */
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 1.5rem;
  }
  .header__currency:last-child { margin-bottom: 0; }
  .icon {
    height: 48px;
    width: 48px;
    margin-right: var(--spacing-sm);
  }
</style>

<header class="header">
  <nav>
    <ul class="links">
      <li class="link" id="playLink" on:click={gotoPlay}>PLAY</li>
      <li class="link link--active" id="decksLink" on:click={gotoDecks}>DECKS</li>
      <li class="link link--active" id="collectionLink" on:click={gotoCollection}>COLLECTION</li>
      <li class="link" id="marketplaceLink" on:click={gotoMarketplace}>MARKET</li>
      <li class="link" id="leaderboardsLink" on:click={gotoLeaderboards}>LEADERBOARDS</li>
      <li class="link" id="walletLink" on:click={gotoWallet}>WALLET</li>
      <li class="link" id="patchNotesLink" on:click={gotoPatchNotes}>ROADMAP</li>
    </ul>
  </nav>

  <div class="header__currencies">
    <!-- <div class="header__currency">
      <img class="icon" src="assets/currencies/telos.png" alt="TLOS">
      1234.4321
    </div> -->
    <div class="header__currency">
      <img class="icon" src="assets/currencies/shard.png" alt="SOM">
      123123.465
    </div>
    <div class="header__currency">
      <img class="icon" src="assets/currencies/som.png" alt="SOM">
      1324
    </div>
  </div>

</header>