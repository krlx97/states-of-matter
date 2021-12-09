<script lang="ts">
  import {Modal} from "components";
  import {socketService} from "services";
  import {modalStore} from "stores/view";

  const onBlock = (): void => {
    const {username} = $modalStore.data;
    socketService.emit("block", {username});
  };
</script>

<Modal>
  <p>
    Are you sure you want to block {$modalStore.data.username}?<br>
    Doing so will prevent them from sending you requests until you unblock them.
  </p>
  <button class="btn--raised-accent" on:click={onBlock}>
    YES
  </button>
  <button class="btn--basic-accent">
    NO
  </button>
</Modal>
