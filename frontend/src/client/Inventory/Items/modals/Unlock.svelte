<script lang="ts">
  import {onDestroy, onMount} from "svelte";
  import {contractAddress} from "@som/shared/data";

  import {
    ethersService,
    formService,
    modalService,
    soundService
  } from "services";

  import {playerStore, inventoryStore, ethersStore} from "stores";
  import {FormComponent, FormSubmitComponent, ModalComponent} from "ui";
  import RandomSkinComponent from "./RandomSkin.svelte";

  const formStore = formService.create({});
  let price = 100n * 10n ** 18n;

  const onUnlock = async (): Promise<void> => {
    soundService.play("click");
    $formStore.isLoading = true;


    if (!$inventoryStore.collectibles.approved) {
      const isConfirmed = await ethersService.transact(
        "collectibles",
        "setApprovalForAll",
        [contractAddress.game, true]
      );

      if (!isConfirmed) {
        $formStore.isLoading = false;
        return;
      }
    }

    const isConfirmed = await ethersService.transact(
      "game",
      "openShardPack",
      []
    );

    if (!isConfirmed) {
      $formStore.isLoading = false;
      return;
    }

    await ethersService.reloadUser();
    $formStore.isLoading = false;
  };

  const openShardPack = (account: string, ids: any): void => {
    if (account.toLowerCase() === $playerStore.address.toLowerCase()) {
      modalService.open(RandomSkinComponent, {ids});
    }
  }

  onMount((): void => {
    $formStore.isDisabled = $inventoryStore.ecr.balance < price ? true : false;
    $ethersStore.contracts.game.on("OpenShardPack", openShardPack);
  });

  onDestroy((): void => {
    $ethersStore.contracts.game.off("OpenShardPack", openShardPack);
  });
</script>

<ModalComponent>
  <svelte:fragment slot="title">Open Shard Pack</svelte:fragment>

  <svelte:fragment slot="info">
    Shard packs contain one random shard for each rarity. You can open the pack
    to obtain the shards, or trade it with other players.
  </svelte:fragment>

  <svelte:fragment slot="content">
    <FormComponent on:submit="{onUnlock}">
      <svelte:fragment slot="submit">
        <FormSubmitComponent {formStore}>OPEN</FormSubmitComponent>
      </svelte:fragment>
    </FormComponent>
  </svelte:fragment>
</ModalComponent>
