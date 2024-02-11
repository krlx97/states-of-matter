<script lang="ts">
  import {onDestroy, onMount} from "svelte";
  import {ethersService, formService, modalService, soundService} from "services";
  import {modalStore, playerStore, inventoryStore, ethersStore} from "stores";
  import {ButtonComponent, CurrencyComponent, FormComponent, FormSubmitComponent, ModalComponent, TableComponent} from "ui";
  import RandomSkinComponent from "../../Items/modals/RandomSkin.svelte";

  const formStore = formService.create({});

  const onUnlock = async (): Promise<void> => {
    $formStore.isLoading = true;
    const {somGame} = ethersService.keys;
    soundService.play("click");

    if (!$inventoryStore.approvals.items) {
      const isConfirmed = await ethersService.transact("somTokens", "setApprovalForAll", [somGame, true]);
      if (!isConfirmed) {
        $formStore.isLoading = false;
        return;
      }
    }

    const isConfirmed = await ethersService.transact("somGame", "unlockChest", []);
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
    if ($inventoryStore.chests < 1n) {
      $formStore.isDisabled = true;
    } else {
      $formStore.isDisabled = false;
    }

    $ethersStore.contracts.somGame.on("RandomItem", onRandomSkin);
  });

  onDestroy((): void => {
    $ethersStore.contracts.somGame.off("RandomItem", onRandomSkin);
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
