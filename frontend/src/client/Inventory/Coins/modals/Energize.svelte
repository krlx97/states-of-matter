<script lang="ts">
  import {formatUnits, parseUnits} from "ethers";
  import {ethersService, formService, soundService} from "services";
  import {modalStore, inventoryStore} from "stores";
  import {InputComponent, ModalComponent, FormSubmitComponent, FormComponent, TableComponent} from "ui";

  let balance = $inventoryStore.ecr;

  const formStore = formService.create({
    amount: ["", "currency", balance]
  });

  const receipt = {
    balance: balance,
    remaining: balance
  };

  const onInput = (): void => {
    formService.validate(formStore);

    const {value, error} = $formStore.fields.amount;

    if (!error) {
      receipt.remaining = balance - parseUnits(value);
    }
  };

  const onSetMax = (): void => {
    $formStore.fields.amount.value = formatUnits(balance);
    onInput();
    soundService.play("click");
  };

  const onSubmit = async (): Promise<void> => {
    $formStore.isLoading = true;
    soundService.play("click");

    const {somGame} = ethersService.keys;

    if ($inventoryStore.approvals.ecr < parseUnits($formStore.fields.amount.value)) {
      const isConfirmed = await ethersService.transact(
        "ethericCrystals",
        "approve",
        [somGame, parseUnits($formStore.fields.amount.value) - $inventoryStore.approvals.ecr]
      );
    }

    const isConfirmed = await ethersService.transact(
      "somGame",
      "energize",
      [parseUnits($formStore.fields.amount.value)]
    );

    if (isConfirmed) {
      await ethersService.reloadUser();
      balance = $inventoryStore.ecr;
      receipt.balance = balance;
      onInput();
    }

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
      ["BALANCE", receipt.balance, "ecr"],
      ["REMAINING", receipt.remaining, "ecr"]
    ]}"/>

    <svelte:fragment slot="submit">
      <FormSubmitComponent {formStore}>ENERGIZE</FormSubmitComponent>
    </svelte:fragment>

  </FormComponent>
</ModalComponent>
