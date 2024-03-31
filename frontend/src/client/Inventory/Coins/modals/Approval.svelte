<script lang="ts">
  import {formatUnits, parseUnits} from "ethers";
  import {contractAddress} from "@som/shared/data";
  import {ethersService, formService, soundService} from "services";
  import {modalStore, inventoryStore} from "stores";

  import {
    InputComponent,
    ModalComponent,
    FormSubmitComponent,
    FormComponent,
    TableComponent
  } from "ui";

  const {name, ticker}: {name: string, ticker: "ecr" | "enrg"} = $modalStore.data;
  const {allowance, totalSupply} = $inventoryStore[ticker];

  const formStore = formService.create({
    amount: ["", "approval", allowance]
  });

  const receipt = {allowance};

  const onInput = (): void => {
    formService.validate(formStore);
  };

  const onSetMax = (): void => {
    soundService.play("click");
    $formStore.fields.amount.value = formatUnits(totalSupply);
    onInput();
  };

  const onSubmit = async (): Promise<void> => {
    soundService.play("click");

    $formStore.isLoading = true;

    const isConfirmed = await ethersService.transact(
      ticker === "ecr" ? "ethericCrystals" : "ethericEnergy",
      "approve",
      [contractAddress.game, parseUnits($formStore.fields.amount.value)]
    );

    if (!isConfirmed) {
      $formStore.isLoading = false;
      return;
    }

    await ethersService.reloadUser();

    receipt.allowance = $inventoryStore[ticker].allowance;

    onInput();

    $formStore.isLoading = false;
  };
</script>

<ModalComponent>

  <svelte:fragment slot="title">Approve {name}</svelte:fragment>

  <svelte:fragment slot="info">
    Control how much the game contract can spend tokens on your behalf. Set to
    0 to revoke approval.
  </svelte:fragment>

  <FormComponent on:submit="{onSubmit}">

    <InputComponent
      label="Amount"
      icon="{ticker}"
      error="{$formStore.fields.amount.error}"
      action="{["MAX", onSetMax]}"
      bind:value="{$formStore.fields.amount.value}"
      on:input="{onInput}"/>

    <TableComponent items="{[
      ["Allowance", receipt.allowance, ticker]
    ]}"/>

    <svelte:fragment slot="submit">
      <FormSubmitComponent {formStore}>ALLOW</FormSubmitComponent>
    </svelte:fragment>

  </FormComponent>
</ModalComponent>
