<script lang="ts">
  import Signin from "./Signin.svelte";
  import Signup from "./Signup.svelte";

  let view: "Signin" | "Signup" = "Signin";
</script>

<style>
  .auth {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>

<div class="auth">
  {#if view === "Signin"}
    <Signin on:gotoSignup={() => view = "Signup"}/>
  {:else if view === "Signup"}
    <Signup on:gotoSignin={() => view = "Signin"}/>
  {/if}
</div>
