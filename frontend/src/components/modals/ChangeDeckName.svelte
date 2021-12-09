<script lang="ts">
  import {Modal} from "components";
  import {socketService} from "services";
  import {modalStore} from "stores/view";

  let name = "";

  const onSetDeckName = (): void => {
    const {id} = $modalStore.data;
    socketService.emit("setDeckName", {id, name});
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
