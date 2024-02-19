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
  const name = id === 1n ? "Etheric Crystals" : "Etheric Energy";
  const icon = id === 1n ? "ecr" : "enrg";
  let balance = id === 1n ? $inventoryStore.ecr : $inventoryStore.enrg;

  const formStore = formService.create({
    name: ["", "name"],
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

    socketService.socket.emit("getAddress", {name: $formStore.fields.name.value});
  };

  onMount((): void => {
    socketService.socket.on("getAddress", async (params: any): Promise<void> => {
      $formStore.isLoading = true;

      const isConfirmed = await ethersService.transact(
        id === 1n ? "ethericCrystals" : "ethericEnergy",
        "transfer",
        [params.address, parseUnits($formStore.fields.amount.value)]
      );

      if (isConfirmed) {
        await ethersService.reloadUser();

        balance = id === 1n ? $inventoryStore.ecr : $inventoryStore.enrg;
        receipt.balance = balance;

        onInput();
      }

      $formStore.isLoading = false;
    });
  });

  onDestroy((): void => {
    socketService.socket.off("getAddress");
  });
</script>

<ModalComponent>

  <svelte:fragment slot="title">Transfer</svelte:fragment>

  <svelte:fragment slot="info">
    Transfer {name} to another player.
  </svelte:fragment>

  <FormComponent on:submit="{onSubmit}">

    <InputComponent
      label="Name"
      error="{$formStore.fields.name.error}"
      bind:value="{$formStore.fields.name.value}"
      on:input="{onInput}"/>

    <InputComponent
      label="Amount"
      icon="{icon}"
      error="{$formStore.fields.amount.error}"
      action="{["MAX", onSetMax]}"
      bind:value="{$formStore.fields.amount.value}"
      on:input="{onInput}"/>

    <TableComponent items="{[
      ["Balance", receipt.balance, icon],
      ["Remaining", receipt.remaining, icon]
    ]}"/>

    <svelte:fragment slot="submit">
      <FormSubmitComponent {formStore}>TRANSFER</FormSubmitComponent>
    </svelte:fragment>

  </FormComponent>
</ModalComponent>
