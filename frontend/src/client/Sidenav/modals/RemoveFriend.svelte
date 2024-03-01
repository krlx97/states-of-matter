<script lang="ts">
  import {socketService, soundService} from "services";
  import {modalStore} from "stores";
  import {ButtonComponent, ModalComponent} from "ui";

  const onRemoveFriend = (): void => {
    const {name} = $modalStore.data;
    socketService.socket.emit("removeFriend", {name});
    soundService.play("click");
  };
</script>

<ModalComponent>
  <svelte:fragment slot="title">Remove friend</svelte:fragment>
  <svelte:fragment slot="info">
    Are you sure you want to remove {$modalStore.data.name} from your friends
    list?
  </svelte:fragment>
  <div>
    <ButtonComponent on:click="{onRemoveFriend}">YES</ButtonComponent>
  </div>
</ModalComponent>
