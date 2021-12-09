<script lang="ts">
  import Footer from "./Footer.svelte";
  import Player from "./Player.svelte";
  import Social from "./social/Social.svelte";
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

<aside class="friends">
  <Player/>
  <Social/>
  <Footer/>
</aside>