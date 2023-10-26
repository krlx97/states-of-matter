<script lang="ts">
  import PlayerComponent from "./Player.svelte";
  import SocialComponent from "./social/Social.svelte";
  import ChatComponent from "./social/Chat/Chat.svelte";
</script>

<style>
  .sidenav {
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    /* background-color: rgb(31, 31, 31); */
    border: 0 solid;
    border-left-width: 1px;
    border-image: linear-gradient(
      180deg,
      rgba(63, 63, 63, 1) 0%,
      rgba(255, 255, 255, 1) 50%,
      rgba(63, 63, 63, 1) 100%
    ) 1;
    box-sizing: border-box;
  }
</style>

<div class="sidenav">
  <PlayerComponent/>
  <SocialComponent/>
  <ChatComponent/>
</div>
