<script lang="ts">
  import {onMount} from "svelte";
  import {responses} from "responses";
  import {accountStore, playerStore} from "stores";
  import ModalsComponent from "./Modals.svelte";
  import NotificationsComponent from "./Notifications.svelte";
  import AuthComponent from "./auth/Auth.svelte";
  import ClientComponent from "./client/Client.svelte";
  import GameComponent from "./game/Game.svelte";

  onMount((): void => {
    responses.forEach((response): void => {
      response();
    });
  });
</script>

<style>
  .app {
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
    background-color: rgb(var(--dark-grey));
    /* border: 2px solid rgb(127, 127, 127); */
    border-radius: 8px;
    overflow: hidden;
    /* 1 for 1080p, 1.33 for 2k, 2 for 4k */
    /* transform: scale(1); */
  }
</style>

<div class="app">
  <div class="app--inner">
    {#if !$accountStore.name}
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
