<script lang="ts">
  import Footer from "./Footer.svelte";
  import Player from "./Player.svelte";
  import Social from "./social/Social.svelte";
</script>

<style lang="scss">
  @import "../shared/styles/mixins";
  @import "../shared/styles/variables";

  .sidenav {
    height: 100%;
    width: 100%;
    @include flex(column);
    border-left: 2px solid $light-grey;
    box-sizing: border-box;
  }
</style>

<div class="sidenav">
  <Player/>
  <Social/>
  <Footer/>
</div>
