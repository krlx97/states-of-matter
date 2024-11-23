<script lang="ts">
  import {onDestroy, onMount} from "svelte";
  import {contractAddress} from "@som/shared/data";

  import {
    ethersService,
    formService,
    socketService,
    soundService
  } from "services";

  import {modalStore, playerStore, inventoryStore} from "stores";

  import {
    FormComponent,
    InputComponent,
    FormSubmitComponent,
    TableComponent,
    ModalComponent
  } from "ui";

  const {item} = $modalStore.data;

  const formStore = formService.create({
    address: ["", "name"],
    amount: ["", "item", item.balance],
  });

  const receipt = {
    owned: item.balance,
    remaining: item.balance
  };

  const onInput = (): void => {
    formService.validate(formStore);

    if (!$formStore.fields.amount.error) {
      receipt.remaining = receipt.owned - BigInt($formStore.fields.amount.value);
    } else {
      receipt.remaining = receipt.owned;
    }
  };

  const onSetMax = (): void => {
    soundService.play("click");
    $formStore.fields.amount.value = `${receipt.owned}`;
    onInput();
  };

  const onTransfer = async (): Promise<void> => {
    soundService.play("click");
    $formStore.isLoading = true;

    socketService.socket.emit("getAddress" as any, {
      name: $formStore.fields.address.value
    });
  };

  onMount((): void => {
    socketService.socket.on("getAddress" as any, async (params: any): Promise<void> => {
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
        "collectibles",
        "safeTransferFrom",
        [$playerStore.address, params.address, item.id, $formStore.fields.amount.value, "0x"]
      );

      if (!isConfirmed) {
        $formStore.isLoading = false;
        return;
      }

      await ethersService.reloadUser();
      receipt.owned = item.balance;
      onInput();
      $formStore.isLoading = false;
    });
  });

  onDestroy((): void => {
    socketService.socket.off("getAddress" as any);
  });
</script>

<style>
  .commona {
    color: rgb(var(--common));
    text-shadow: 0px 2px 8px rgb(var(--common));
  }

  .uncommona {
    color: rgb(var(--uncommon));
    text-shadow: 0px 2px 8px rgb(var(--uncommon));
  }

  .rarea {
    color: rgb(var(--rare));
    text-shadow: 0px 2px 8px rgb(var(--rare));
  }

  .epica {
    color: rgb(var(--epic));
    text-shadow: 0px 2px 8px rgb(var(--epic));
  }

  .legendarya {
    color: rgb(var(--legendary));
    text-shadow: 0px 2px 8px rgb(var(--legendary));
  }

  /* .mythica {
    color: rgb(var(--mythic));
    text-shadow: 0px 2px 8px rgb(var(--mythic));
  } */
</style>

<ModalComponent>
  <svelte:fragment slot="title">
    Transfer
    <span
      class:commona={item?.rarity === 0}
      class:uncommona={item?.rarity === 1}
      class:rarea={item?.rarity === 2}
      class:epica={item?.rarity === 3}
      class:legendarya={item?.rarity === 4}>
      {item?.name || ""}
    </span>
  </svelte:fragment>

  <svelte:fragment slot="info">
    Transfer items to another player.
  </svelte:fragment>

  <FormComponent on:submit="{onTransfer}">
    <InputComponent
      label="Name"
      error="{$formStore.fields.address.error}"
      bind:value="{$formStore.fields.address.value}"
      on:input="{onInput}"/>

    <InputComponent
      label="Amount"
      error="{$formStore.fields.amount.error}"
      action="{["MAX", onSetMax]}"
      bind:value="{$formStore.fields.amount.value}"
      on:input="{onInput}"/>

    <TableComponent items="{[
      ["Balance", receipt.owned],
      ["Remaining", receipt.remaining]
    ]}"/>

    <svelte:fragment slot="submit">
      <FormSubmitComponent {formStore}>TRANSFER</FormSubmitComponent>
    </svelte:fragment>
  </FormComponent>
</ModalComponent>
