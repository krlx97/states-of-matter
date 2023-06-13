<script lang="ts">
  import {items} from "data";
  import {ethersService} from "services";
  import {modalStore, walletStore} from "stores";
  import {craftAmountValidator} from "validators";

  const {id} = $modalStore.data;
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

  let totalPrice = 0;
  let remaining = $walletStore.essence.balance;

  const getPrice = (): number => {
    const item = items.find((item) => item.id === id);
    if (item.type !== 1) { return 0; }
    return item.craftPrice;
  }

  const onValidateInput = (): void => {
    errors.amount = craftAmountValidator(amount, `${getPrice()}`);

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
      totalPrice = getPrice() * parseInt(amount);
      remaining = $walletStore.essence.balance.sub(totalPrice);
    } else {
      totalPrice = 0;
      remaining = $walletStore.essence.balance;
    }
  };

  const onSetMax = (): void => {
    amount = $walletStore.essence.balance.div(getPrice()).toString();
    onValidateInput();
  };

  const onCraft = async (): Promise<void> => {
    isLoading = true;
    const {game} = ethersService.keys;

    if (!$walletStore.isApprovedForAll) {
      const isConfirmed = await ethersService.transact("skins", "setApprovalForAll", [game, true]);
      if (!isConfirmed) {
        isLoading = false;
        return;
      }
    }

    const isConfirmed = await ethersService.transact(
      "game",
      "craftShards",
      [id, amount]
    );
    if (!isConfirmed) {
      isLoading = false;
      return;
    }

    await ethersService.loadUser();
    onValidateInput();
    isLoading = false;
  };
</script>

<style>
  .img {display: inline;}
</style>

<div class="modal">
  <div class="modal__info">
    Spend etheric essence to craft shards.
  </div>

  <form id="craftForm" on:submit|preventDefault={onCraft}>

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
        <div class="label__error">Must craft positive amount.</div>
      {:else if !errors.amount.isEnoughBalance}
        <div class="label__error">Insufficient balance.</div>
      {/if}
    </label>

  </form>

  <div class="modal__table">
    <table>
      <tr>
        <td>PRICE</td>
        <td>{getPrice()} <div class="img"><img src="assets/currencies/sm/essence.png" alt="essence"/></div> </td>
      </tr>
      <tr>
        <td>TOTAL</td>
        <td>{totalPrice} <div class="img"><img src="assets/currencies/sm/essence.png" alt="essence"/></div></td>
      </tr>
      <tr>
        <td>REMAINING</td>
        <td>{remaining} <div class="img"><img src="assets/currencies/sm/essence.png" alt="essence"/></div></td>
      </tr>
    </table>
  </div>

  <div class="modal__submit">
    {#if isLoading}
      <i class="fa-solid fa-circle-notch fa-2x fa-spin"></i>
    {:else}
      <button form="craftForm" {disabled}>CRAFT</button>
    {/if}
  </div>
</div>
