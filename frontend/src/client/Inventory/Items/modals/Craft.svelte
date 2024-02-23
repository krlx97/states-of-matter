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
  <svelte:fragment slot="title">
    Craft
    <span
      class:commona={item?.rarity === 0}
      class:uncommona={item?.rarity === 1}
      class:rarea={item?.rarity === 2}
      class:epica={item?.rarity === 3}
      class:legendarya={item?.rarity === 4}
      class:mythica={item?.rarity === 5}>
      {item?.name || ""}
    </span>
  </svelte:fragment>

  <svelte:fragment slot="info">
    Spend Etheric Essence to craft specified amount of items.
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
        ["Item price", eesPrice, "ees"],
        ["Total price", receipt.price, "ees"],
        ["Balance", receipt.balance, "ees"],
        ["Remaining balance", receipt.remaining, "ees"]
      ]}"/>

      <svelte:fragment slot="submit">
        <FormSubmitComponent {formStore}>CRAFT</FormSubmitComponent>
      </svelte:fragment>
    </FormComponent>
  </svelte:fragment>
</ModalComponent>
