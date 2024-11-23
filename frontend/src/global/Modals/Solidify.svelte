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

  const {balance, allowance} = $inventoryStore.enrg;

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
        "ethericEnergy",
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
      "solidify",
      [amount]
    );

    if (!isConfirmed) {
      $formStore.isLoading = false;
      return;
    }

    await ethersService.reloadUser();

    receipt.balance = $inventoryStore.enrg.balance;

    onInput();

    $formStore.isLoading = false;
  };
</script>

<ModalComponent>
  <svelte:fragment slot="title">Solidify</svelte:fragment>

  <svelte:fragment slot="info">
    Solidify your Etheric Energy and convert it back to Etheric Crystals.
  </svelte:fragment>

  <FormComponent on:submit="{onSubmit}">

    <InputComponent
      label="Amount"
      icon="enrg"
      error="{$formStore.fields.amount.error}"
      action="{["MAX", onSetMax]}"
      bind:value="{$formStore.fields.amount.value}"
      on:input="{onInput}"/>

    <TableComponent items="{[
      ["Balance", receipt.balance, "enrg"],
      ["Remaining", receipt.remaining, "enrg"]
    ]}"/>

    <svelte:fragment slot="submit">
      <FormSubmitComponent {formStore}>SOLIDIFY</FormSubmitComponent>
    </svelte:fragment>

  </FormComponent>
</ModalComponent>
