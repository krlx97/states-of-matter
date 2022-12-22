<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {cryptoService, eccService, socketService} from "services";
  import {authStore} from "stores";

  const dispatch = createEventDispatcher();

  const onSignup = async (): Promise<void> => {
    const {name, password} = $authStore.signupForm;
    const privateKey = await eccService.randomKey();
    const publicKey = eccService.toPublic(privateKey);
    const privateKeyHash = cryptoService.encrypt(privateKey, password);

    socketService.socket.emit("signup", {name, publicKey, privateKeyHash});
  };

  const onGotoSignin = (): void => {
    dispatch("gotoSignin");
  };
</script>

<div>
  <h1>Sign up</h1>
  <form on:submit|preventDefault={onSignup}>
    <label>
      <div>Username</div>
      <input
        placeholder="Username"
        type="text"
        maxlength={12}
        bind:value={$authStore.signupForm.name}/>
    </label>
    <div>a-z 1-5 . (12 chars)</div>
    <label>
      <div>Password</div>
      <input
        placeholder="Password"
        type="password"
        maxlength={32}
        bind:value={$authStore.signupForm.password}/>
    </label>
    <button class="btn--raised-purple">SIGN UP</button>
  </form>
  <div>
    Already have an account?<br/>
    <button class="btn--outlined-purple" on:click={onGotoSignin}>
      SIGN IN
    </button>
  </div>
</div>
