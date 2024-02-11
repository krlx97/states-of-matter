<script lang="ts">
  import {formService, socketService, soundService} from "services";
  import {ButtonComponent, FormComponent, InputComponent, ModalComponent} from "ui";

  const formStore = formService.create({
    name: ["", "name"]
  });

  const onInput = (): void => {
    formService.validate(formStore);
  };

  const onSubmit = (): void => {
    const name = $formStore.fields.name.value;
    socketService.socket.emit("addFriend", {name});
    soundService.play("click");
  };
</script>

<ModalComponent>
  <svelte:fragment slot="title">Add friend</svelte:fragment>

  <FormComponent on:submit="{onSubmit}">

    <InputComponent
      label="Name"
      error="{$formStore.fields.name.error}"
      bind:value="{$formStore.fields.name.value}"
      on:input="{onInput}"/>

    <svelte:fragment slot="submit">
      <ButtonComponent disabled="{$formStore.isDisabled}">ADD</ButtonComponent>
    </svelte:fragment>

  </FormComponent>
</ModalComponent>
