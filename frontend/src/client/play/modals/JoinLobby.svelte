<script lang="ts">
  import {socketService, soundService} from "services";

  import {
    ButtonComponent,
    FormComponent,
    InputComponent,
    ModalComponent
  } from "ui";

  let id = "";

  const onInput = (): void => {

  };

  const onSubmit = (): void => {
    socketService.socket.emit("joinLobby", {id: parseInt(id)});
    soundService.play("click");
  };
</script>

<ModalComponent>

  <svelte:fragment slot="title">Join lobby</svelte:fragment>

  <FormComponent on:submit="{onSubmit}">

    <InputComponent label="Lobby ID" bind:value="{id}" on:input="{onInput}"/>

    <svelte:fragment slot="submit">
      <ButtonComponent>JOIN</ButtonComponent>
    </svelte:fragment>

  </FormComponent>

</ModalComponent>
