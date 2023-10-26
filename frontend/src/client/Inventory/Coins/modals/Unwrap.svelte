<script lang="ts">
  import {formatUnits, parseUnits} from "ethers";
  import {ethersService, formService} from "services";
  import {walletStore} from "stores";
  import {CurrencyComponent, FormFieldComponent, ModalComponent, FormLoadingComponent} from "ui";

  const formStore = formService.create({
    amount: ["", "currency", $walletStore.wtlos.balance]
  });

  const receipt = {
    balance: $walletStore.wtlos.balance,
    remaining: $walletStore.wtlos.balance
  };

  const onInput = (): void => {
    formService.validate(formStore);

    const {value, error} = $formStore.fields.amount;

    if (!error) {
      receipt.remaining = receipt.balance - parseUnits(value);
    }
  };

  const onSetMax = (): void => {
    $formStore.fields.amount.value = formatUnits(receipt.balance);
    onInput();
  };

  const onSubmit = async (): Promise<void> => {
    $formStore.isLoading = true;

    const isConfirmed = await ethersService.transact("somGame", "wrap", []);

    if (!isConfirmed) {
      await ethersService.reloadUser();
      onInput();
    }

    $formStore.isLoading = false;
  };
</script>

<ModalComponent>
  <div class="modal">
    <div class="modal__title">Unwrap TLOS</div>
    <div class="modal__info">
      Unwrap your States of Matter ERC1155 WTLOS token to receive native TLOS 1:1.
    </div>

    <form id="unwrap" on:submit|preventDefault="{onSubmit}">
      <FormFieldComponent
        label="Amount"
        icon="wtlos"
        error="{$formStore.fields.amount.error}"
        action="{["MAX", onSetMax]}"
        bind:value="{$formStore.fields.amount.value}"
        on:input="{onInput}"/>
    </form>

    <div class="modal__table">
      <table>
        <tr>
          <td>BALANCE</td>
          <td><CurrencyComponent name="wtlos" number="{receipt.balance}"/></td>
        </tr>
        <tr>
          <td>REMAINING</td>
          <td><CurrencyComponent name="wtlos" number="{receipt.remaining}"/></td>
        </tr>
      </table>
    </div>

    <FormLoadingComponent form="unwrap" {formStore}/>
  </div>
</ModalComponent>
