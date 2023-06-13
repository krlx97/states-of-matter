<script lang="ts">
  import {socketService} from "services";

  const errors = {
    name: {
      length: true,
      valid: true
    },
    password: {
      length: true
    }
  };

  let name = "";
  let password = "";
  let disabled = true;

  const validateInput = (): void => {
    errors.name.length = name.length >= 3;
    errors.password.length = password.length >= 6;
    disabled = !errors.name.length || !errors.password.length;
  };

  const onSignin = (): void => {
    socketService.socket.emit("signin", {name, password});
  };
</script>

<style>
  .signin {
    padding: var(--spacing-md);
    box-sizing: border-box;
  }
</style>

<div class="signin">

  <form on:submit|preventDefault={onSignin}>
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
    <div class="form__submit">
      <button {disabled}>SIGNIN</button>
    </div>
  </form>

</div>
