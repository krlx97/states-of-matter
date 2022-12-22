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
    Eternitas Virtual Wallet is not audited yet. We do, however, offer a bounty
    hunt of up to 100,000 VMT to anyone who finds & fixes bugs in the smart contract
    <a href="https://github.com/krlx97/states-of-matter" target="_blank">code</a>.
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
