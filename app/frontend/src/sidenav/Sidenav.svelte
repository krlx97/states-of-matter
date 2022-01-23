<script lang="ts">
  import {onDestroy, onMount} from "svelte";
  import {socketService} from "services";
  import * as responses from "sidenav/responses";

  import Footer from "./Footer.svelte";
  import Player from "./Player.svelte";
  import Social from "./social/Social.svelte";

  onMount((): void => { socketService.listen(responses); });
  onDestroy((): void => { socketService.forget(responses); });
</script>

<style>
  .friends {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    border-left: 2px solid rgb(var(--light-grey));
    box-sizing: border-box;
  }
</style>

<div class="friends">
  <Player/>
  <Social/>
  <Footer/>
</div>
