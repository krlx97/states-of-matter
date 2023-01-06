<script lang="ts">
  import {socketService} from "services";
  import {isNameValid} from "validators";
  import Modal from "../ui/Modal.svelte";

  let username = "";
  let disabled = true;

  const errors = {
    name: {
      length: true,
      valid: true
    }
  };

  const validateInput = (): void => {
    errors.name.length = username.length >= 3;
    errors.name.valid = isNameValid(username);

    disabled = !errors.name.length || !errors.name.valid;
  };

  const onAddFriend = (): void => {
    socketService.socket.emit("addFriend", {username});
  };
</script>

<style>
  form {
    width: 320px;
  }
</style>

<Modal>
  <form on:submit|preventDefault={onAddFriend}>
    <label>
      <div class="label__title">Username</div>
      <input
        placeholder="Username"
        maxlength="12"
        required
        bind:value={username}
        on:input={validateInput}
      />
      {#if !errors.name.length}
        <div class="label__error">Minimum 3 characters.</div>
      {:else if !errors.name.valid}
        <div class="label__error">Only a-z letters, 1-5 numbers and . (dot) allowed.</div>
      {/if}
    </label>
    <div class="form__submit">
      <button {disabled}>SEND</button>
    </div>
  </form>
</Modal>
