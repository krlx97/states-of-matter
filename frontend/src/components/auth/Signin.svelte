<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {socketService} from "services";
  import {authStore} from "stores/data";

  const dispatch = createEventDispatcher();

  const onSignin = (): void => {
    const {username} = $authStore.signinForm;
    socketService.emit("getPrivateKeyHash", {username});
  };

  const onGotoSignup = (): void => { dispatch("gotoSignup"); };
</script>

<style lang="scss">
  form {
    width: 320px;
  }
  span {
    cursor: pointer;
  }
</style>

<form>
  <h3>Sign in</h3>

  <div class="form__field">
    <label for="signinUsername">Username</label>
    <input
      id="signinUsername"
      placeholder="Username"
      name="username"
      type="text"
      maxlength="16"
      bind:value={$authStore.signinForm.username}>
  </div>

  <div class="form__field">
    <label for="signinPassword">Password</label>
    <input
      id="signinPassword"
      placeholder="Password"
      name="password"
      type="password"
      bind:value={$authStore.signinForm.password}>
  </div>

  <div class="form__field">
    <button
      class="btn--raised-primary form__field__submit"
      on:click|preventDefault={onSignin}>
      SIGN IN
    </button>
  </div>

</form>

<p>
  Dont have an account?
  <span class="f--purple" on:click={onGotoSignup}>Sign up</span>
</p>