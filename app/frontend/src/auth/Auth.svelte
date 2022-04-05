<script lang="ts">
  import Signin from "./Signin.svelte";
  import Signup from "./Signup.svelte";

  let view = "Signin";
</script>

<style lang="scss">
  @import "../shared/styles/mixins";

  .auth {
    height: 100%;
    width: 100%;
    @include flex(column, center, center);
  }
</style>

<div class="auth">
  {#if view === "Signin"}
    <Signin on:gotoSignup={() => view = "Signup"}/>
  {:else if view === "Signup"}
    <Signup on:gotoSignin={() => view = "Signin"}/>
  {/if}
</div>
