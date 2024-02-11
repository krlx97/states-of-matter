<script lang="ts">
  import {formService, modalService, soundService} from "services";
  import {playerStore} from "stores";

  import {
    ButtonComponent,
    FormComponent,
    InputComponent,
    ModalComponent
  } from "ui";

  const formStore = formService.create({
    name: ["", "name"]
  });

  const onInput = (): void => {
    formService.validate(formStore);
  };

  const onSubmit = (): void => {
    $playerStore.decks[$playerStore.deckId].name = $formStore.fields.name.value;
    modalService.close();
    soundService.play("click");
  };
</script>

<ModalComponent>
  <svelte:fragment slot="title">Rename deck</svelte:fragment>

  <FormComponent on:submit="{onSubmit}">
    <InputComponent
      label="Name"
      error="{$formStore.fields.name.error}"
      bind:value="{$formStore.fields.name.value}"
      on:input="{onInput}"/>
    <svelte:fragment slot="submit">
      <ButtonComponent disabled="{$formStore.isDisabled}">
        RENAME
      </ButtonComponent>
    </svelte:fragment>
  </FormComponent>
</ModalComponent>
