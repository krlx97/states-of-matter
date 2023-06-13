<script lang="ts">
  import {modalService, socketService} from "services";
  import {modalStore} from "stores";
  import {ModalComponent} from "ui";

  const onBlockFriend = (): void => {
    const {name} = $modalStore.data;
    socketService.socket.emit("blockFriend", {name});
  };

  const onClose = (): void => {
    modalService.close();
  };
</script>

<style>
  .block-friend {
    width: 320px;
  }

  .block-friend__title {
    margin-bottom: var(--spacing-md);
    font-size: var(--font-xlg);
  }

  .block-friend__text {
    margin-bottom: var(--spacing-md);
    line-height: 1.4;
    text-align: justify;
  }

  .block-friend__actions {
    display: flex;
    justify-content: center;
    gap: var(--spacing-md);
  }
</style>

<ModalComponent>
  <div class="block-friend">
    <div class="block-friend__title">Block {$modalStore.data.name}</div>
    <div class="block-friend__text">
      Are you sure you want to block your friend? Doing so will prevent them
      from sending you friend requests or messages until you unblock them.
    </div>
    <div class="block-friend__actions">
      <button class="button" on:click={onBlockFriend}>YES</button>
      <button class="button" on:click={onClose}>NO</button>
    </div>
  </div>
</ModalComponent>
