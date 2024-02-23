<script lang="ts">
  import {formatUnits, parseUnits} from "ethers";
  import {ethersService, formService, socketService, soundService} from "services";
  import {modalStore, playerStore, inventoryStore} from "stores";
    import { onDestroy, onMount } from "svelte";

  import {
    InputComponent,
    ModalComponent,
    FormSubmitComponent,
    FormComponent,
    TableComponent
  } from "ui";

  const {id} = $modalStore.data;
  const name = id === 1n ? "Etheric Crystals" : id === 2n ? "Etheric Essence" : "Etheric Energy";
  const icon = id === 1n ? "ecr" : id === 2n ? "ees" : "enrg";
  let balance = id === 1n ? $inventoryStore.approvals.ecr : id === 2n ? $inventoryStore.approvals.ees : $inventoryStore.approvals.enrg;

  const formStore = formService.create({
    amount: ["", "approval", balance]
  });

  const receipt = {
    balance,
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
    $formStore.fields.amount.value = formatUnits(id === 1n ? $inventoryStore.total.ecr : id === 2n ? $inventoryStore.total.ees : $inventoryStore.total.enrg);
    onInput();
  };

  const onSubmit = async (): Promise<void> => {
    soundService.play("click");

    $formStore.isLoading = true;

    const amount = parseUnits($formStore.fields.amount.value);

    const isConfirmed = await ethersService.transact(
      id === 1n ? "ethericCrystals" : id === 2n ? "ethericEssence" : "ethericEnergy",
      "approve",
      [ethersService.keys.somGame, amount]
    );

    if (!isConfirmed) {
      $formStore.isLoading = false;
      return;
    }

    await ethersService.reloadUser();

    balance = id === 1n ? $inventoryStore.approvals.ecr : id === 2n ? $inventoryStore.approvals.ees : $inventoryStore.approvals.enrg;
    receipt.balance = balance;

    onInput();

    $formStore.isLoading = false;
  };

  onMount((): void => {
    
  });

  onDestroy((): void => {
  });
</script>

<ModalComponent>

  <svelte:fragment slot="title">{name} approval</svelte:fragment>

  <svelte:fragment slot="info">
    Control how much the game contract can spend tokens on your behalf
  </svelte:fragment>

  <FormComponent on:submit="{onSubmit}">

    <InputComponent
      label="Amount"
      icon="{icon}"
      error="{$formStore.fields.amount.error}"
      action="{["MAX", onSetMax]}"
      bind:value="{$formStore.fields.amount.value}"
      on:input="{onInput}"/>

    <TableComponent items="{[
      ["Approval", receipt.balance, icon],
      ["Remaining approval", receipt.remaining, icon]
    ]}"/>

    <svelte:fragment slot="submit">
      <FormSubmitComponent {formStore}>SET</FormSubmitComponent>
    </svelte:fragment>

  </FormComponent>
</ModalComponent>
