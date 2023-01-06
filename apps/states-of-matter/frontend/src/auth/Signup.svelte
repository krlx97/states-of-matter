<script lang="ts">
  import {createEventDispatcher, onMount} from "svelte";
  import {cryptoService, eccService, socketService} from "services";
  import {authStore} from "stores";
  import {isNameValid, isPasswordValid} from "validators";

  const dispatch = createEventDispatcher();

  const errors = {
    name: {
      length: true,
      valid: true
    },
    password: {
      length: true,
      valid: true
    },
    repeatPassword: {
      valid: true
    }
  };

  let disabled = true;

  const validateInput = (): void => {
    const {name, password, repeatPassword} = $authStore.signupForm;

    errors.name.length = name.length >= 3;
    errors.name.valid = isNameValid(name);
    errors.password.length = password.length >= 6;
    errors.password.valid = isPasswordValid(password);
    errors.repeatPassword.valid = password === repeatPassword;

    disabled = !errors.name.length || !errors.name.valid || !errors.password.length || !errors.password.valid || !errors.repeatPassword.valid;
  };

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

  onMount((): void => {
    validateInput();
  });
</script>

<style>
  .signup {
    width: 320px;
  }

  h1 {
    text-align: center;
  }

  .more {
    padding: 1em;
    margin-top: 2em;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-top-width: 1px;
    border-right-width: 0;
    border-bottom-width: 0;
    border-left-width: 0;
    border-style: solid;
    border-image: linear-gradient(90deg, rgba(63,63,63,1) 0%, rgba(255,255,255,1) 50%, rgba(63,63,63,1) 100%) 1;
  }

  .linky {
    text-decoration: underline;
    font-size: 1.4rem;
    cursor: pointer;
    margin-top: var(--spacing-md);
    letter-spacing: 0.2rem;
  }

  .intro {
    text-align: justify;
    text-justify: inter-word;
    line-height: 1.4;
    margin-bottom: 2em;
  }

  .submit-batn {
    padding-top: var(--spacing-md);
    width: 100%;
    display: flex;
    justify-content: center;
  }
</style>

<div class="signup">
  <h1>Sign up</h1>

  <p class="intro">
    Create your free Eternitas account / wallet, no downloads required. You can
    then use one Eternitas account to play all the games that we release.
  </p>

  <form on:submit|preventDefault={onSignup}>

    <label>
      <div class="label__title">Username</div>
      <input
        placeholder="Username"
        maxlength="12"
        required
        bind:value={$authStore.signupForm.name}
        on:input={validateInput}
        on:change={validateInput}
      />
      {#if !errors.name.length}
        <div class="label__error">Minimum 3 characters.</div>
      {:else if !errors.name.valid}
        <div class="label__error">Only a-z letters, 1-5 numbers and . (dot) allowed.</div>
      {/if}
    </label>

    <label>
      <div class="label__title">Password</div>
      <input
        placeholder="Password"
        type="password"
        maxlength="32"
        required
        bind:value={$authStore.signupForm.password}
        on:input={validateInput}
        on:change={validateInput}
      />
      {#if !errors.password.length}
        <div class="label__error">Minimum 6 characters.</div>
      {:else if !errors.password.valid}
        <div class="label__error">Must contain one A-Z letter, one a-z letter & one number 0-9.</div>
      {/if}
    </label>

    <label>
      <div class="label__title">Repeat password</div>
      <input
        placeholder="Repeat password"
        type="password"
        maxlength="32"
        required
        bind:value={$authStore.signupForm.repeatPassword}
        on:input={validateInput}
        on:change={validateInput}
      />
      {#if !errors.repeatPassword.valid}
        <div class="label__error">Passwords don't match.</div>
      {/if}
    </label>

    <div class="submit-batn">
      <button {disabled}>SIGN UP</button>
    </div>

  </form>

  <div class="more">
    Already have an account?<br/>
    <div class="linky" on:click={onGotoSignin}>SIGN IN</div>
  </div>

</div>
