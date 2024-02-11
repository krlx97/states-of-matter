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

  ecrPrice = 100n * 10n ** 18n;

  if (!item) {
    eesPrice = 100n * 10n ** 18n;
  } else {
    if (item.rarity === 1) {
      eesPrice = 100n * 10n ** 18n;
    }
    if (item.rarity === 2) {
      eesPrice = 400n * 10n ** 18n;
    }
    if (item.rarity === 3) {
      eesPrice = 1600n * 10n ** 18n;
    }
    if (item.rarity === 4) {
      eesPrice = 6400n * 10n ** 18n;
    }
    if (item.rarity === 5) {
      eesPrice = 25600n * 10n ** 18n;
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
    const max1 = $inventoryStore.ecr / ecrPrice;
    const max2 = $inventoryStore.ees / eesPrice;
    console.log(max1 > max2);

    // if (ecrPrice * max1 < $inventoryStore.ecr && eesPrice * max2 > $inventoryStore.ees) {
    //   $formStore.fields.amount.value = `${max1}`;
    // } else if (eesPrice * max2 < $inventoryStore.ees && ecrPrice * max1 > $inventoryStore.ecr) {
    //   $formStore.fields.amount.value = `${max2}`;
    // }

    if (max1 > max2) {
      $formStore.fields.amount.value = `${max2}`;
    } else {
      $formStore.fields.amount.value = `${max1}`;
    }

    onInput();
    soundService.play("click");
  };

  const onSubmit = async (): Promise<void> => {
    $formStore.isLoading = true;
    const {somGame} = ethersService.keys;
    soundService.play("click");

    if ($inventoryStore.approvals.ecr < receipt.priceEcr) {
      await ethersService.transact(
        "ethericCrystals",
        "approve",
        [somGame, receipt.priceEcr - $inventoryStore.approvals.ecr]
      );
    }

    if ($inventoryStore.approvals.ees < receipt.price) {
      await ethersService.transact(
        "ethericEssence",
        "approve",
        [somGame, receipt.price - $inventoryStore.approvals.ees]
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
    Spend etheric crystals and etheric essence to craft a desired item.
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
        // ["PRICE ECR", ecrPrice, "ecr"],
        ["Total price", receipt.price, "ees"],
        // ["TOTAL ECR", receipt.priceEcr, "ecr"],
        ["Remaining", receipt.remaining, "ees"],
        // ["REMAINING ECR", receipt.remainingEcr, "ecr"],
      ]}"/>
      <TableComponent items="{[
        // ["PRICE EES", eesPrice, "ees"],
        ["Price per item", ecrPrice, "ecr"],
        // ["TOTAL EES", receipt.price, "ees"],
        ["Total price", receipt.priceEcr, "ecr"],
        // ["REMAINING EES", receipt.remaining, "ees"],
        ["Remaining", receipt.remainingEcr, "ecr"],
      ]}"/>

      <svelte:fragment slot="submit">
        <FormSubmitComponent {formStore}>CRAFT</FormSubmitComponent>
      </svelte:fragment>
    </FormComponent>
  </svelte:fragment>
</ModalComponent>
