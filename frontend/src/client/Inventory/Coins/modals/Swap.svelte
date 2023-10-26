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
  };

  const reserveIn = $walletStore.liquidity.ecr;
  const reserveOut = $walletStore.liquidity.wtlos;
  const PRICE_X = reserveOut * 1000000000000000000n / reserveIn;
  const PRICE_Y = reserveIn * 1000000000000000000n / reserveOut;

  const onInputIn = (): void => {
    formService.validate(formStore);

    const afterFee = parseUnits($formStore.fields.ecrAmount.value || "0") * 99n / 100n;
    const amountOut = (reserveOut * afterFee) / (reserveIn + afterFee);

    $formStore.fields.wtlosAmount.value = formatUnits(amountOut);
  };

  const onInputOut = (): void => {
    formService.validate(formStore);

    const outValue = parseUnits($formStore.fields.wtlosAmount.value);
    const afterFee = (outValue * reserveIn) / (reserveOut - outValue);
    const inValue = afterFee * 100n / 99n;

    $formStore.fields.ecrAmount.value = formatUnits(inValue);
  };

  const onSetMaxIn = (): void => {
    $formStore.fields.ecrAmount.value = formatUnits($walletStore.ecr.balance);
    onInputIn();
  };

  const onSetMaxOut = (): void => {
    $formStore.fields.wtlosAmount.value = formatUnits($walletStore.wtlos.balance);
    onInputOut();
  };

  const onSubmit = async (): Promise<void> => {
    $formStore.isLoading = true;

    const isConfirmed = await ethersService.transact("somGame", "swap", [1n, $formStore.fields.ecrAmount.value]);

    if (isConfirmed) {
      await ethersService.reloadUser();
      // onValidateInput();
    }

    $formStore.isLoading = false;
  };
</script>

<style>
  .replace {
    text-align: center;
  }
</style>

<ModalComponent>
  <div class="modal">
    <div class="modal__title">Swap</div>
    <div class="modal__info">
      Swap between Etheric Telos and Etheric Crystals.
    </div>

    <form id="swap" on:submit|preventDefault="{onSubmit}">
      <FormFieldComponent
        label="Amount in"
        icon="ecr"
        error={$formStore.fields.ecrAmount.error}
        action={["MAX", onSetMaxIn]}
        bind:value={$formStore.fields.ecrAmount.value}
        on:input={onInputIn}/>

      <div class=replace>
        <i class="fa-solid fa-right-left fa-rotate-90"></i>
      </div>

      <FormFieldComponent
        label="Amount out"
        icon="wtlos"
        error={""}
        action={["MAX", onSetMaxOut]}
        bind:value={$formStore.fields.wtlosAmount.value}
        on:input={onInputOut}/>
    </form>

    <div class="modal__table">
      <table>
        <tr>
          <td>ECR Supply</td>
          <td><CurrencyComponent name=ecr number={receipt.ecrLiquidity}/></td>
        </tr>
        <tr>
          <td>WTLOS Supply</td>
          <td><CurrencyComponent name=wtlos number={receipt.wtlosLiquidity}/></td>
        </tr>
        <br/>
        <tr>
          <td>ECR Price</td>
          <td>
            <CurrencyComponent name=wtlos number={PRICE_X}/>
          </td>
        </tr>
        <tr>
          <td>WTLOS Price</td>
          <td>
            <CurrencyComponent name=ecr number={PRICE_Y}/>
          </td>
        </tr>
      </table>
    </div>

    <FormLoadingComponent form="swap" {formStore}/>
  </div>
</ModalComponent>
