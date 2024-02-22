<script lang="ts">
  import {ethersService, formService, soundService} from "services";
  import {modalStore, inventoryStore, playerStore} from "stores";
  import {items} from "@som/shared/data";
  import { CurrencyComponent, InputComponent, FormSubmitComponent, FormComponent, ModalComponent, TableComponent} from "ui";
    import { onMount } from "svelte";

  const {id} = $modalStore.data;
  const item = items.find((item) => item.id === id);
  const itemWallet = $inventoryStore.items.find((item) => item.id === BigInt(id));
  let eesPrice = 0n;
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
      eesPrice = 20n * 10n ** 18n;
    } else {
      if (item.rarity === 1) {
        eesPrice = 20n * 10n ** 18n;
      }
      if (item.rarity === 2) {
        eesPrice = 80n * 10n ** 18n;
      }
      if (item.rarity === 3) {
        eesPrice = 320n * 10n ** 18n;
      }
      if (item.rarity === 4) {
        eesPrice = 1280n * 10n ** 18n;
      }
      if (item.rarity === 5) {
        eesPrice = 5120n * 10n ** 18n;
      }
    }
  });

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
    soundService.play("click");
    $formStore.fields.amount.value = `${receipt.owned}`;
    onInput();
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
  <svelte:fragment slot="title">Disenchant
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
    Disenchant items to obtain Etheric Essence.
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
        ["Remaining", receipt.remaining]
      ]}"/>

      <TableComponent items="{[
        ["Item reward", eesPrice, "ees"],
        ["Total reward", BigInt(receipt.totalReward), "ees"],
        ["Balance", BigInt($inventoryStore.ees), "ees"],
        ["New balance", BigInt(receipt.newBalance), "ees"]
      ]}"/>

      <svelte:fragment slot="submit">
        <FormSubmitComponent {formStore}>DISENCHANT</FormSubmitComponent>
      </svelte:fragment>

    </FormComponent>
  </svelte:fragment>

</ModalComponent>
