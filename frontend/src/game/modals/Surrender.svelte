<script lang="ts">
  import {socketService, soundService} from "services";
  import {modalStore} from "stores";
  import {ButtonComponent, ModalComponent} from "ui";

  const onSurrender = (): void => {
    socketService.socket.emit("surrender");
    soundService.play("click");
  };
</script>

<ModalComponent>
  <svelte:fragment slot="title">Surrender</svelte:fragment>
  <svelte:fragment slot="info">
    Are you sure you want to surrender this game? The game will end immediately
    and you will receive half the experience points.
  </svelte:fragment>
  <div>
    <ButtonComponent on:click="{onSurrender}">SURRENDER</ButtonComponent>
  </div>
</ModalComponent>
