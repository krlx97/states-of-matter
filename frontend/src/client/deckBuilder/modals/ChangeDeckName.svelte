<script lang="ts">
  import {formService, modalService} from "services";
  import {deckStore} from "stores";
  import {FormFieldComponent, ModalComponent} from "ui";

  const formStore = formService.create({
    name: ["", "name"]
  });

  const onInput = (): void => {
    formService.validate(formStore);
  };

  const onSubmit = (): void => {
    $deckStore.name = $formStore.fields.name.value;
    modalService.close();
  };
</script>

<ModalComponent>
  <div class="modal">
    <form on:submit|preventDefault="{onSubmit}">
    <FormFieldComponent
        label="Deck name"
        error="{$formStore.fields.name.error}"
        bind:value="{$formStore.fields.name.value}"
        on:input="{onInput}"/>
    <div class="form__submit">
      <button class="button" disabled="{$formStore.isDisabled}">
          CHANGE
        </button>
    </div>
  </form>
</div>
</ModalComponent>
