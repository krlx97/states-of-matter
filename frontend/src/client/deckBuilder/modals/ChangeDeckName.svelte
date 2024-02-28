<script lang="ts">
  import {formService, modalService, soundService} from "services";
  import {deckCache, playerStore} from "stores";

  import {
    ButtonComponent,
    FormComponent,
    InputComponent,
    ModalComponent
  } from "ui";
    import { isDeckSame } from "../canSave";

  const formStore = formService.create({
    name: [$playerStore.decks[$playerStore.deckId].name, "name"]
  });

  const onInput = (): void => {
    formService.validate(formStore);
  };

  const onSubmit = (): void => {
    $playerStore.decks[$playerStore.deckId].name = $formStore.fields.name.value;
    isDeckSame($deckCache, $playerStore.decks[$playerStore.deckId]);

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
