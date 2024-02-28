<script lang="ts">
  import {onDestroy, onMount} from "svelte";

  import {
    ethersService,
    formService,
    modalService,
    soundService
  } from "services";

  import {playerStore, inventoryStore, ethersStore} from "stores";

  import {
    FormComponent,
    FormSubmitComponent,
    ModalComponent,
    TableComponent
  } from "ui";

  import RandomSkinComponent from "./RandomSkin.svelte";

  const formStore = formService.create({});
  let price = 100n * 10n ** 18n;

  const onUnlock = async (): Promise<void> => {
    soundService.play("click");

    $formStore.isLoading = true;

    if ($inventoryStore.approvals.ecr < price) {
      const isConfirmed = await ethersService.transact(
        "ethericCrystals",
        "approve",
        [ethersService.keys.somGame, price]
      );

      if (!isConfirmed) {
        $formStore.isLoading = false;
        return;
      }
    }

    const isConfirmed = await ethersService.transact(
      "somGame",
      "randomItem",
      []
    );

    if (!isConfirmed) {
      $formStore.isLoading = false;
      return;
    }

    await ethersService.reloadUser();

    $formStore.isLoading = false;
  };

  const onRandomSkin = (account: string, id: BigInt): void => {
    if (account.toLowerCase() === $playerStore.address.toLowerCase()) {
      modalService.open(RandomSkinComponent, {
        id: parseInt(id.toString())
      });
    }
  }

  onMount((): void => {
    $formStore.isDisabled = $inventoryStore.ecr < price ? true : false;
    $ethersStore.contracts.somGame.on("RandomItem", onRandomSkin);
  });

  onDestroy((): void => {
    $ethersStore.contracts.somGame.off("RandomItem", onRandomSkin);
  });
</script>

<style>
  a {
    color: rgb(var(--primary));
  }
</style>

<ModalComponent>
  <svelte:fragment slot="title">Craft random</svelte:fragment>

  <svelte:fragment slot="info">
    Craft one completely random item. Two random numbers will be rolled, one
    deciding the rarity, and the other deciding a skin from that rarity list.
    Random numbers are <a href="https://github.com/krlx97/states-of-matter/blob/main/contracts/Game/Game.sol#L88" target="_blank">generated on chain</a> for full transparency.
  </svelte:fragment>

  <FormComponent on:submit="{onUnlock}">
    <TableComponent items="{[
      ["Uncommon", "80%", undefined, "uncommon"],
      ["Rare", "15%", undefined, "rare"],
      ["Epic", "3.9%", undefined, "epic"],
      ["Legendary", "1%", undefined, "legendary"],
      ["Mythic", "0.1%", undefined, "mythic"],
    ]}"/>

    <TableComponent items="{[
      ["Price", price, "ecr"],
      ["Balance", $inventoryStore.ecr, "ecr"],
      ["Remaining balance", $inventoryStore.ecr - price, "ecr"]
    ]}"/>

    <svelte:fragment slot="submit">
      <FormSubmitComponent {formStore}>CRAFT</FormSubmitComponent>
    </svelte:fragment>
  </FormComponent>
</ModalComponent>
