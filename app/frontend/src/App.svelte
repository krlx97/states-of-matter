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
import { PlayerStatus } from "@som/shared/enums";

  $: status = $playerStore.status;

  onMount(() => {
    responses.forEach((response) => response());
  });
</script>

<svelte:head>
  <style>
    @font-face {
      font-family: 'RomanCapitals';
      src: url(assets/font.woff);
    }

    body {
      margin: 0;
      /* font-family: "RomanCapitals", sans-serif; */
      font-family: 'Cardo', serif;      font-size: 16px;
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

    &__content {width: 100%; display: flex;}
    &__sidenav {width: 320px}
  }
</style>

<div class="app">
  <div class="app--inner">
    {#if status === PlayerStatus.OFFLINE}
      <Auth/>
    {:else if status === PlayerStatus.ONLINE || status === PlayerStatus.IN_CASUAL_QUEUE || status === PlayerStatus.IN_RANKED_QUEUE || status === PlayerStatus.INLOBBY}
      <div class="app__content">
        <Client/>
        <div class="app__sidenav">
          <Sidenav/>
        </div>
      </div>
    {:else if status === PlayerStatus.INGAME}
      <Game/>
    {/if}
    <ChatWindow/>
    <Notifications/>
    <Modals/>
  </div>
</div>
