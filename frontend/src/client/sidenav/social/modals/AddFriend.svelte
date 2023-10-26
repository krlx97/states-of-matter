<script lang="ts">
  import {formService, socketService} from "services";
  import {FormFieldComponent, ModalComponent} from "ui";

  const formStore = formService.create({
    name: ["", "name"]
  });

  const onInput = (): void => {
    formService.validate(formStore);
  };

  const onSubmit = (): void => {
    socketService.socket.emit("addFriend", {
      name: $formStore.fields.name.value
    });
  };
</script>

<ModalComponent>
  <div class="modal">
    <form on:submit|preventDefault="{onSubmit}">
    <FormFieldComponent
          label="Name"
        error="{$formStore.fields.name.error}"
        bind:value="{$formStore.fields.name.value}"
        on:input="{onInput}"/>
          <div class="form__submit">
      <button class="button" disabled="{$formStore.isDisabled}">ADD</button>
    </div>
  </form>
</div>
</ModalComponent>

