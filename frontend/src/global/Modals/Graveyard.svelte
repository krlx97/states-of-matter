<script lang="ts">
  import {modalStore} from "stores";
  import {CardComponent, ModalComponent} from "ui";
</script>

<style>
  .cards {
    width: calc(148px * 4 + var(--md) * 3);
    padding-bottom: var(--md);
    display: flex;
    gap: var(--md);
    overflow-x: scroll;
  }

  .cards::-webkit-scrollbar {
    height: 4px;
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
      <div>
        <CardComponent {card}/>
      </div>
    {/each}
  </div>
</ModalComponent>
