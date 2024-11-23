<script lang="ts">
  import {onMount} from "svelte";
  import {responses} from "responses";
  import {ethersService, socketService} from "services";
  import {ethersStore, playerStore} from "stores";
  import AuthComponent from "./auth/Auth.svelte";
  import ClientComponent from "./client/Client.svelte";
  import GameComponent from "./game/Game.svelte";
  import ModalsComponent from "./global/Modals.svelte";
  import NotificationsComponent from "./global/Notifications.svelte";
  import { cards } from "@som/shared/data";
    import { CardType } from "@som/shared/enums";

  const theMap = new Map([
    [0, "Neutral"],
    [1, "Solid"],
    [2, "Liquid"],
    [3, "Gas"],
    [4, "Plasma"]
  ]);
  const theMap2 = new Map([
    [0, "Hero"],
    [1, "Minion"],
    [2, "Magic"],
    [3, "Trap"],
  ]);

  onMount(async (): Promise<void> => {
    console.log(cards.reduce((acc, card) => {
      if (card.type !== CardType.HERO && card.klass === 1) {
        acc[card.name] = JSON.stringify(card.lore);
          // effect: [
          //   card.effect.name,
          //   card.effect.description.reduce((acc, e) => {
          //     if (typeof e === "string")
          //       return acc += e;
          //     else
          //       return acc += e[1]
          //   }, "")
          // ]
      }
      return acc;
    }, {}));

    const {ethereum} = window;
    const token = localStorage.getItem("jsonwebtoken");

    responses.forEach((response): void => {
      response();
    });

    if (token) {
      socketService.socket.emit("authenticate", {token});
    }

    if (ethereum) {
      const {address} = $playerStore;

      ethereum.on("accountsChanged", async (accounts): Promise<void> => {
        $ethersStore.accounts = accounts;
        ethersService.init(address);
        await ethersService.reloadUser();
      });

      ethereum.on("chainChanged", async (chainId): Promise<void> => {
        $ethersStore.chainId = BigInt(chainId);
        ethersService.init(address);
        await ethersService.reloadUser();
      });

      const [accounts, chainId] = await Promise.all([
        ethereum.request({
          method: "eth_accounts"
        }),
        ethereum.request({
          method: "eth_chainId"
        })
      ]);

      $ethersStore.accounts = accounts;
      $ethersStore.chainId = BigInt(chainId);
    }
  });
</script>

<style>
  /* @media only screen and (min-width: 640px) {}

  @media only screen and (min-width: 1280px) {
    .app {
      height: 900px;
      width: 1600px;
    }

    .app-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  } */

  .app-wrapper {
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(23, 23, 23);
  }

  .app {
    height: 900px;
    width: 1600px;
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(var(--grey), var(--opacity-sm));
    border-radius: 8px;
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
