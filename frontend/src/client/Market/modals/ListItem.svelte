<script lang="ts">
  import {BigNumber, utils} from "ethers";
  import {items} from "data";
  import {ethersService} from "services";
  import {walletStore} from "stores";
  import {CurrencyComponent, ModalComponent} from "ui";
  import {listItemAmountValidator, listItemPriceValidator} from "validators";

  const errors = {
    amount: {
      hasValue: true,
      isValid: true,
      hasCorrectDecimals: true,
      isMinValue: true,
      isEnoughBalance: true
    },
    price: {
      hasValue: true,
      isValid: true,
      hasCorrectDecimals: true,
      isMinValue: true,
    }
  };

  let id = 10; // first ID in items list is 10, find a better way for this?
  let amount: string;
  let price: string = "";
  let disabled = true;
  let isLoading = false;

  let remaining = $walletStore.items.find((item) => item.id === id).balance;
  let transfer = 0;
  let thePrice = BigNumber.from(0);
  let buyout = BigNumber.from(0);

  const getBalance = (id: any): BigNumber => {
    return $walletStore.items.find((item) => item.id === id).balance;
  };

  const onValidateInput = (): void => {
    errors.amount = listItemAmountValidator(id, amount);
    errors.price = listItemPriceValidator(price);

    disabled =
      !errors.amount.hasValue ||
      !errors.amount.isValid ||
      !errors.amount.hasCorrectDecimals ||
      !errors.amount.isMinValue ||
      !errors.amount.isEnoughBalance ||
      !errors.price.hasValue ||
      !errors.price.isValid ||
      !errors.price.hasCorrectDecimals ||
      !errors.price.isMinValue;

    if (
      errors.amount.hasValue &&
      errors.amount.isValid &&
      errors.amount.hasCorrectDecimals
    ) {
      transfer = parseInt(amount);
      remaining = $walletStore.items.find((item) => item.id === id).balance.sub(transfer);
    } else {
      transfer = 0;
      remaining = $walletStore.items.find((item) => item.id === id).balance;
    }

    if (
      errors.price.hasValue &&
      errors.price.isValid &&
      errors.price.hasCorrectDecimals
    ) {
      thePrice = utils.parseUnits(price);
      buyout = thePrice.mul(amount);
    } else {
      thePrice = BigNumber.from(0);
      buyout = BigNumber.from(0);
    }
  };

  const onSetMax = (): void => {
    amount = $walletStore.items.find((item) => item.id === id).balance.toString();
    onValidateInput();
  };

  const onList = async (): Promise<void> => {
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
      "listItem",
      [id, amount, utils.parseUnits(price)]
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

<ModalComponent>
 <div class="modal">
    <div class="modal__title">List item</div>
    <div class="modal__info">
      List an item for sale to be bought by other players. A 2% fee applies,
      with 1% going to the item creator and 1% to the stake pool. If the item is a
      Chest, 2% goes to the stake pool instead.
    </div>

    <form id="listItemForm" on:submit|preventDefault={onList}>

      <label>
        <div class="label__title">Item</div>
        <select bind:value={id} on:change={onValidateInput}>
          {#each items as item}
            <option value={item.id}>#{item.id} | {item.name} - {getBalance(item.id)}</option>
          {/each}
        </select>
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
          <div class="label__error">Insufficient balance.</div>
        {/if}
      </label>

      <label>
        <div class="label__title">Price</div>
        <input
          placeholder="Price"
          bind:value={price}
          on:input={onValidateInput}
        />
        {#if !errors.price.hasValue}
          <div class="label__error">Mustn't be empty.</div>
        {:else if !errors.price.isValid}
          <div class="label__error">Invalid number format.</div>
        {:else if !errors.price.hasCorrectDecimals}
          <div class="label__error">Up to 18 decimal places allowed.</div>
        {:else if !errors.price.isMinValue}
          <div class="label__error">Minimum price is 1.</div>
        {/if}
      </label>

    </form>

    <div class="modal__table">
      <table>
        <tr>
          <td>SELL</td>
          <td>{transfer}</td>
        </tr>
        <tr>
          <td>REMAINING</td>
          <td>{remaining}</td>
        </tr>
        <br/>
        <tr>
          <td>PRICE</td>
          <td><CurrencyComponent name="crystals" number={thePrice}/></td>
        </tr>
        <tr>
          <td>BUYOUT</td>
          <td><CurrencyComponent name="crystals" number={buyout}/></td>
        </tr>
      </table>
    </div>

    <div class="modal__submit">
      {#if isLoading}
        <i class="fa-solid fa-circle-notch fa-2x fa-spin"></i>
      {:else}
        <button form="listItemForm" {disabled}>SELL</button>
      {/if}
    </div>
  </div>
</ModalComponent>
