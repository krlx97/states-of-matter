<script lang="ts">
  import {BigNumber, ethers} from "ethers";
  import {ethersService, notificationService} from "services";
  import {walletStore} from "stores";
  import {unstakeAmountValidator} from "validators";
  import {CurrencyComponent, ModalComponent} from "ui";

  const {utils} = ethers;
  const errors = {
    amount: {
      hasValue: true,
      isValid: true,
      hasCorrectDecimals: true,
      isMinValue: true,
      isEnoughBalance: true
    }
  };

  let amount = "";
  let disabled = true;
  let isLoading = false;

  let unstake = BigNumber.from(0);
  let remaining = $walletStore.crystals.staked;

  const onValidateInput = (): void => {
    errors.amount = unstakeAmountValidator(amount);

    disabled =
      !errors.amount.hasValue ||
      !errors.amount.isValid ||
      !errors.amount.hasCorrectDecimals ||
      !errors.amount.isMinValue ||
      !errors.amount.isEnoughBalance;

    if (
      errors.amount.hasValue &&
      errors.amount.isValid &&
      errors.amount.hasCorrectDecimals
    ) {
      unstake = utils.parseUnits(amount);
      remaining = $walletStore.crystals.staked.sub(unstake);
    } else {
      unstake = BigNumber.from(0);
      remaining = $walletStore.crystals.staked;
    }
  };

  const onSetMax = (): void => {
    amount = ethers.utils.formatUnits($walletStore.crystals.staked).split(".")[0];
    onValidateInput();
  };

  const onUnstake = async (): Promise<void> => {
    isLoading = true;

    const isConfirmed = await ethersService.transact("game", "unstake", [unstake]);
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
    <div class="modal__title">Unstake</div>
    <div class="modal__info">
      Unstake Etheric Crystals and claim them after 14 days. You will not
      receive any rewards during the vesting period. If you decide to unstake
      more, the timer will reset back to 14 days.
    </div>

    <form id="unstakeForm" on:submit|preventDefault={onUnstake}>

      <label>
        <div class="label__title">Amount</div>
        <input
          placeholder="Amount"
          bind:value={amount}
          on:input={onValidateInput}
        >
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
          <div class="label__error">Insufficient staked.</div>
        {/if}
      </label>

    </form>

    <div class="modal__table">
      <table>
        <tr>
          <td>UNSTAKE</td>
          <td><CurrencyComponent name="crystals" number={unstake}/></td>
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
        <button form="unstakeForm" {disabled}>UNSTAKE</button>
      {/if}
    </div>
  </div>
</ModalComponent>
