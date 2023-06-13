<script lang="ts">
  import {BigNumber, ethers, utils} from "ethers";
  import {ethersService, socketService} from "services";
  import {modalStore, walletStore} from "stores";
  import {CurrencyComponent, ModalComponent} from "ui";
  import {buyItemAmountValidator} from "validators";

  const {item} = $modalStore.data;
  const errors = {
    amount: {
      hasValue: true,
      isValid: true,
      hasCorrectDecimals: true,
      isMinValue: true,
      isEnoughBalance: true,
      isEnoughAmount: true
    }
  };

  let amount: string;
  let disabled = true;
  let isLoading = false;

  let remaining = $walletStore.crystals.balance;
  let transfer = 0;
  let thePrice = BigNumber.from(0);
  let buyout = BigNumber.from(0);

  const onValidateInput = (): void => {
    errors.amount = buyItemAmountValidator(item, amount);

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
      transfer = parseInt(amount);
      thePrice = ethers.utils.parseUnits(item.price, 18).mul(amount);
      remaining = $walletStore.crystals.balance.sub(thePrice);
    } else {
      transfer = 0;
      thePrice = BigNumber.from(0);
      remaining = $walletStore.crystals.balance;
    }
  };

  const onSetMax = (): void => {
    amount = ethers.utils.parseUnits(item.price, 18).mul(ethers.utils.parseUnits(item.amount, 0)).gt($walletStore.crystals.balance) ?
      $walletStore.crystals.balance.div(ethers.utils.parseUnits(item.price, 18)).toString() : // nema
      item.amount; // ima

    onValidateInput();
  };

  const onBuyItem = async (): Promise<void> => {
    isLoading = true;
    const {game} = ethersService.keys;

    if (!$walletStore.allowance.gte(thePrice)) {
      const isConfirmed = await ethersService.transact("currency", "increaseAllowance", [game, thePrice]);
      if (!isConfirmed) {
        isLoading = false;
        return;
      }
    }

    const isConfirmed = await ethersService.transact("game", "buyItem", [item.listingId, amount]);
    if (!isConfirmed) {
      isLoading = false;
      return;
    }

    socketService.socket.emit("getMarketItems" as any);
    await ethersService.loadUser();
    onValidateInput();
    isLoading = false;
  };
</script>

<ModalComponent>
 <div class="modal">
    <div class="modal__title">Buy item</div>
    <!-- <div class="modal__info">
      Pay Etheric Crystals to buy an item from another player.
    </div> -->

    <form id="buyItemForm" on:submit|preventDefault={onBuyItem}>

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
          <div class="label__error">No decimal places allowed.</div>
        {:else if !errors.amount.isMinValue}
          <div class="label__error">Must buy positive amount.</div>
        {:else if !errors.amount.isEnoughBalance}
          <div class="label__error">Insufficient balance.</div>
        {:else if !errors.amount.isEnoughAmount}
          <div class="label__error">Not enough items.</div>
        {/if}
      </label>

    </form>

    <div class="modal__table">
      <table>
        <tr>
          <td>PRICE</td>
          <td><CurrencyComponent name="crystals" number={ethers.utils.parseUnits(item.price, 18)}/></td>
        </tr>
        <tr>
          <td>TOTAL</td>
          <td><CurrencyComponent name="crystals" number={thePrice}/></td>
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
        <button form="buyItemForm" {disabled}>BUY</button>
      {/if}
    </div>
  </div>
</ModalComponent>
