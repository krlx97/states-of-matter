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

  import RandomSkinComponent from "../../Items/modals/RandomSkin.svelte";

  const formStore = formService.create({});

  const onUnlock = async (): Promise<void> => {
    soundService.play("click");

    $formStore.isLoading = true;

    if (!$inventoryStore.approvals.items) {
      const isConfirmed = await ethersService.transact(
        "somTokens",
        "setApprovalForAll",
        [ethersService.keys.somGame, true]
      );

      if (!isConfirmed) {
        $formStore.isLoading = false;
        return;
      }
    }

    const isConfirmed = await ethersService.transact(
      "somGame",
      "unlockChest",
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
    $formStore.isDisabled = $inventoryStore.chests < 1n ? true : false;
    $ethersStore.contracts.somGame.on("UnlockChest", onRandomSkin);
  });

  onDestroy((): void => {
    $ethersStore.contracts.somGame.off("UnlockChest", onRandomSkin);
  });
</script>

<ModalComponent>
  <svelte:fragment slot="title">Unlock chest</svelte:fragment>

  <svelte:fragment slot="info">
    The chest contains one completely random item. When unlocked, it will pick
    a random rarity, and give you a random item from that rarity list.
  </svelte:fragment>

  <FormComponent on:submit="{onUnlock}">
    <TableComponent items="{[
      ["UNCOMMON", "80%", undefined, "uncommon"],
      ["RARE", "15%", undefined, "rare"],
      ["EPIC", "3.9%", undefined, "epic"],
      ["LEGENDARY", "1%", undefined, "legendary"],
      ["MYTHIC", "0.1%", undefined, "mythic"],
    ]}"/>

    <svelte:fragment slot="submit">
      <FormSubmitComponent {formStore}>UNLOCK</FormSubmitComponent>
    </svelte:fragment>
  </FormComponent>
</ModalComponent>
