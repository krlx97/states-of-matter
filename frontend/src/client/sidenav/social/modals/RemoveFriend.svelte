<script lang="ts">
  import {modalService, socketService} from "services";
  import {modalStore} from "stores";
  import {ModalComponent} from "ui";

  const onRemoveFriend = (): void => {
    const {name} = $modalStore.data;
    socketService.socket.emit("removeFriend", {name});
  };

  const onClose = (): void => {
    modalService.close();
  };
</script>

<style>
  .remove-friend {
    width: 320px;
  }

  .remove-friend__title {
    margin-bottom: var(--spacing-md);
    font-size: var(--font-xlg);
  }

  .remove-friend__text {
    margin-bottom: var(--spacing-md);
    line-height: 1.4;
    text-align: justify;
  }

  .remove-friend__actions {
    display: flex;
    justify-content: center;
    gap: var(--spacing-md);
  }
</style>

<ModalComponent>
  <div class="remove-friend">
    <div class="remove-friend__title">Unfriend {$modalStore.data.name}</div>
    <div class="remove-friend__text">
      Are you sure you want to remove a friend from your friends list? They
      wouldn't be able to send you messages anymore, but will be able to send
      you another friend request.
    </div>
    <div class="remove-friend__actions">
      <button class="button" on:click={onRemoveFriend}>YES</button>
      <button class="button" on:click={onClose}>NO</button>
    </div>
  </div>
</ModalComponent>
