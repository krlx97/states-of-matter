<script lang="ts">
  import {onMount} from "svelte";
  import {playerStore} from "stores";
  import {responses} from "responses";
  import ChatWindow from "./ChatWindow.svelte";
  import Modals from "./modals/Modals.svelte";
  import Notifications from "./Notifications.svelte";
  import Auth from "./auth/Auth.svelte";
  import Client from "./client/Client.svelte";
  import Sidenav from "./sidenav/Sidenav.svelte";
  import Game from "./game/Game.svelte";

  $: status = $playerStore.status;

  onMount(() => {
    responses.forEach((response) => response());
  });
</script>

<svelte:head>
  <style>
    @font-face {
      font-family: 'RomanCapitalz';
      src: url(assets/font.woff);
    }

    body {
      margin: 0;
      font-family: "RomanCapitalz", sans-serif;
      font-size: 20px;
      line-height: 1;
      user-select: none;
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

    &__content {width: 100%; display: flex;}
    &__sidenav {width: 320px}
  }
</style>

<div class="app">
  <div class="app--inner">
    {#if status === 0}
      <Auth/>
    {:else if status === 1 || status === 2 || status === 3}
      <div class="app__content">
        <Client/>
        <div class="app__sidenav">
          <Sidenav/>
        </div>
      </div>
    {:else if status === 4}
      <Game/>
    {/if}
    <ChatWindow/>
    <Notifications/>
    <Modals/>
  </div>
</div>
