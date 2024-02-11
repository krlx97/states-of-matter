<script lang="ts">
  import {modalStore} from "stores";
  import {CardComponent, ModalComponent} from "ui";
</script>

<style>
  .cards {
    width: calc(144px * 4 + var(--sm) * 4);
    padding: var(--sm);
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
    margin-right: var(--sm);
  }
  .card:last-child {
    margin-right: 0;
  }
</style>

<ModalComponent>
  <div class="cards">
    {#each $modalStore.data as card}
      <div class="card">
        <CardComponent {card}/>
      </div>
    {/each}
  </div>
</ModalComponent>
