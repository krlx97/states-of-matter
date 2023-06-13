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

  const onAddFriend = (): void => {
    socketService.socket.emit("addFriend", {name});
  };
</script>

<style>
  form {
    width: 320px;
  }
</style>

<ModalComponent>
  <form on:submit|preventDefault={onAddFriend}>
    <label>
      <div class="label__title">Name</div>
      <input
        placeholder="Name"
        maxlength="16"
        required
        bind:value={name}
        on:input={validateInput}
      />
      {#if !errors.name.length}
        <div class="label__error">Minimum 3 characters.</div>
      {/if}
    </label>
    <div class="form__submit">
      <button class="button" {disabled}>ADD</button>
    </div>
  </form>
</ModalComponent>
