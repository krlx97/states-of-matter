<script lang="ts">
  import {PlayerStatus} from "@som/shared/enums";
  import {onMount} from "svelte";
  import {playerStore} from "stores";
  import {responses} from "responses";
  import ChatWindow from "./ChatWindow.svelte";
  import Notifications from "./Notifications.svelte";
  import Auth from "./auth/Auth.svelte";
  import Client from "./client/Client.svelte";
  import Game from "./game/Game.svelte";
  import Modals from "./modals/Modals.svelte";

  onMount((): void => {
    responses.forEach((response): void => {
      response();
    });
  });
</script>

<style>
  .app {
    position: relative;
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(var(--dark-grey));
  }

  .app--inner {
    position: relative;
    height: 900px;
    width: 1600px;
    display: flex;
    box-shadow: var(--elevation-lg);
    background-color: rgb(var(--dark-grey));
  }
</style>

<div class="app">
  <div class="app--inner">
    {#if $playerStore.status === PlayerStatus.OFFLINE}
      <Auth/>
    {:else if $playerStore.status === PlayerStatus.INGAME}
      <Game/>
    {:else}
      <Client/>
    {/if}
    <ChatWindow/>
    <Notifications/>
    <Modals/>
  </div>
</div>
