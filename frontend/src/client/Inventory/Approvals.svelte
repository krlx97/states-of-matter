<script lang="ts">
  import {ethersService} from "services";
  import {inventoryStore} from "stores";
  import {ButtonComponent, ModalComponent, TableComponent} from "ui";

  const {somGame} = ethersService.keys;

  const onRemoveEssenceApproval = async (): Promise<void> => {
    await ethersService.transact(
      "ethericEssence",
      "approve",
      [somGame, "0"]
    );
  };

  const onRemoveCrystalsApproval = async (): Promise<void> => {
    await ethersService.transact(
      "ethericCrystals",
      "approve",
      [somGame, 0n]
    );
  };

  const onRemoveEnergyApproval = async (): Promise<void> => {
    await ethersService.transact(
      "ethericEnergy",
      "approve",
      [somGame, 0n]
    );
  };

  const onRemoveItemApproval = async (): Promise<void> => {
    await ethersService.transact(
      "somTokens",
      "setApprovalForAll",
      [somGame, false]
    );
  };
</script>

<ModalComponent>
  <svelte:fragment slot="title">Approvals</svelte:fragment>
  <svelte:fragment slot="info">
    Here you can see whether, and how much, our game can spend assets
    on your behalf. Want to save on fees? Just give us unlimited permission.
    Prefer extra safety? You'll need to approve each inventory action.
  </svelte:fragment>
  <svelte:fragment slot="content">
    <TableComponent items="{[
      ["Items", $inventoryStore.approvals.items ? "Yes" : "No"],
      ["Etheric Essence", $inventoryStore.approvals.ees, "ees"],
      ["Etheric Crystals", $inventoryStore.approvals.ecr, "ecr"],
      ["Etheric Energy", $inventoryStore.approvals.enrg, "enrg"],
    ]}"/>
    If you wish to remove an approval, click the button below.
    <ButtonComponent on:click="{onRemoveItemApproval}">Items</ButtonComponent>
    <ButtonComponent on:click="{onRemoveEssenceApproval}">Etheric Essence</ButtonComponent>
    <ButtonComponent on:click="{onRemoveCrystalsApproval}">Etheric Crystals</ButtonComponent>
    <ButtonComponent on:click="{onRemoveEnergyApproval}">Etheric Energy</ButtonComponent>
  </svelte:fragment>
</ModalComponent>
