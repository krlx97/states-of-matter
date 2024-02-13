<script lang="ts">
  import {inventoryStore} from "stores";
  import {ModalComponent, TableComponent} from "ui";
</script>

<ModalComponent>
  <svelte:fragment slot="title">Approvals</svelte:fragment>
  <svelte:fragment slot="info">
    Here you can see whether, and how much, our game can spend assets
    on your behalf. Don't sweat it, we'll only ask when you're making a
    purchase. Want to save on fees? Just give us unlimited permission. Prefer
    extra safety? You'll need to approve each inventory action. Your assets,
    your choice!
  </svelte:fragment>
  <svelte:fragment slot="content">
    <TableComponent items="{[
      ["Items", $inventoryStore.approvals.items ? "Yes" : "No"],
      ["Etheric Essence", $inventoryStore.approvals.ees, "ees"],
      ["Etheric Crystals", $inventoryStore.approvals.ecr, "ecr"],
      ["Etheric Energy", $inventoryStore.approvals.enrg, "enrg"],
    ]}"/>
  </svelte:fragment>
</ModalComponent>
