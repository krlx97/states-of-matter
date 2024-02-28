<script lang="ts">
  import {formatUnits, parseUnits} from "ethers";
  import {ethersService, formService, socketService, soundService} from "services";
  import {modalStore, playerStore, inventoryStore} from "stores";

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

  let approval = id === 1n ? $inventoryStore.approvals.ecr : id === 2n ? $inventoryStore.approvals.ees : $inventoryStore.approvals.enrg;
  let totalSupply = id === 1n ? $inventoryStore.total.ecr : id === 2n ? $inventoryStore.total.ees : $inventoryStore.total.enrg

  const formStore = formService.create({
    amount: ["", "approval", approval]
  });

  const receipt = {approval};

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

    approval = id === 1n ? $inventoryStore.approvals.ecr : id === 2n ? $inventoryStore.approvals.ees : $inventoryStore.approvals.enrg;
    receipt.approval = approval;

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
      icon="{icon}"
      error="{$formStore.fields.amount.error}"
      action="{["MAX", onSetMax]}"
      bind:value="{$formStore.fields.amount.value}"
      on:input="{onInput}"/>

    <TableComponent items="{[
      ["Current approval", receipt.approval, icon]
    ]}"/>

    <svelte:fragment slot="submit">
      <FormSubmitComponent {formStore}>SET</FormSubmitComponent>
    </svelte:fragment>

  </FormComponent>
</ModalComponent>
