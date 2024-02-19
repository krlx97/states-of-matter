<script lang="ts">
  import {items} from "@som/shared/data";
  import {ethersService, formService, soundService} from "services";
  import {modalStore, inventoryStore} from "stores";

  import {
    InputComponent,
    FormComponent,
    FormSubmitComponent,
    ModalComponent,
    TableComponent
  } from "ui";

  const {id} = $modalStore.data;
  const item = items.find((item): boolean => item.id === id);
  let eesPrice = 0n;

  if (item?.rarity === 1) {
    eesPrice = 200n * 10n ** 18n;
  } else if (item?.rarity === 2) {
    eesPrice = 800n * 10n ** 18n;
  } else if (item?.rarity === 3) {
    eesPrice = 3200n * 10n ** 18n;
  } else if (item?.rarity === 4) {
    eesPrice = 12800n * 10n ** 18n;
  } else if (item?.rarity === 5) {
    eesPrice = 51200n * 10n ** 18n;
  }

  const formStore = formService.create({
    amount: ["", "craft", $inventoryStore.ees, eesPrice],
  });

  const receipt = {
    price: 0n,
    balance: $inventoryStore.ees,
    remaining: $inventoryStore.ees
  };

  const onInput = (): void => {
    formService.validate(formStore);

    if (!$formStore.fields.amount.error) {
      receipt.price = eesPrice * BigInt($formStore.fields.amount.value);
      receipt.remaining = $inventoryStore.ees - BigInt(receipt.price);
    } else {
      receipt.price = 0n;
      receipt.remaining = $inventoryStore.ees;
    }
  };

  const onSetMax = (): void => {
    soundService.play("click");
    $formStore.fields.amount.value = `${$inventoryStore.ees / eesPrice}`;
    onInput();
  };

  const onSubmit = async (): Promise<void> => {
    soundService.play("click");

    $formStore.isLoading = true;

    if ($inventoryStore.approvals.ees < receipt.price + 1n) {
      await ethersService.transact(
        "ethericEssence",
        "approve",
        [ethersService.keys.somGame, receipt.price + 1n]
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
    Burn Etheric Essence to craft items.
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
        ["PER ITEM", eesPrice, "ees"],
        ["TOTAL", receipt.price, "ees"],
        ["BALANCE", receipt.balance, "ees"],
        ["REMAINING", receipt.remaining, "ees"],
      ]}"/>

      <svelte:fragment slot="submit">
        <FormSubmitComponent {formStore}>CRAFT</FormSubmitComponent>
      </svelte:fragment>
    </FormComponent>
  </svelte:fragment>
</ModalComponent>
