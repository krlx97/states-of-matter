<script lang="ts">
  import {formatUnits, parseUnits} from "ethers";
  import {ethersService, formService} from "services";
  import {accountStore, modalStore, walletStore} from "stores";
  import {CurrencyComponent, FormFieldComponent, ModalComponent, FormLoadingComponent} from "ui";

  const {id} = $modalStore.data;
  const name = id === 1n ? "Etheric Crystals" : id === 2n ? "Wrapped Telos" : "Liquidity Provided Etheric Crystals";
  const icon = id === 1n ? "ecr" : id === 2n ? "wtlos" : "lpecr";
  const balance = id === 1n ? $walletStore.ecr.balance : id === 2n ? $walletStore.wtlos.balance : $walletStore.lpecr.balance;

  const formStore = formService.create({
    address: ["", "address"],
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
  };

  const onSubmit = async (): Promise<void> => {
    $formStore.isLoading = true;

    const isConfirmed = await ethersService.transact(
      "somTokens",
      "safeTransferFrom",
      [$accountStore.publicKey, $formStore.fields.address.value, id, parseUnits($formStore.fields.amount.value), ""]
    );

    if (!isConfirmed) {
      await ethersService.reloadUser();
      onInput();
    }

    $formStore.isLoading = false;
  };
</script>

<ModalComponent>
  <div class="modal">
    <div class="modal__title">Transfer</div>
    <div class="modal__info">Transfer {name} to another Telos EVM address.</div>

    <form id="transfer" on:submit|preventDefault="{onSubmit}">
      <FormFieldComponent
        label="Address"
        error="{$formStore.fields.address.error}"
        bind:value="{$formStore.fields.address.value}"
        on:input="{onInput}"/>

      <FormFieldComponent
        label="Amount"
        icon="{icon}"
        error="{$formStore.fields.amount.error}"
        action="{["MAX", onSetMax]}"
        bind:value="{$formStore.fields.amount.value}"
        on:input="{onInput}"/>
    </form>

    <div class="modal__table">
      <table>
        <tr>
          <td>BALANCE</td>
          <td><CurrencyComponent name="{icon}" number="{receipt.balance}"/></td>
        </tr>
        <tr>
          <td>REMAINING</td>
          <td><CurrencyComponent name="{icon}" number="{receipt.remaining}"/></td>
        </tr>
      </table>
    </div>

    <FormLoadingComponent form="transfer" {formStore}/>
  </div>
</ModalComponent>
