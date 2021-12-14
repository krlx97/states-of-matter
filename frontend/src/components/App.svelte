<script lang="ts">
  import {onMount} from "svelte";
  import responses from "responses";
  import {socketService} from "services";
  import {playerStore} from "stores/data";

  import ChatWindow from "./ChatWindow.svelte";
  import Modals from "./modals/Modals.svelte";
  import Notifications from "./Notifications.svelte";
  import Auth from "./auth/Auth.svelte";
  import Client from "./client/Client.svelte";
  import Sidenav from "./sidenav/Sidenav.svelte";
  import Game from "./game/Game.svelte";

  $: status = $playerStore.status;

  onMount(() => {
    socketService.listenToResponses(responses);
  });
</script>

<style lang="scss">
  @import "../styles/variables";
  @import "../styles/mixins";
  
  .game__wrapper {
    height: 100vh;
    width: 100vw;
    @include d-flex(row, center, center);
    background-color: $light-grey;
    // background-image: url("/assets/wallpapers/game.jpg");
  }
  .game {
    position: relative;
    // aspect-ratio: 16/9;
    height: 100vh;
    width: 100vw;
    display: flex;
    background-color: rgb(var(--grey));
    color: white;
    box-shadow: $elevation-lg;
    // overflow: hidden;

    &__content { width: calc(100% - 320px); }
    &__sidenav { width: 320px; }
  }
</style>

<!-- <div class="game__wrapper"> -->
  <div class="game">
    {#if status === 0}
      <Auth/>
    {:else}
      <main class="game__content">
        {#if status === 1 || status === 2 || status === 3}
          <Client/>
        {:else if status === 4}
          <Game/>
        {/if}
      </main>
      <aside class="game__sidenav">
        <Sidenav/>
      </aside>
    {/if}
    <ChatWindow/>
    <Notifications/>
    <Modals/>
  </div>
<!-- </div> -->
