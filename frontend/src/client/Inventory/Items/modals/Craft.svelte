<script lang="ts">
  import {items} from "@som/shared/data";
  import {ethersService, formService, soundService} from "services";
  import {modalStore, inventoryStore} from "stores";
  import { onMount } from "svelte";
  import {CurrencyComponent, InputComponent, FormComponent, FormSubmitComponent, ModalComponent, TableComponent} from "ui";

  const {id} = $modalStore.data;
  const item = items.find((item) => item.id === id);
  const itemWallet = $inventoryStore.items.find((item) => item.id === id);
  let ecrPrice = 0n;
  let eesPrice = 0n;

  // ecrPrice = 100n * 10n ** 18n;

  if (!item) {
    eesPrice = 100n * 10n ** 18n;
    ecrPrice = 100n * 10n ** 18n;
  } else {
    if (item.rarity === 1) {
      eesPrice = 200n * 10n ** 18n;
      ecrPrice = 200n * 10n ** 18n;
    }
    if (item.rarity === 2) {
      eesPrice = 800n * 10n ** 18n;
      ecrPrice = 400n * 10n ** 18n;

    }
    if (item.rarity === 3) {
      eesPrice = 3200n * 10n ** 18n;
      ecrPrice = 600n * 10n ** 18n;

    }
    if (item.rarity === 4) {
      eesPrice = 12800n * 10n ** 18n;
      ecrPrice = 800n * 10n ** 18n;

    }
    if (item.rarity === 5) {
      eesPrice = 51200n * 10n ** 18n;
      ecrPrice = 1000n * 10n ** 18n;
    }
  }
  onMount((): void => {
  });

  const getPrice = (): number => {
    return 100;
  }

  const formStore = formService.create({
    amount: ["", "craft2", $inventoryStore.ees, eesPrice, $inventoryStore.ecr, ecrPrice],
  });

  const receipt = {
    price: 0n,
    priceEcr: 0n,
    remaining: $inventoryStore.ees,
    remainingEcr: $inventoryStore.ecr
  };

  const onInput = (): void => {
    formService.validate(formStore);

    if (!$formStore.fields.amount.error) {
      receipt.price = eesPrice * BigInt($formStore.fields.amount.value);
      receipt.priceEcr = ecrPrice * BigInt($formStore.fields.amount.value);
      receipt.remaining = $inventoryStore.ees - BigInt(receipt.price);
      receipt.remainingEcr = $inventoryStore.ecr - receipt.priceEcr;
    } else {
      receipt.price = 0n;
      receipt.priceEcr = 0n;
      receipt.remaining = $inventoryStore.ees;
      receipt.remainingEcr = $inventoryStore.ecr;
    }
  };

  const onSetMax = (): void => {
    soundService.play("click");

    const max1 = $inventoryStore.ecr / ecrPrice;
    const max2 = $inventoryStore.ees / eesPrice;

    if (max1 > max2) {
      $formStore.fields.amount.value = `${max2}`;
    } else {
      $formStore.fields.amount.value = `${max1}`;
    }

    onInput();
  };

  const onSubmit = async (): Promise<void> => {
    soundService.play("click");

    $formStore.isLoading = true;

    const {somGame} = ethersService.keys;

    if ($inventoryStore.approvals.ecr < receipt.priceEcr + 1n) {
      await ethersService.transact(
        "ethericCrystals",
        "approve",
        [somGame, receipt.priceEcr + 1n]
      );
    }

    if ($inventoryStore.approvals.ees < receipt.price + 1n) {
      await ethersService.transact(
        "ethericEssence",
        "approve",
        [somGame, receipt.price + 1n]
      );
    }

    const isConfirmed = await ethersService.transact(
      "somGame",
      "craftItem",
      [id, $formStore.fields.amount.value]
    );

    if (isConfirmed) {
      await ethersService.reloadUser();
      onInput();
    }

    $formStore.isLoading = false;
  };
</script>

<ModalComponent>
  <svelte:fragment slot="title">Craft {item?.name || ""}</svelte:fragment>

  <svelte:fragment slot="info">
    Burn etheric crystals and etheric essence to craft items.
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
        ["Price per item", eesPrice, "ees"],
        ["Total price", receipt.price, "ees"],
        ["Remaining", receipt.remaining, "ees"],
      ]}"/>

      <TableComponent items="{[
        ["Price per item", ecrPrice, "ecr"],
        ["Total price", receipt.priceEcr, "ecr"],
        ["Remaining", receipt.remainingEcr, "ecr"],
      ]}"/>

      <svelte:fragment slot="submit">
        <FormSubmitComponent {formStore}>CRAFT</FormSubmitComponent>
      </svelte:fragment>
    </FormComponent>
  </svelte:fragment>
</ModalComponent>
