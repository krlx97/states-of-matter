<script lang="ts">
  import {fade, type FadeParams} from "svelte/transition";
  import Player from "./Player.svelte";
  import Profile from "./Profile.svelte";
  import Social from "./social/Social.svelte";
  import Wallet from "./wallet/Wallet.svelte";

  let active = 0;

  const theFade: FadeParams = {
    delay: 0,
    duration: 450
  };
</script>

<style>
  .sidenav {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    

    border-top-width: 0;
    border-right-width: 0;
    border-bottom-width: 0;
    border-left-width: 1px;
    border-style: solid;
    border-image: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(31,31,31,1) 5%, rgba(255,255,255,1) 50%, rgba(31,31,31,1) 95%, rgba(255,255,255,0) 100%) 1;
    background-color: rgb(32, 32, 32);
    
  }

  .sidenav__panel {
    /* position: absolute;
    top: calc(150px + 2em);
    left: 0; */
    flex-grow: 1;
  }

  .nav {
    display: flex;
    justify-content: space-between;
  }

  .nav button {
    margin-right: 0.5em;
  }
</style>

<div class="sidenav">
  <Player
    on:openProfile={() => active = 0}
    on:openChat={() => active = 1}
    on:openWallet={() => active = 2}
  />

  <!-- <div class="nav">
    <button class="button--icon" on:click={() => active = 0}>
      <img src="assets/icons/profile.png" alt="Profile"/>
    </button>
    <button class="button--icon" on:click={() => active = 1}>
      <img src="assets/icons/chat.png" alt="Chat"/>
    </button>
    <button class="button--icon" on:click={() => active = 2}>
      <img src="assets/icons/wallet.png" alt="Wallet"/>
    </button>
  </div> -->

  {#if active === 0}
    <div class="sidenav__panel" transition:fade={theFade}>
      <Profile/>
    </div>
  {:else if active === 1}
    <div class="sidenav__panel" transition:fade={theFade}>
      <Social/>
    </div>
  {:else}
    <div class="sidenav__panel" transition:fade={theFade}>
      <Wallet/>
    </div>
  {/if}
</div>
