<script lang="ts">
  import {onMount} from "svelte";
  import {eccService, socketService} from "services";
  import {accountStore, modalStore} from "stores";
  import Modal from "../ui/Modal.svelte";

  const token = $modalStore.data;

  let to = "";
  let quantity = 0;
  let memo = "";
  let isWithdraw = false;

  const errors = {
    name: {
      value: true,
      length: true,
      valid: true
    },
    quantity: {
      value: true,
      min: true,
      decimals: true,
      balance: true,
    }
  };

  let isEnoughForFee = true;
  let disabled = true;

  let remaining = "";
  let total = "";

  const getTotal = (): void => {
    total = (quantity ? quantity : 0.0000).toFixed(4);
  };

  const tlosBalance = (): string => {
    const {fungible} = $accountStore.wallet;
    const token = fungible.find(({symbol}) => symbol === "TLOS");

    if (!token) {
      return "0.0000";
    }

    return parseFloat(token.liquid).toFixed(4);
  };

  const getFee = (): void => {
    const balanceFloat = parseFloat(tlosBalance());
    const feeFloat = parseFloat("0.1000");
    const total = balanceFloat - feeFloat;
    const isValidBalanceFee = total >= 0;

    isEnoughForFee = isValidBalanceFee;
  };

  const getRemaining = (): void => {
    const vmt = $accountStore.wallet.fungible.find(({symbol}) => symbol === token.symbol);
    const {liquid} = vmt;

    remaining = (parseFloat(liquid) - parseFloat(`${quantity}` ? `${quantity}` : `0.0000 ${token.symbol}`)).toFixed(4);
  };

  const onInput = (): void => {
    errors.quantity.value = quantity !== null;
    errors.quantity.min = quantity >= 0.0001;
    errors.quantity.decimals = (quantity.toString().split(".")[1] || []).length <= 4;
    errors.name.value = to !== null;
    errors.name.length = to.length >= 3;
    errors.name.valid = /^[a-z1-5.\s]*$/.test(to);

    disabled = !errors.quantity.value || !errors.quantity.min || errors.quantity.decimals;

    const balancee = parseFloat($modalStore.data.liquid);
    const total = balancee - quantity;

    errors.quantity.balance = total >= 0;

    getRemaining();
    getTotal();
    getFee();
  };

  const onChange = (): void => {
    onInput();
  };

  const onTransfer = (): void => {
    const {name, nonce, privateKey} = $accountStore.profile;
    const signature = eccService.sign(`${nonce}`, privateKey);
    const from = name;

    socketService.socket.emit("transferToken", {
      from,
      to,
      quantity: {
        contract: $modalStore.data.contract,
        quantity: `${quantity.toFixed(4)} ${$modalStore.data.symbol}`
      },
      memo,
      signature,
      isWithdraw
    });
  };

  onMount(() => {
    getRemaining();
    getTotal();
    getFee();
  })
</script>

<style>
  h1 {
    margin: 0;
    margin-bottom: var(--spacing-md);
    font-size: 24px;
    font-weight: 900;
  }

  p {
    margin: 0;
    margin-bottom: var(--spacing-md);
    line-height: 1.4;
  }

  .transfer {
    width: 320px;
  }

  img {
    height: 16px;
    width: 16px;
    /* vertical-align: super; */
  }

  .info {
    margin-bottom: var(--spacing-md);
    padding: var(--spacing-sm);
    line-height: 1.4;
    border: 1px solid;
    border-right: 0;
    border-left: 0;
    border-image: linear-gradient(
      90deg,
      rgba(63, 63, 63, 1) 0%,
      rgba(255, 255, 255, 1) 50%,
      rgba(63, 63, 63, 1) 100%
    ) 1;
  }

  .amt {
    display: flex;
    justify-content: space-between;
  }

  .error {
    margin: var(--spacing-md);
    color: rgb(var(--red));
  }

  .submit-batn {
    width: 100%;
    display: flex;
    justify-content: center;
  }
</style>

<Modal>
  <div class="transfer">
    <h1>Transfer</h1>
    <p>
      Transfer tokens to another Eternitas account or to a Telos account.
    </p>

    <form id="transferForm" on:submit|preventDefault={onTransfer}>

      <label>
        <div class="label-body">To</div>
        <input
          placeholder="To"
          maxlength="12"
          required
          bind:value={to}
          on:input={onInput}
          on:change={onChange}
        />
      </label>

      {#if !errors.name.value}
        <div class="error">Mustn't be empty.</div>
      {/if}
      {#if !errors.name.length}
        <div class="error">Must contain at least 3 characters</div>
      {/if}
      {#if !errors.name.valid}
        <div class="error">Must only contain a-z, 1-5 and . (dot).</div>
      {/if}

      <label>
        <div>Quantity</div>
        <input
          placeholder="Quantity"
          type="number"
          step="0.0001"
          bind:value={quantity}
          on:input={onInput}
          on:change={onChange}
        />
      </label>
      <!-- <a matSuffix class="set-max" (click)="setMax()">MAX</a> -->
      {#if !errors.quantity.value}
        <div class="error">Mustn't be empty.</div>
      {/if}
      {#if !errors.quantity.decimals}
        <div class="error">Up to four decimal places allowed.</div>
      {/if}
      {#if !errors.quantity.balance}
        <div class="error">Insufficient balance.</div>
      {/if}
      {#if !isEnoughForFee}
        <div class="error">Insufficient balance to pay the fees.</div>
      {/if}
      {#if !errors.quantity.min}
        <div class="error">Minimum 0.0001 VMT.</div>
      {/if}

      <label>
        <div>Memo</div>
        <input placeholder="Memo" maxlength="256" bind:value={memo}>
      </label>

      <label class="label--checkbox">
        <input type="checkbox" bind:checked={isWithdraw}/>
        <div>Transfer to Telos account</div>
      </label>

    </form>

    <div class="info">
      <div class="amt">
        <span>FEE</span>
        <span>0.1000 <img src="assets/currencies/TLOS.png" alt="TLOS"/></span>
      </div>
      <div class="amt">
        <span>REMAINING</span>
        <span>{tlosBalance()} <img src="assets/currencies/TLOS.png" alt="TLOS"/></span>
      </div>
      <br/>
      <div class="amt">
        <span>TRANSFER</span>
        <span>{total} <img src="assets/currencies/{token.symbol}.png" alt={token.symbol}/></span>
      </div>
      <div class="amt">
        <span>REMAINING</span>
        <span>{remaining} <img src="assets/currencies/{token.symbol}.png" alt={token.symbol}/></span>
      </div>
    </div>

    <div class="submit-batn">
      <button form="transferForm">
        TRANSFER
      </button>
    </div>
  </div>
</Modal>
