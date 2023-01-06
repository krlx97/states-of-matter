<script lang="ts">
  import {socketService} from "services";
  import {modalStore} from "stores";
    import { onMount } from "svelte";
  import Modal from "../ui/Modal.svelte";

  let name = "";

  const errors = {
    name: {
      length: true
    }
  };

  let disabled = true;

  const validateInput = (): void => {
    errors.name.length = name.length >= 1;

    disabled = !errors.name.length;
  };

  const onSetDeckName = (): void => {
    const {id} = $modalStore.data;
    socketService.socket.emit("setDeckName", {id, name});
  };

  onMount((): void => {
    validateInput();
  });
</script>

<style>
  form {
    width: 320px;
  }
</style>

<Modal>
  <form on:submit|preventDefault={onSetDeckName}>
    <label>
      <div class="label__title">Deck name</div>
      <input
        placeholder="Deck name"
        maxlength="16"
        required
        bind:value={name}
        on:input={validateInput}
        on:change={validateInput}
      />
      {#if !errors.name.length}
        <div class="label__error">Minimum 1 character.</div>
      {/if}
    </label>
    <div class="form__submit">
      <button {disabled}>CHANGE</button>
    </div>
  </form>
</Modal>
