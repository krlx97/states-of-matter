<script lang="ts">
  import {onDestroy, onMount} from "svelte";
  import {socketService} from "services";
  import {playerStore} from "stores/data";
  import * as responses from "responses";

  import ChatWindow from "./ChatWindow.svelte";
  import Modals from "./modals/Modals.svelte";
  import Notifications from "./Notifications.svelte";
  import Auth from "./auth/Auth.svelte";
  import Client from "./client/Client.svelte";
  import Sidenav from "./sidenav/Sidenav.svelte";
  import Game from "./game/Game.svelte";

  $: status = $playerStore.status;

  onMount((): void => { socketService.listen(responses); });
  onDestroy((): void => { socketService.forget(responses); });
</script>

<svelte:head>
  <style>
    body {
      margin: 0;
      font-family: "Exo 2", sans-serif;
      line-height: 1;
    }
  </style>
</svelte:head>

<style lang="scss">
  @import "./shared/styles/mixins";
  @import "./shared/styles/variables";

  .app {
    position: relative;
    height: 100vh;
    width: 100vw;
    @include flex(row, center, center);
    color: white;
    background-color: $dark-grey;
    // background-image: url("/assets/wp.jpg");

    &--inner {
      position: relative;
      height: 900px;
      width: 1600px;
      @include flex();
      box-shadow: $elevation-lg;
      background-color: $grey;
    }

    &__content {width: calc(100% - 320px)}
    &__sidenav {width: 320px}
  }
</style>

<div class="app">
  <div class="app--inner">
    {#if status === 0}
      <Auth/>
    {:else}
      <div class="app__content">
        {#if status === 1 || status === 2 || status === 3}
          <Client/>
        {:else if status === 4}
          <Game/>
        {/if}
      </div>
      <div class="app__sidenav">
        <Sidenav/>
      </div>
    {/if}
    <ChatWindow/>
    <Notifications/>
    <Modals/>
  </div>
</div>
