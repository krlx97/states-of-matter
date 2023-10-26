<script lang="ts">
  import {formatUnits, parseUnits} from "ethers";
  import {ethersService, formService} from "services";
  import {walletStore} from "stores";
  import {CurrencyComponent, FormFieldComponent, ModalComponent, FormLoadingComponent} from "ui";

  const formStore = formService.create({
    amount: ["", "currency", $walletStore.lpecr.balance]
  });

  const receipt = {
    balance: $walletStore.lpecr.balance,
    remaining: $walletStore.lpecr.balance
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

    const isConfirmed = await ethersService.transact(
      "somGame",
      "removeLiquidity",
      [parseUnits($formStore.fields.amount.value)]
    );

    if (isConfirmed) {
      await ethersService.reloadUser();
      onInput();
    }

    $formStore.isLoading = false;
  };
</script>

<ModalComponent>
  <div class="modal">
    <div class="modal__title">Remove liquidity</div>
    <div class="modal__info">
      Remove liquidity by redeeming your liquidity provided tokens.
    </div>

    <form id="remove" on:submit|preventDefault="{onSubmit}">
      <FormFieldComponent
        label="Amount"
        icon="lpecr"
        error="{$formStore.fields.amount.error}"
        action="{["MAX", onSetMax]}"
        bind:value="{$formStore.fields.amount.value}"
        on:input="{onInput}"/>
    </form>

    <div class="modal__table">
      <table>
        <tr>
          <td>BALANCE</td>
          <td><CurrencyComponent name="lpecr" number="{receipt.balance}"/></td>
        </tr>
        <tr>
          <td>REMAINING</td>
          <td>
            <CurrencyComponent name="lpecr" number="{receipt.remaining}"/>
          </td>
        </tr>
      </table>
    </div>

    <FormLoadingComponent form="remove" {formStore}/>
  </div>
</ModalComponent>
