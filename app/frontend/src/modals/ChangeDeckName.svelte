<script lang="ts">
  import {socketService} from "services";
  import {modalStore} from "stores/view";

  import Modal from "../ui/Modal.svelte";

  let name = "";

  const onSetDeckName = (): void => {
    const {id} = $modalStore.data;
    socketService.setDeckName({id, name});
  };
</script>

<Modal>
  <form>
    <div class="form__field">
      <label for="deckName">Deck name</label>
      <input
        id="deckName"
        placeholder="Deck name"
        name="deckName"
        type="text"
        bind:value={name}/>
    </div>

    <div class="form__field">
      <button class="form__field__submit" on:click={onSetDeckName}>
        SET
      </button>
    </div>
  </form>
</Modal>
