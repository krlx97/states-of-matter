<script lang="ts">
  import {formatUnits, parseUnits} from "ethers";
  import {ethersService, formService, soundService} from "services";
  import {inventoryStore} from "stores";
  import {InputComponent, ModalComponent, FormSubmitComponent, FormComponent, TableComponent} from "ui";

  let balance = $inventoryStore.enrg;

  const formStore = formService.create({
    amount: ["", "currency", balance]
  });

  const receipt = {
    staked: balance,
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
    soundService.play("click");
    const {somGame} = ethersService.keys;

    $formStore.isLoading = true;

    if ($inventoryStore.approvals.enrg < parseUnits($formStore.fields.amount.value)) {
      const isConfirmed = await ethersService.transact(
        "ethericEnergy",
        "approve",
        [somGame, parseUnits($formStore.fields.amount.value) - $inventoryStore.approvals.enrg]
      );
    }

    const isConfirmed = await ethersService.transact(
      "somGame",
      "solidify",
      [parseUnits($formStore.fields.amount.value)]
    );

    if (!isConfirmed) {
      await ethersService.reloadUser();
      balance = $inventoryStore.enrg;
      receipt.staked = balance;
      onInput();
    }

    $formStore.isLoading = false;
  };
</script>

<ModalComponent>
  <svelte:fragment slot="title">Solidify</svelte:fragment>

  <svelte:fragment slot="info">
    Solidify your Etheric Energy and convert it back to Etheric Crystals
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
      ["BALANCE", receipt.staked, "enrg"],
      ["REMAINING", receipt.remaining, "enrg"]
    ]}"/>

    <svelte:fragment slot="submit">
      <FormSubmitComponent {formStore}>SOLIDIFY</FormSubmitComponent>
    </svelte:fragment>

  </FormComponent>
</ModalComponent>
