<script lang="ts">
  import {modalStore} from "stores";
  import {CardComponent, ModalComponent} from "ui";
</script>

<style>
  .cards {
    width: calc(144px * 4);
    display: flex;
    gap: var(--spacing-md);
    overflow-x: scroll;
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
</style>

<ModalComponent width="664px">
  <div class="cards">
    {#each $modalStore.data as card}
      <CardComponent {card}/>
    {/each}
  </div>
</ModalComponent>
