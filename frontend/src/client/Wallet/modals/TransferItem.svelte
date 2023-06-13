<script lang="ts">
  import {BigNumber} from "ethers";
  import {ethersService} from "services";
  import {modalStore, walletStore} from "stores";
  import {addressValidator, transferItemAmountValidator} from "validators";

  const {id} = $modalStore.data;
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

  let owned: BigNumber = $walletStore.items.find((item) => item.id === id).balance;
  let transfer = 0;
  let remaining = owned;

  const onValidateInput = (): void => {
    errors.address = addressValidator(address);
    errors.amount = transferItemAmountValidator(id, amount);

    disabled =
      !errors.amount.hasValue ||
      !errors.amount.isValid ||
      !errors.amount.hasCorrectDecimals ||
      !errors.amount.isMinValue ||
      !errors.amount.isEnoughBalance ||
      !errors.address.hasValue ||
      !errors.address.isValid ||
      !errors.address.isntSelf;

    if (
      errors.amount.hasValue &&
      errors.amount.isValid &&
      errors.amount.hasCorrectDecimals
    ) {
      transfer = parseInt(amount);
      remaining = owned.sub(transfer);
    } else {
      transfer = 0;
      remaining = owned;
    }
  };

  const onSetMax = (): void => {
    amount = owned.toString();
    onValidateInput();
  };

  const onTransfer = async (): Promise<void> => {
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
      "skins",
      "safeTransferFrom",
      [ethersService.key, address, id, amount, []]
    );
    if (!isConfirmed) {
      isLoading = false;
      return;
    }

    await ethersService.loadUser();

    owned = $walletStore.items.find((item) => item.id === id).balance;
    onValidateInput();
    isLoading = false;
  };
</script>

<div class="modal">
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
        <div class="label__error">No decimal places allowed.</div>
      {:else if !errors.amount.isMinValue}
        <div class="label__error">Must transfer positive amount.</div>
      {:else if !errors.amount.isEnoughBalance}
        <div class="label__error">Insufficient owned.</div>
      {/if}
    </label>

  </form>

  <div class="modal__table">
    <table>
      <tr>
        <td>OWNED</td>
        <td>{owned}</td>
      </tr>
      <br/>
      <tr>
        <td>TRANSFER</td>
        <td>{transfer}</td>
      </tr>
      <tr>
        <td>REMAINING</td>
        <td>{remaining}</td>
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
