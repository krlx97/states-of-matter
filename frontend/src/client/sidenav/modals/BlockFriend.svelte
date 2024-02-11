<script lang="ts">
  import {socketService, soundService} from "services";
  import {modalStore} from "stores";
  import {ButtonComponent, ModalComponent} from "ui";

  const onBlockFriend = (): void => {
    const {name} = $modalStore.data;
    socketService.socket.emit("blockFriend", {name});
    soundService.play("click");
  };
</script>

<ModalComponent>
  <svelte:fragment slot="title">Block friend</svelte:fragment>
  <svelte:fragment slot="info">
    Are you sure you want to block {$modalStore.data.name}? Doing so will
    prevent them from sending you friend requests or messages until you
    unblock them.
  </svelte:fragment>
  <div>
    <ButtonComponent on:click="{onBlockFriend}">YES</ButtonComponent>
  </div>
</ModalComponent>
