<script lang="ts">
  import {socketService} from "services";
  import {FormFieldComponent, ModalComponent} from "ui";

  let id = "";

  const onInput = (): void => {

  };

  const onSubmit = (): void => {
    socketService.socket.emit("joinLobby", {id: parseInt(id)});
  };
</script>

<ModalComponent>
  <div class="modal">
    <form on:submit|preventDefault="{onSubmit}">
    <FormFieldComponent
        label="Lobby ID"
        bind:value="{id}"
        on:input="{onInput}"/>
    <div class="form__submit">
    <button class="button">JOIN</button>
</div>
  </form>
</div>
</ModalComponent>
