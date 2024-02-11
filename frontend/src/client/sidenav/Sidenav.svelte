<script lang="ts">
  import BlockedComponent from "./Blocked.svelte";
  import ChatComponent from "./Chat.svelte";
  import FriendsComponent from "./Friends.svelte";
  import PlayerComponent from "./Player.svelte";
  import RequestsComponent from "./Requests.svelte";
</script>

<style>
  .sidenav {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    backdrop-filter: blur(4px);
    background-color: rgba(31, 31, 31, 0.8);
    border: 0 solid;
    border-left-width: 1px;
    border-image: linear-gradient(
      180deg,
      rgb(var(--dark-grey), 1) 0%,
      rgb(var(--grey), 1) 50%,
      rgb(var(--dark-grey), 1) 100%
    ) 1;
  }

  .sidenav__social {
    flex-grow: 1;
    overflow-y: scroll;
  }

  .sidenav__social::-webkit-scrollbar {
    width: 4px;
  }

  .sidenav__social::-webkit-scrollbar-track {
    background-color: rgb(63, 63, 63);
    border-radius: 8px;
  }

  .sidenav__social::-webkit-scrollbar-thumb {
    background-color: rgb(127, 127, 127);
    border-radius: 8px;
  }
</style>

<div class="sidenav">
  <PlayerComponent/>

  <div class="sidenav__social">
    <FriendsComponent/>
    <RequestsComponent/>
    <BlockedComponent/>
  </div>

  <ChatComponent/>
</div>
