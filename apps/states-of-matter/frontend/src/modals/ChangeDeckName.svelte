<script lang="ts">
  import {socketService} from "services";
  import {modalStore} from "stores";
  import Modal from "../ui/Modal.svelte";

  let name = "";

  const onSetDeckName = (): void => {
    const {id} = $modalStore.data;
    socketService.socket.emit("setDeckName", {id, name});
  };
</script>

<Modal>
  <form on:submit|preventDefault={onSetDeckName}>
    <label>
      Deck name
      <input placeholder="Deck name" name="deckName" bind:value={name}/>
    </label>
    <button class="btn--raised-purple">SET</button>
  </form>
</Modal>
