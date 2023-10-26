<script lang="ts">
  import {formatUnits, parseUnits} from "ethers";
  import {ethersService, formService} from "services";
  import {walletStore} from "stores";
  import {CurrencyComponent, FormFieldComponent, ModalComponent, FormLoadingComponent} from "ui";

  const formStore = formService.create({
    ecrAmount: ["", "currency", $walletStore.ecr.balance],
    wtlosAmount: ["", "currency", $walletStore.wtlos.balance]
  });

  const receipt = {
    ecrLiquidity: $walletStore.liquidity.ecr,
    wtlosLiquidity: $walletStore.liquidity.wtlos,
    ecrRemaining: $walletStore.ecr.balance,
    wtlosRemaining: $walletStore.wtlos.balance
  };

  const onInput = (): void => {
    formService.validate(formStore);

    const {ecrAmount, wtlosAmount} = $formStore.fields;

    if (!$formStore.isDisabled) {
      receipt.ecrRemaining = $walletStore.ecr.balance - parseUnits(ecrAmount.value);
      receipt.wtlosRemaining = $walletStore.wtlos.balance - parseUnits(wtlosAmount.value);
    }
  };

  const onSetMaxEcr = (): void => {
    $formStore.fields.ecrAmount.value = formatUnits($walletStore.ecr.balance);
    onEcrInput();
    onInput();
  };

  const onSetMaxWtlos = (): void => {
    $formStore.fields.wtlosAmount.value = formatUnits($walletStore.wtlos.balance);
    onWtlosInput();
    onInput();
  };

  const onEcrInput = (): void => {
    $formStore.fields.wtlosAmount.value = formatUnits(
      ((receipt.wtlosLiquidity * 1000000000000000000n) / receipt.ecrLiquidity * parseUnits($formStore.fields.ecrAmount.value)) / 1000000000000000000n
    );
  };

  const onWtlosInput = (): void => {
    $formStore.fields.ecrAmount.value = formatUnits(
      ((receipt.ecrLiquidity * 1000000000000000000n) / receipt.wtlosLiquidity * parseUnits($formStore.fields.wtlosAmount.value)) / 1000000000000000000n
    );
  };

  const onSubmit = async (): Promise<void> => {
    $formStore.isLoading = true;

    const isConfirmed = await ethersService.transact("somGame", "addLiquidity", []);

    if (isConfirmed) {
      await ethersService.reloadUser();
      onInput();
    }

    $formStore.isLoading = false;
  };
</script>

<ModalComponent>
  <div class="modal">
    <div class="modal__title">Add liquidity</div>
    <div class="modal__info">
      Provide liquidity for ECR and WTLOS and accumulate swap fees.
    </div>

    <form id="add" on:submit|preventDefault="{onSubmit}">
      <FormFieldComponent
        label="Amount"
        icon="ecr"
        error="{$formStore.fields.ecrAmount.error}"
        action="{["MAX", onSetMaxEcr]}"
        bind:value="{$formStore.fields.ecrAmount.value}"
        on:input="{() => {onEcrInput(); onInput();}}"/>

      <FormFieldComponent
        label="Amount"
        icon="wtlos"
        error="{$formStore.fields.wtlosAmount.error}"
        action="{["MAX", onSetMaxWtlos]}"
        bind:value="{$formStore.fields.wtlosAmount.value}"
        on:input="{() => {onWtlosInput(); onInput();}}"/>
    </form>

    <div class="modal__table">
      <table>
        <tr>
          <td>ECR Balance</td>
          <td><CurrencyComponent name="ecr" number="{$walletStore.ecr.balance}"/></td>
        </tr>
        <tr>
          <td>ECR Remaining</td>
          <td><CurrencyComponent name="ecr" number="{receipt.ecrRemaining}"/></td>
        </tr>
        <br/>
        <tr>
          <td>WTLOS Balance</td>
          <td><CurrencyComponent name="wtlos" number="{$walletStore.wtlos.balance}"/></td>
        </tr>
        <tr>
          <td>WTLOS Remaining</td>
          <td><CurrencyComponent name="wtlos" number="{receipt.wtlosRemaining}"/></td>
        </tr>
      </table>
    </div>

    <FormLoadingComponent form="add" {formStore}/>
  </div>
</ModalComponent>
