<script lang="ts">
  import {socketService} from "services";
  import {ModalComponent} from "ui";

  const errors = {
    name: {
      length: true,
      valid: true
    }
  };
  let name = "";
  let disabled = true;

  const validateInput = (): void => {
    errors.name.length = name.length >= 3;
    disabled = !errors.name.length;
  };

  const onSignup = (): void => {
    socketService.socket.emit("signup", {name, publicKey: ""});
  };
</script>

<style>
  form {
    width: 320px;
  }
</style>

<ModalComponent>
    <p>
        It looks like you do not have an account yet. Choose your name to proceed
    </p>
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
    <div class="form__submit">
      <button {disabled}>SEND</button>
    </div>
  </form>
</ModalComponent>
