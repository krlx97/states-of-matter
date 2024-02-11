<script lang="ts">
  import {ethersService, formService, soundService} from "services";
  import {modalStore, inventoryStore} from "stores";
  import {items} from "@som/shared/data";
  import { CurrencyComponent, InputComponent, FormSubmitComponent, FormComponent, ModalComponent, TableComponent} from "ui";
    import { onMount } from "svelte";

  const {id} = $modalStore.data;
  const item = items.find((item) => item.id === id);
  const itemWallet = $inventoryStore.items.find((item) => item.id === id);
  let eesPrice = 0n;

  console.log(itemWallet);
  const formStore = formService.create({
    amount: ["", "item", itemWallet.balance],
  });

  const receipt = {
    totalReward: 0n,
    owned: itemWallet.balance,
    remaining: itemWallet.balance,
    newBalance: $inventoryStore.ees
  };

  onMount((): void => {
    if (!item) {
      eesPrice = 10n * 10n ** 18n;
    } else {
      if (item.rarity === 1) {
        eesPrice = 10n * 10n ** 18n;
      }
      if (item.rarity === 2) {
        eesPrice = 40n * 10n ** 18n;
      }
      if (item.rarity === 3) {
        eesPrice = 160n * 10n ** 18n;
      }
      if (item.rarity === 4) {
        eesPrice = 640n * 10n ** 18n;
      }
      if (item.rarity === 5) {
        eesPrice = 2560n * 10n ** 18n;
      }
    }
  });

  const getPrice = (): any => {
    // const item = items.find((item) => item.id === id);
    // if (item.type !== 2) { return 0; }
    return 100;
  }

  const onInput = (): void => {
    formService.validate(formStore);

    if (!$formStore.fields.amount.error) {
      receipt.totalReward = eesPrice * BigInt($formStore.fields.amount.value);
      receipt.remaining = receipt.owned - BigInt($formStore.fields.amount.value);
      receipt.newBalance = $inventoryStore.ees + BigInt(receipt.totalReward);
    } else {
      receipt.totalReward = 0n;
      receipt.remaining = receipt.owned;
      receipt.newBalance = $inventoryStore.ees;
    }
  };

  const onSetMax = (): void => {
    $formStore.fields.amount.value = `${receipt.owned}`;
    onInput();
    soundService.play("click");
  };

  const onDisenchant = async (): Promise<void> => {
    soundService.play("click");

    $formStore.isLoading = true;
    const {somGame} = ethersService.keys;

    if (!$inventoryStore.approvals.items) {
      await ethersService.transact("somTokens", "setApprovalForAll", [somGame, true]);
    }

    const isConfirmed = await ethersService.transact(
      "somGame",
      "disenchantItem",
      [id, $formStore.fields.amount.value]
    );

    if (!isConfirmed) {
      await ethersService.reloadUser();
      onInput();
    }

    $formStore.isLoading = false;
  };
</script>

<ModalComponent>
  <svelte:fragment slot="title">Disenchant {item?.name || ""}</svelte:fragment>

  <svelte:fragment slot="info">
    Disenchant items to obtain etheric essence.
  </svelte:fragment>

  <svelte:fragment slot="content">
    <FormComponent on:submit="{onDisenchant}">
      <InputComponent
        label="Amount"
        error="{$formStore.fields.amount.error}"
        action="{["MAX", onSetMax]}"
        bind:value="{$formStore.fields.amount.value}"
        on:input="{onInput}"/>

      <TableComponent items="{[
        ["Balance", receipt.owned],
        ["Remaining", receipt.remaining],
        // ["EES per item", eesPrice, "ees"],
        // ["EES reward", BigInt(receipt.totalReward), "ees"],
        // ["EES balance", BigInt(receipt.newBalance), "ees"],
      ]}"/>
      <TableComponent items="{[
        // ["Item balance", receipt.owned],
        // ["Item remaining", receipt.remaining],
        // ["EES per item", eesPrice, "ees"],
        ["Reward per item", BigInt(receipt.totalReward), "ees"],
        ["New balance", BigInt(receipt.newBalance), "ees"],
      ]}"/>

      <svelte:fragment slot="submit">
        <FormSubmitComponent {formStore}>DISENCHANT</FormSubmitComponent>
      </svelte:fragment>
    </FormComponent>
  </svelte:fragment>

</ModalComponent>
