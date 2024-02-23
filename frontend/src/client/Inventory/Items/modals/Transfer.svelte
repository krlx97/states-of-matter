<script lang="ts">
  import {items} from "@som/shared/data";
  import {ethersService, formService, socketService, soundService} from "services";
  import {modalStore, playerStore, inventoryStore} from "stores";
    import { onDestroy, onMount } from "svelte";
  import {FormComponent, InputComponent, FormSubmitComponent, TableComponent, ModalComponent} from "ui";

  const {id} = $modalStore.data;
  const item = id !== 1 ? items.find((item) => item.id === id) : {name: "Chest", rarity: 0};
  const itemWallet = id !== 1 ? $inventoryStore.items.find((item) => item.id === BigInt(id)).balance : $inventoryStore.chests;

  const formStore = formService.create({
    address: ["", "name"],
    amount: ["", "item", itemWallet],
  });

  const receipt = {
    owned: itemWallet,
    remaining: itemWallet
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
    $formStore.fields.amount.value = `${receipt.owned}`;
    onInput();
    soundService.play("click");
  };

  const onTransfer = async (): Promise<void> => {
    $formStore.isLoading = true;
    soundService.play("click");

    socketService.socket.emit("getAddress", {name: $formStore.fields.address.value});
  };

  onMount((): void => {
    socketService.socket.on("getAddress", async (params: any): Promise<void> => {
      const {somGame} = ethersService.keys;

      // if (!$inventoryStore.isApprovedForAll) {
        const isConfirmed = await ethersService.transact("somTokens", "setApprovalForAll", [somGame, true]);

        if (isConfirmed) {
          const isConfirmed = await ethersService.transact(
            "somTokens",
            "safeTransferFrom",
            [$playerStore.address, params.address, id, $formStore.fields.amount.value, "0x"]
          );

          if (!isConfirmed) {
            await ethersService.reloadUser();
            // receipt.owned = id !== 1 ? $inventoryStore.items.find((item) => item.id === id)?.balance : 1n;
            receipt.owned = 1n;
            onInput();
          }
        }
      // }

      $formStore.isLoading = false;
    });
  });

  onDestroy((): void => {
    socketService.socket.off("getAddress");
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

  .mythica {
    color: rgb(var(--mythic));
    text-shadow: 0px 2px 8px rgb(var(--mythic));
  }
</style>

<ModalComponent>
  <svelte:fragment slot="title">Transfer
    <span
      class:commona={item?.rarity === 0}
      class:uncommona={item?.rarity === 1}
      class:rarea={item?.rarity === 2}
      class:epica={item?.rarity === 3}
      class:legendarya={item?.rarity === 4}
      class:mythica={item?.rarity === 5}>
      {item?.name || ""}
    </span></svelte:fragment>
  <svelte:fragment slot="info">
    Transfer an item to another player
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
      ["Remaining balance", receipt.remaining]
    ]}"/>

    <svelte:fragment slot="submit">
      <FormSubmitComponent {formStore}>TRANSFER</FormSubmitComponent>
    </svelte:fragment>
  </FormComponent>
</ModalComponent>
