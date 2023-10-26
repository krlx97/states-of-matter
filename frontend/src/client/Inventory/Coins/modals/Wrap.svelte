<script lang="ts">
  import {formatUnits, parseUnits} from "ethers";
  import {ethersService, formService} from "services";
  import {CurrencyComponent, FormFieldComponent, ModalComponent, FormLoadingComponent} from "ui";

  const formStore = formService.create({
    amount: ["", "currency", 100n * 10n ** 18n]
  });

  const receipt = {
    balance: 100n * 10n ** 18n,
    remaining: 100n * 10n ** 18n
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

    if (isConfirmed) {
      await ethersService.reloadUser();
      onInput();
    }

    $formStore.isLoading = false;
  };
</script>

<ModalComponent>
  <div class="modal">
    <div class="modal__title">Wrap TLOS</div>
    <div class="modal__info">
      Wrap your native TLOS token into States of Matter ERC1155 WTLOS token 1:1.
    </div>

    <form id="wrap" on:submit|preventDefault="{onSubmit}">
      <FormFieldComponent
        label="Amount"
        icon="tlos"
        error="{$formStore.fields.amount.error}"
        action="{["MAX", onSetMax]}"
        bind:value="{$formStore.fields.amount.value}"
        on:input="{onInput}"/>
    </form>

    <div class="modal__table">
      <table>
        <tr>
          <td>BALANCE</td>
          <td><CurrencyComponent name="tlos" number="{receipt.balance}"/></td>
        </tr>
        <tr>
          <td>REMAINING</td>
          <td><CurrencyComponent name="tlos" number="{receipt.remaining}"/></td>
        </tr>
      </table>
    </div>

    <FormLoadingComponent form="wrap" {formStore}/>
  </div>
</ModalComponent>
