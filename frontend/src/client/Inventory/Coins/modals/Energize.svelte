<script lang="ts">
  import {formatUnits, parseUnits} from "ethers";
  import {contractAddress} from "@som/shared/data";
  import {ethersService, formService, soundService} from "services";
  import {inventoryStore} from "stores";

  import {
    FormComponent,
    FormSubmitComponent,
    InputComponent,
    ModalComponent,
    TableComponent
  } from "ui";

  const {balance, allowance} = $inventoryStore.ecr;

  const formStore = formService.create({
    amount: ["", "currency", balance]
  });

  const receipt = {
    balance,
    remaining: balance
  };

  const onInput = (): void => {
    formService.validate(formStore);

    const {value, error} = $formStore.fields.amount;

    if (!error) {
      receipt.remaining = receipt.balance - parseUnits(value);
    } else {
      receipt.remaining = receipt.balance;
    }
  };

  const onSetMax = (): void => {
    soundService.play("click");
    $formStore.fields.amount.value = formatUnits(receipt.balance);
    onInput();
  };

  const onSubmit = async (): Promise<void> => {
    soundService.play("click");

    $formStore.isLoading = true;

    const amount = parseUnits($formStore.fields.amount.value);

    if (allowance < amount) {
      const isConfirmed = await ethersService.transact(
        "ethericCrystals",
        "approve",
        [contractAddress.game, amount]
      );

      if (!isConfirmed) {
        $formStore.isLoading = false;
        return;
      }
    }

    const isConfirmed = await ethersService.transact(
      "game",
      "energize",
      [amount]
    );

    if (!isConfirmed) {
      $formStore.isLoading = false;
      return;
    }

    await ethersService.reloadUser();

    receipt.balance = $inventoryStore.ecr.balance;

    onInput();

    $formStore.isLoading = false;
  };
</script>

<ModalComponent>
  <svelte:fragment slot="title">Energize</svelte:fragment>

  <svelte:fragment slot="info">
    Energize your Etheric Crystals to convert them to Etheric Energy. The longer
    you hold Etheric Energy, the more Etheric Crystals you acumulate.
  </svelte:fragment>

  <FormComponent on:submit="{onSubmit}">

    <InputComponent
      label="Amount"
      icon="ecr"
      error="{$formStore.fields.amount.error}"
      action="{["MAX", onSetMax]}"
      bind:value="{$formStore.fields.amount.value}"
      on:input="{onInput}"/>

    <TableComponent items="{[
      ["Balance", receipt.balance, "ecr"],
      ["Remaining", receipt.remaining, "ecr"]
    ]}"/>

    <svelte:fragment slot="submit">
      <FormSubmitComponent {formStore}>ENERGIZE</FormSubmitComponent>
    </svelte:fragment>

  </FormComponent>
</ModalComponent>
