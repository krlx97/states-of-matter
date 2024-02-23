<script lang="ts">
  import {onMount} from "svelte";
  import {responses} from "responses";
  import {ethersService, socketService} from "services";
  import {ethersStore, playerStore} from "stores";
  import ModalsComponent from "./Modals.svelte";
  import NotificationsComponent from "./Notifications.svelte";
  import AuthComponent from "./auth/Auth.svelte";
  import ClientComponent from "./client/Client.svelte";
  import GameComponent from "./game/Game.svelte";

  onMount(async (): Promise<void> => {
    const {ethereum} = window;

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
      $ethersStore.accounts = accounts;
    });

    ethereum.on("chainChanged", async (chainId): Promise<void> => {
      $ethersStore.chainId = BigInt(chainId);
    });

    const chainId = await ethereum.request({
      method: "eth_chainId"
    });

    $ethersStore.chainId = BigInt(chainId);
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
    overflow: hidden;
    border: 1px solid rgba(var(--grey), 0.3);
    border-radius: 8px;
    /* 1 for 1080p, 1.33 for 2k, 2 for 4k */
    /* transform: scale(1); */
  }
</style>

<div class="app-wrapper">
  <div class="app" id="app">
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
