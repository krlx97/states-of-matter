<script lang="ts">
  import {socketService} from "services";

  const errors = {
    name: {
      length: true,
      valid: true
    },
    password: {
      length: true
    },
    repeatPassword: {
      match: true
    }
  };

  let name = "";
  let password = "";
  let repeatPassword = "";
  let disabled = true;

  const validateInput = (): void => {
    errors.name.length = name.length >= 3;
    errors.password.length = password.length >= 6;
    errors.repeatPassword.match = password === repeatPassword;
    disabled = !errors.name.length || !errors.password.length || !errors.repeatPassword.match;
  };

  const onSignup = (): void => {
    socketService.socket.emit("signup", {name, password});
  };
</script>

<style>
  .signup {
    padding: var(--spacing-md);
    box-sizing: border-box;
  }
</style>

<div class="signup">

  <form on:submit|preventDefault={onSignup}>
    <label>
      <div class="label__title">Name</div>
      <input
        placeholder="Name"
        maxlength="16"
        bind:value={name}
        on:input={validateInput}
      />
      {#if !errors.name.length}
        <div class="label__error">Minimum 3 characters.</div>
      {/if}
    </label>
    <label>
      <div class="label__title">Password</div>
      <input
        placeholder="Password"
        type="password"
        bind:value={password}
        on:input={validateInput}
      />
      {#if !errors.password.length}
        <div class="label__error">Minimum 6 characters.</div>
      {/if}
    </label>
    <label>
      <div class="label__title">Repeat password</div>
      <input
        placeholder="Repeat password"
        type="password"
        bind:value={repeatPassword}
        on:input={validateInput}
      />
      {#if !errors.repeatPassword.match}
        <div class="label__error">Passwords don't match.</div>
      {/if}
    </label>
    <div class="form__submit">
      <button {disabled}>SIGNUP</button>
    </div>
  </form>

</div>
