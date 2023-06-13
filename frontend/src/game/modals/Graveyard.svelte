<script lang="ts">
  import {modalStore} from "stores";
  import {CardComponent, ModalComponent} from "ui";
</script>

<style>
  .cards {
    width: calc(144px * 4 + var(--spacing-sm) * 4);
    padding: var(--spacing-sm);
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
    background-color: rgb(var(--dark-grey));
    border: 2px solid transparent;
    border-radius: 8px;
    box-sizing: border-box;
  }

  .card {
    margin-right: var(--spacing-sm);
  }
  .card:last-child {
    margin-right: 0;
  }
</style>

<ModalComponent>
  <div class="cards">
    {#each $modalStore.data as card}
      <div class="card">
        <CardComponent {card} health={1} damage={1}/>
      </div>
    {/each}
  </div>
</ModalComponent>
