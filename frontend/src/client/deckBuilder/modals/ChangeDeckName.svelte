<script lang="ts">
  import {modalService} from "services";
  import {deckStore} from "stores";
  import {ModalComponent} from "ui";

  const errors = {
    name: {
      length: true
    }
  };

  let name = "";
  let disabled = true;

  const validateInput = (): void => {
    errors.name.length = name.length >= 1;
    disabled = !errors.name.length;
  };

  const onSetDeckName = (): void => {
    $deckStore.name = name;
    modalService.close();
  };
</script>

<style>
  form {
    width: 320px;
  }
</style>

<ModalComponent>
  <form on:submit|preventDefault={onSetDeckName}>
    <label>
      <div class="label__title">Deck name</div>
      <input
        placeholder="Deck name"
        maxlength="12"
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
      <button class="button" {disabled}>CHANGE</button>
    </div>
  </form>
</ModalComponent>
