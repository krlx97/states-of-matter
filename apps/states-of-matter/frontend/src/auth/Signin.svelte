<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {socketService} from "services";
  import {authStore} from "stores";

  const dispatch = createEventDispatcher();

  const onSignin = (): void => {
    const {name} = $authStore.signinForm;
    socketService.socket.emit("getPrivateKeyHash", {name});
  };

  const onGotoSignup = (): void => {
    dispatch("gotoSignup");
  };
</script>

<style>
  .signin {
    width: 360px;
  }
</style>

<div class="signin">
  <h1>Sign in</h1>
  <p>
    States of Matter is currently in
    <a href="https://github.com/krlx97/states-of-matter" target="_blank">Closed Alpha v0.3.0</a>.
    Things can and will break! If you have complaints or suggestions, come chat with us on our
    <a href="https://discord.com/invite/4xazmkjrkn" target="_blank">discord</a>.
  </p>
  <p>
    Card effects are currently disabled as we are in the process of implementing buffs/debuffs for cards in game.
  </p>
  <form on:submit|preventDefault={onSignin}>
    <label>
      <div>Username</div>
      <input type="text" maxlength={12} bind:value={$authStore.signinForm.name}/>
    </label>
    <label>
      <div>Password</div>
      <input type="password" maxlength={32} bind:value={$authStore.signinForm.password}/>
    </label>
    <button>SIGN IN</button>
  </form>
  <br/>
  <div>
    Dont have an account?<br/>
    <button on:click={onGotoSignup}>
      SIGN UP
    </button>
  </div>
</div>
