<script lang="ts">
  import {BigNumber, ethers} from "ethers";
  import {ethersService, notificationService} from "services";
  import {walletStore} from "stores";
  import {addressValidator, crystalAmountValidator} from "validators";
  import {CurrencyComponent, ModalComponent} from "ui";

  const {utils} = ethers;
  const errors = {
    address: {
      hasValue: true,
      isValid: true,
      isntSelf: true
    },
    amount: {
      hasValue: true,
      isValid: true,
      hasCorrectDecimals: true,
      isMinValue: true,
      isEnoughBalance: true
    }
  };

  let address = "";
  let amount = "";
  let disabled = true;
  let isLoading = false;

  let transfer = BigNumber.from(0);
  let remaining = $walletStore.crystals.balance;

  const onValidateInput = (): void => {
    errors.address = addressValidator(address);
    errors.amount = crystalAmountValidator(amount);

    disabled =
      !errors.amount.hasValue ||
      !errors.amount.isValid ||
      !errors.amount.hasCorrectDecimals ||
      !errors.amount.isMinValue ||
      !errors.amount.isEnoughBalance ||
      !errors.address.hasValue ||
      !errors.address.isValid;

    if (
      errors.amount.hasValue &&
      errors.amount.isValid &&
      errors.amount.hasCorrectDecimals
    ) {
      transfer = utils.parseUnits(amount);
      remaining = $walletStore.crystals.balance.sub(transfer);
    } else {
      transfer = BigNumber.from(0);
      remaining = $walletStore.crystals.balance;
    }
  };

  const onSetMax = (): void => {
    amount = ethers.utils.formatUnits($walletStore.crystals.balance).split(".")[0];
    onValidateInput();
  };

  const onTransfer = async (): Promise<void> => {
    isLoading = true;

    const isConfirmed = await ethersService.transact("currency", "transfer", [address, utils.parseUnits(amount)]);
    if (!isConfirmed) {
      isLoading = false;
      return;
    }

    await ethersService.loadUser();
    onValidateInput();
    isLoading = false;
  };
</script>

<ModalComponent>
  <div class="modal">
    <div class="modal__title">Transfer</div>
    <div class="modal__info">
      Transfer Etheric Crystals to another Telos EVM address.
    </div>

    <form id="transferForm" on:submit|preventDefault={onTransfer}>

      <label>
        <div class="label__title">Address</div>
        <input
          placeholder="Address"
          bind:value={address}
          on:input={onValidateInput}
        />
        {#if !errors.address.hasValue}
          <div class="label__error">Mustn't be empty.</div>
        {:else if !errors.address.isValid}
          <div class="label__error">Invalid address format.</div>
        {:else if !errors.address.isntSelf}
          <div class="label__error">Can't transfer to self.</div>
        {/if}
      </label>

      <label>
        <div class="label__title">Amount</div>
        <input
          placeholder="Amount"
          bind:value={amount}
          on:input={onValidateInput}
        />
        <div class="label__suffix" on:click={onSetMax} on:keypress={onSetMax}>
          MAX
        </div>
        {#if !errors.amount.hasValue}
          <div class="label__error">Mustn't be empty.</div>
        {:else if !errors.amount.isValid}
          <div class="label__error">Invalid number format.</div>
        {:else if !errors.amount.hasCorrectDecimals}
          <div class="label__error">Up to 18 decimal places allowed.</div>
        {:else if !errors.amount.isMinValue}
          <div class="label__error">Must transfer positive amount.</div>
        {:else if !errors.amount.isEnoughBalance}
          <div class="label__error">Insufficient balance.</div>
        {/if}
      </label>

    </form>

    <div class="modal__table">
      <table>
        <tr>
          <td>TRANSFER</td>
          <td><CurrencyComponent name="crystals" number={transfer}/></td>
        </tr>
        <tr>
          <td>REMAINING</td>
          <td><CurrencyComponent name="crystals" number={remaining}/></td>
        </tr>
      </table>
    </div>

    <div class="modal__submit">
      {#if isLoading}
        <i class="fa-solid fa-circle-notch fa-2x fa-spin"></i>
      {:else}
        <button form="transferForm" {disabled}>TRANSFER</button>
      {/if}
    </div>
  </div>
</ModalComponent>
