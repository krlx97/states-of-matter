<script lang="ts">
  import {contractAddress} from "@som/shared/data";
  import {ethersService, formService, soundService} from "services";
  import {modalStore, inventoryStore} from "stores";

  import {
    InputComponent,
    FormComponent,
    FormSubmitComponent,
    ModalComponent,
    TableComponent
  } from "ui";

  const {item} = $modalStore.data;
  let ecrPrice = 100n * 10n ** 18n;
  let reqShards = 0n;

  if (item?.rarity === 1) {
    reqShards = 1n;
  } else if (item?.rarity === 2) {
    reqShards = 10n;
  } else if (item?.rarity === 3) {
    reqShards = 100n;
  } else if (item?.rarity === 4) {
    reqShards = 1000n;
  }

  const formStore = formService.create({
    amount: ["", "craft2", $inventoryStore.ecr.balance, ecrPrice, item.shards, reqShards],
  });

  const receipt = {
    price: ecrPrice,
    total: 0n,
    balance: $inventoryStore.ecr.balance,
    remaining: $inventoryStore.ecr.balance,
    price2: reqShards,
    total2: 0n,
    balance2: item.shards,
    remaining2: item.shards
  };

  const onInput = (): void => {
    formService.validate(formStore);

    if (!$formStore.fields.amount.error) {
      receipt.total = receipt.price * BigInt($formStore.fields.amount.value);
      receipt.remaining = $inventoryStore.ecr.balance - BigInt(receipt.total);

      receipt.total2 = reqShards * BigInt($formStore.fields.amount.value);
      receipt.remaining2 = item.shards - reqShards * BigInt($formStore.fields.amount.value)
    } else {
      receipt.total = 0n;
      receipt.remaining = $inventoryStore.ecr.balance;

      receipt.total2 = 0n;
      receipt.remaining2 = item.shards;
    }
  };

  const onSetMax = (): void => {
    soundService.play("click");

    const val1 = item.shards / reqShards;
    const val2 = $inventoryStore.ecr.balance / ecrPrice;

    if (val1 > val2) {
      $formStore.fields.amount.value = `${val2}`;
    } else {
      $formStore.fields.amount.value = `${val1}`;
    }

    onInput();
  };

  const onSubmit = async (): Promise<void> => {
    soundService.play("click");

    $formStore.isLoading = true;

    if ($inventoryStore.ecr.allowance < receipt.total) {
      const isConfirmed = await ethersService.transact(
        "ethericCrystals",
        "approve",
        [contractAddress.game, receipt.total]
      );

      if (!isConfirmed) {
        $formStore.isLoading = false;
        return;
      }
    }

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
      "craftItem",
      [item.id, $formStore.fields.amount.value]
    );

    if (!isConfirmed) {
      $formStore.isLoading = false;
      return;
    }

    await ethersService.reloadUser();

    receipt.balance = $inventoryStore.ecr.balance;
    receipt.remaining = $inventoryStore.ecr.balance;
    receipt.balance2 = item.shards;
    receipt.remaining2 = item.shards;

    onInput();

    $formStore.isLoading = false;
  };
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
    Craft
    <span
      class:commona={item.rarity === 0}
      class:uncommona={item.rarity === 1}
      class:rarea={item.rarity === 2}
      class:epica={item.rarity === 3}
      class:legendarya={item.rarity === 4}>
      {item.name || ""}
    </span>
  </svelte:fragment>

  <svelte:fragment slot="info">
    Pay Etheric Crystals to convert Shards into an Item.
  </svelte:fragment>

  <svelte:fragment slot="content">
    <FormComponent on:submit="{onSubmit}">
      <InputComponent
        label="Amount"
        error="{$formStore.fields.amount.error}"
        action="{["MAX", onSetMax]}"
        bind:value="{$formStore.fields.amount.value}"
        on:input="{onInput}"/>

      <TableComponent items="{[
        ["Price", receipt.price, "ecr"],
        ["Total", receipt.total, "ecr"],
        ["Balance", receipt.balance, "ecr"],
        ["Remaining", receipt.remaining, "ecr"]
      ]}"/>

      <TableComponent items="{[
        ["Shards required", receipt.price2],
        ["Shards total", receipt.total2],
        ["Balance", receipt.balance2],
        ["Remaining", receipt.remaining2]
      ]}"/>

      <svelte:fragment slot="submit">
        <FormSubmitComponent {formStore}>CRAFT</FormSubmitComponent>
      </svelte:fragment>
    </FormComponent>
  </svelte:fragment>
</ModalComponent>
