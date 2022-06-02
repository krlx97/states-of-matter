<script lang="ts">
  import Modal from "../ui/Modal.svelte";
  import {modalStore} from "stores";
  import Card from "../ui/Card.svelte";
</script>

<style lang="scss">
  .lore {
    display: flex;
    align-items: center;
    gap: 1em;

    &__text {flex-grow: 1;}
  }
</style>

<Modal>
  <div class="lore">
    <div class="lore__card">
      <Card card={$modalStore.data} health={0} damage={0}/>
    </div>
    <div class="lore__text">{$modalStore.data.lore}</div>
  </div>
</Modal>
