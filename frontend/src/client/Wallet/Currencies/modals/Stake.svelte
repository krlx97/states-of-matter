<script lang="ts">
  import {BigNumber, ethers} from "ethers";
  import {ethersService} from "services";
  import {walletStore} from "stores";
  import {stakeAmountValidator} from "validators";
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

  let stake = BigNumber.from(0);
  let remaining = $walletStore.crystals.balance;

  const onValidateInput = (): void => {
    errors.amount = stakeAmountValidator(amount);

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
      stake = utils.parseUnits(amount);
      remaining = $walletStore.crystals.balance.sub(stake);
    } else {
      stake = BigNumber.from(0);
      remaining = $walletStore.crystals.balance;
    }
  };

  const onSetMax = (): void => {
    amount = ethers.utils.formatUnits($walletStore.crystals.balance).split(".")[0];
    onValidateInput();
  };

  const onStake = async (): Promise<void> => {
    isLoading = true;
    const {game} = ethersService.keys;

    if (!$walletStore.allowance.gte(stake)) {
      const isConfirmed = await ethersService.transact("currency", "increaseAllowance", [game, stake]);
      if (!isConfirmed) {
        isLoading = false;
        return;
      }
    }

    const isConfirmed = await ethersService.transact("game", "stake", [stake]);
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
    <div class="modal__title">Stake</div>
    <div class="modal__info">
      Stake Etheric Crystals to earn rewards fueled by opening chests, fusing
      shards and trading items.
    </div>

    <form id="stakeForm" on:submit|preventDefault={onStake}>

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
          <div class="label__error">No decimal places allowed.</div>
        {:else if !errors.amount.isMinValue}
          <div class="label__error">Must stake positive amount.</div>
        {:else if !errors.amount.isEnoughBalance}
          <div class="label__error">Insufficient balance.</div>
        {/if}
      </label>

    </form>

    <div class="modal__table">
      <table>
        <tr>
          <td>STAKE</td>
          <td><CurrencyComponent name="crystals" number={stake}/></td>
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
        <button form="stakeForm" {disabled}>STAKE</button>
      {/if}
    </div>
  </div>
</ModalComponent>
