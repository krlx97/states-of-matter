<script lang="ts">
  import {ethersService} from "services";
  import {modalStore, walletStore} from "stores";
  import {disenchantAmountValidator} from "validators";
  import {items} from "data";

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

  let totalReward = 0;
  let owned = $walletStore.items.find((item) => item.id === id).balance;
  let remaining = owned;

  const getPrice = (): any => {
    const item = items.find((item) => item.id === id);
    if (item.type !== 2) { return 0; }
    return item.disenchantReward;
  }

  const onValidateInput = (): void => {
    errors.amount = disenchantAmountValidator(id, amount);

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
      totalReward = getPrice() * parseInt(amount);
      remaining = owned.sub(amount);
    } else {
      totalReward = 0;
      remaining = owned;
    }
  };

  const onSetMax = (): void => {
    amount = owned.toString();
    onValidateInput();
  };

  const onDisenchant = async (): Promise<void> => {
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
      "disenchantSkins",
      [id, amount]
    );
    if (!isConfirmed) {
      isLoading = false;
      return;
    }

    await ethersService.loadUser();

    owned = $walletStore.items.find((item) => item.id === id).balance;
    remaining = owned.sub(amount);
    onValidateInput();

    isLoading = false;
  };
</script>

<div class="modal">
  <div class="modal__info">
    Disenchant skins to obtain etheric essence.
  </div>

  <form id="disenchantForm" on:submit|preventDefault={onDisenchant}>

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
        <div class="label__error">Must disenchant positive amount.</div>
      {:else if !errors.amount.isEnoughBalance}
        <div class="label__error">Insufficient balance.</div>
      {/if}
    </label>

  </form>

  <div class="modal__table">
    <table>
      <tr>
        <td>OWNED</td>
        <td>{owned}</td>
      </tr>
      <tr>
        <td>REMAINING</td>
        <td>{remaining}</td>
      </tr>
      <br/>
      <tr>
        <td>DISENCHANT</td>
        <td>{getPrice()} <img src="assets/currencies/sm/essence.png" alt="essence"/></td>
      </tr>
      <tr>
        <td>TOTAL</td>
        <td>{totalReward} <img src="assets/currencies/sm/essence.png" alt="essence"/></td>
      </tr>
    </table>
  </div>

  <div class="modal__submit">
    {#if isLoading}
      <i class="fa-solid fa-circle-notch fa-2x fa-spin"></i>
    {:else}
      <button form="disenchantForm" {disabled}>DISENCHANT</button>
    {/if}
  </div>
</div>
