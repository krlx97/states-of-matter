<script lang="ts">
  import {onMount} from "svelte";
  import {responses} from "responses";
  import {ethersStore, playerStore} from "stores";
  import ModalsComponent from "./Modals.svelte";
  import NotificationsComponent from "./Notifications.svelte";
  import AuthComponent from "./auth/Auth.svelte";
  import ClientComponent from "./client/Client.svelte";
  import GameComponent from "./game/Game.svelte";
  import { ethersService } from "services";
  import { get } from "svelte/store";
  import { socketService } from "services";

  onMount(async () => {
    const {ethereum} = window;

    await ethersService.init();

    responses.forEach((response): void => {
      response();
    });

    const token = localStorage.getItem("jsonwebtoken");

    if (token) {
      socketService.socket.emit("authenticate", {token});
    }

    if (!ethereum) {
      return;
    }

    ethereum.on("accountsChanged", async (accounts) => {
      if (accounts.length) {
        const signer = await get(ethersStore).provider.getSigner();

        ethersStore.update((store) => {
          store.signer = signer;
          store.isValid =
            window.ethereum !== undefined
            && store.signer?.address !== undefined
            && store.chainId === /*1337n*/41n;

          return store;
        });
      } else {
        ethersStore.update((store) => {
          store.signer = undefined;
          store.isValid =
            window.ethereum !== undefined
            && store.signer?.address !== undefined
            && store.chainId === /*1337n*/41n;

          return store;
        });
      }
    });

    ethereum.on("chainChanged", async (chainId) => {
      // const network = await get(ethersStore).provider.getNetwork();

      ethersStore.update((store) => {
        store.chainId = BigInt(chainId);
        store.isValid =
          window.ethereum !== undefined
          && store.signer?.address !== undefined
          && store.chainId === /*1337n*/41n;
        return store;
      });
    });
  });
</script>

<style>
  .app-wrapper {
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(var(--dark-grey));
  }

  .app {
    position: relative;
    height: 900px;
    width: 1600px;
    background-color: rgb(var(--dark-grey));
    overflow: hidden;
    /* 1 for 1080p, 1.33 for 2k, 2 for 4k */
    /* transform: scale(1); */
  }
</style>

<div class="app-wrapper">
  <div class="app">
    {#if !$playerStore.name}
      <AuthComponent/>
    {:else if $playerStore.gameId > 0}
      <GameComponent/>
    {:else}
      <ClientComponent/>
    {/if}
    <ModalsComponent/>
    <NotificationsComponent/>
  </div>
</div>
