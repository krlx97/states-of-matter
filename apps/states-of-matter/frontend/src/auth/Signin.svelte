<script lang="ts">
  import {createEventDispatcher, onMount} from "svelte";
  import {socketService} from "services";
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
    }
  };

  let disabled = true;

  const validateInput = (): void => {
    const {name, password} = $authStore.signinForm;

    errors.name.length = name.length >= 3;
    errors.name.valid = isNameValid(name);
    errors.password.length = password.length >= 6;
    errors.password.valid = isPasswordValid(password);

    disabled = !errors.name.length || !errors.name.valid || !errors.password.length || !errors.password.valid;
  };

  const onSignin = (): void => {
    const {name} = $authStore.signinForm;
    socketService.socket.emit("getPrivateKeyHash", {name});
  };

  const onGotoSignup = (): void => {
    dispatch("gotoSignup");
  };

  onMount((): void => {
    validateInput();
  });
</script>

<style>
  .signin {
    width: 320px;
  }

  h1 {
    text-align: center;
  }

  .intro {
    text-align: justify;
    text-justify: inter-word;
    line-height: 1.4;
    margin-bottom: 2em;
  }

  .signup {
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

  .submit-batn {
    padding-top: var(--spacing-md);
    width: 100%;
    display: flex;
    justify-content: center;
  }
</style>

<div class="signin">
  <h1>Sign in</h1>
  <p class="intro">
    States of Matter is currently in
    <a href="https://github.com/krlx97/states-of-matter" target="_blank">Closed Alpha v0.3.0</a>.
    Things can and will break! If you have complaints or suggestions, come chat with us on our
    <a href="https://discord.com/invite/4xazmkjrkn" target="_blank">discord</a>.
  </p>

  <form on:submit|preventDefault={onSignin}>

    <label>
      <div>Username</div>
      <input
        placeholder="Username"
        maxlength="12"
        required
        bind:value={$authStore.signinForm.name}
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
        bind:value={$authStore.signinForm.password}
        on:input={validateInput}
        on:change={validateInput}
      />
      {#if !errors.password.length}
        <div class="label__error">Minimum 6 characters.</div>
      {:else if !errors.password.valid}
        <div class="label__error">Must contain one A-Z letter, one a-z letter & one number 0-9.</div>
      {/if}
    </label>

    <div class="submit-batn">
      <button>SIGN IN</button>
    </div>

  </form>


  <div class="signup">
    <div>Don't have an account?</div>
    <div class="linky" on:click={onGotoSignup}>
      SIGN UP
    </div>
  </div>

</div>
