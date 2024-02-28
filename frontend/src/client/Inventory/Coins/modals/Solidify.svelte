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
    soundService.play("click");
    $formStore.fields.amount.value = formatUnits(balance);
    onInput();
  };

  const onSubmit = async (): Promise<void> => {
    soundService.play("click");

    $formStore.isLoading = true;

    const amount = parseUnits($formStore.fields.amount.value);

    if ($inventoryStore.approvals.enrg < amount) {
      const isConfirmed = await ethersService.transact(
        "ethericEnergy",
        "approve",
        [ethersService.keys.somGame, amount]
      );

      if (!isConfirmed) {
        $formStore.isLoading = false;
        return;
      }
    }

    const isConfirmed = await ethersService.transact(
      "somGame",
      "solidify",
      [amount]
    );

    if (!isConfirmed) {
      $formStore.isLoading = false;
      return;
    }

    await ethersService.reloadUser();

    balance = $inventoryStore.enrg;
    receipt.staked = balance;

    onInput();

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
      ["Balance", receipt.staked, "enrg"],
      ["Remaining balance", receipt.remaining, "enrg"]
    ]}"/>

    <svelte:fragment slot="submit">
      <FormSubmitComponent {formStore}>SOLIDIFY</FormSubmitComponent>
    </svelte:fragment>

  </FormComponent>
</ModalComponent>
