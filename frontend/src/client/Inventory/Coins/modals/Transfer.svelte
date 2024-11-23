<script lang="ts">
  import {formatUnits, parseUnits} from "ethers";
  import {onDestroy, onMount} from "svelte";
  import {ethersService, formService, socketService, soundService} from "services";
  import {modalStore, inventoryStore} from "stores";

  import {
    InputComponent,
    ModalComponent,
    FormSubmitComponent,
    FormComponent,
    TableComponent
  } from "ui";

  const {name, ticker}: {name: string, ticker: "ecr" | "enrg"} = $modalStore.data;
  const {balance} = $inventoryStore[ticker];

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
      receipt.remaining = receipt.balance - parseUnits(value);
    } else {
      receipt.remaining = receipt.balance;
    }
  };

  const onSetMax = (): void => {
    soundService.play("click");
    $formStore.fields.amount.value = formatUnits(balance);
    onInput();
  };

  const onSubmit = async (): Promise<void> => {
    soundService.play("click");

    socketService.socket.emit("getAddress" as any, {
      name: $formStore.fields.name.value
    });
  };

  onMount((): void => {
    socketService.socket.on("getAddress" as any, async (params: any): Promise<void> => {
      $formStore.isLoading = true;

      const isConfirmed = await ethersService.transact(
        ticker === "ecr" ? "ethericCrystals" : "ethericEnergy",
        "transfer",
        [params.address, parseUnits($formStore.fields.amount.value)]
      );

      if (!isConfirmed) {
        $formStore.isLoading = false;
        return;
      }

      await ethersService.reloadUser();

      receipt.balance = $inventoryStore[ticker].balance;

      onInput();

      $formStore.isLoading = false;
    });
  });

  onDestroy((): void => {
    socketService.socket.off("getAddress" as any);
  });
</script>

<ModalComponent>

  <svelte:fragment slot="title">Transfer {name}</svelte:fragment>

  <svelte:fragment slot="info">
    Transfer tokens to another player.
  </svelte:fragment>

  <FormComponent on:submit="{onSubmit}">

    <InputComponent
      label="Name"
      error="{$formStore.fields.name.error}"
      bind:value="{$formStore.fields.name.value}"
      on:input="{onInput}"/>

    <InputComponent
      label="Amount"
      icon="{ticker}"
      error="{$formStore.fields.amount.error}"
      action="{["MAX", onSetMax]}"
      bind:value="{$formStore.fields.amount.value}"
      on:input="{onInput}"/>

    <TableComponent items="{[
      ["Balance", receipt.balance, ticker],
      ["Remaining", receipt.remaining, ticker]
    ]}"/>

    <svelte:fragment slot="submit">
      <FormSubmitComponent {formStore}>TRANSFER</FormSubmitComponent>
    </svelte:fragment>

  </FormComponent>
</ModalComponent>
