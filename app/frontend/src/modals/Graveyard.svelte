<script lang="ts">
  import {modalStore} from "stores";
  import Modal from "../ui/Modal.svelte";
  import Card from "../ui/Card.svelte";
</script>

<style lang="scss">
  @import "../shared/styles/variables";

  .cards {
    width: calc($card-width * 4 + $spacing-sm * 4);
    padding: $spacing-sm;
    overflow: scroll hidden;
    display: flex;
  }
  .cards::-webkit-scrollbar {
    height: 8px;
  }
  .cards::-webkit-scrollbar-track {
    background-color: transparent;
  }
  .cards::-webkit-scrollbar-thumb {
    background-color: $dark-grey;
    border: 2px solid transparent;
    border-radius: 8px;
    box-sizing: border-box;
  }
  .card {
    margin-right: $spacing-sm;

    &:last-child {margin-right: 0}
  }
</style>

<Modal>
  <div class="cards">
    {#each $modalStore.data as card}
      <div class="card">
        <Card {card} health={1} damage={1}/>
      </div>
    {/each}
  </div>
</Modal>
