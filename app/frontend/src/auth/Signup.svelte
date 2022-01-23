<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {cryptoService, eccService, socketService} from "services";
  import {authStore} from "auth/stores";

  import Button from "../ui/Button.svelte";

  const dispatch = createEventDispatcher();

  const onSignup = async (): Promise<void> => {
    const {username, password} = $authStore.signupForm;
    const privateKey = await eccService.randomKey();
    const publicKey = eccService.toPublic(privateKey);
    const privateKeyHash = cryptoService.encrypt(privateKey, password);

    socketService.signup({username, publicKey, privateKeyHash});
  };

  const onGotoSignin = (): void => { dispatch("gotoSignin"); };
</script>

<style lang="scss">
  @import "../shared/styles/variables";

  form {
    width: 320px;
    margin-bottom: $spacing-md;
  }
  span {
    cursor: pointer;
  }
  .form__btn {
    display: flex;
    justify-content: center;
  }
</style>

<form>
  <h3>Sign up</h3>

  <div class="form__field">
    <label for="signupUsername">Username</label>
    <input
      id="signupUsername"
      placeholder="Username"
      name="username"
      type="text"
      maxlength="12"
      bind:value={$authStore.signupForm.username}>
    <p>
      <i>* Characters allowed: a-z 1-5 . (dot)</i><br>
      <i>* Maximum 12 characters</i><br>
    </p>
  </div>

  <div class="form__field">
    <label for="signupPassword">Password</label>
    <input
      id="signupPassword"
      placeholder="Password"
      name="password"
      type="password"
      bind:value={$authStore.signupForm.password}>
  </div>

  <div class="form__btn">
    <Button on:click={onSignup}>
      SIGN UP
    </Button>
  </div>

</form>

<p>
  Already have an account?
  <span class="f--purple" on:click={onGotoSignin}>Sign in</span>
</p>
