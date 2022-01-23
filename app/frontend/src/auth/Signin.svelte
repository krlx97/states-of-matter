<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {socketService} from "services";
  import {authStore} from "auth/stores";

  import Button from "../ui/Button.svelte";
  import Text from "../ui/Text.svelte";

  const dispatch = createEventDispatcher();

  const onSignin = (): void => {
    const {username} = $authStore.signinForm;
    socketService.getPrivateKeyHash({username});
  };

  const onGotoSignup = (): void => { dispatch("gotoSignup"); };
</script>

<style lang="scss">
  @import "../shared/styles/variables";

  form {
    width: 320px;
    margin-bottom: $spacing-md;
  }
  span {cursor: pointer}

  .form__btn {
    display: flex;
    justify-content: center;
  }
</style>

<form>
  <Text size="xlg">Sign in</Text>

  <div class="form__field">
    <label for="signinUsername">Username</label>
    <input
      id="signinUsername"
      placeholder="Username"
      name="username"
      type="text"
      maxlength="16"
      bind:value={$authStore.signinForm.username}
    />
  </div>

  <div class="form__field">
    <label for="signinPassword">Password</label>
    <input
      id="signinPassword"
      placeholder="Password"
      name="password"
      type="password"
      bind:value={$authStore.signinForm.password}
    />
  </div>

  <div class="form__btn">
    <Button on:click={onSignin}>
      SIGN IN
    </Button>
  </div>

</form>

<p>
  Dont have an account?
  <span class="f--purple" on:click={onGotoSignup}>Sign up</span>
</p>