<script lang="ts">
  import {onMount} from "svelte";
  import {responses} from "responses";
  import {accountStore, playerStore, modalStore} from "stores";
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
    position: relative;
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(var(--dark-grey));
    overflow: hidden;
  }

  .app--inner {
    position: relative;
    height: 900px;
    width: 1600px;
    display: flex;
    background-color: rgb(var(--dark-grey));
    border: 1px solid rgb(102, 102, 102);
    box-sizing: border-box;
    border-radius: 6px;
    transform: scale(1); /* 1 for 1080p, 1.33 for 2k, 2 for 4k */
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
    <NotificationsComponent/>
    {#if $modalStore.isVisible}
      <svelte:component this={$modalStore.component}/>
    {/if}
  </div>
</div>
