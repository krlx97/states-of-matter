<script lang="ts">
  import {modalStore} from "stores";
  import Modal from "../ui/Modal.svelte";

  const pointsMap = new Map([
    [1, "Common"],
    [2, "Rare"],
    [3, "Epic"]
  ]);
</script>

<style>
  .nft-info {
    line-height: 1.4;
  }
</style>

<Modal>
  <div class="nft-info">
    Serial: {$modalStore.data.serial}<br/>
    Rarity: {pointsMap.get($modalStore.data.attrs[1].points)}<br/>
    Game: States of Matter<br/>
    Type: Card Skin<br/>
    Title: {$modalStore.data.tags.title}<br/>
    Author: {$modalStore.data.tags.author}<br/>
  </div>
</Modal>
