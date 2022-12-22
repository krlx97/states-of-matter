<script lang="ts">
    import { eccService, socketService } from "services";
  import {accountStore, modalStore} from "stores";
  import {onMount} from "svelte";
  import Modal from "../ui/Modal.svelte";

  let stake = 0;
  let isMin = true;
  let isValidAsset = true;
  let isEnoughMoney = true;
  let isEnoughForFee = true;
  let isValue = true;
  let disabled = true;

  let remaining = "";
  let total = "";

  const getTotal = (): void => {
    const zero = 0.0000;

    total = (stake ? stake : zero).toFixed(4);
  };

  const tlosBalance = (): string => {
    const {fungible} = $accountStore.wallet;
    const tlos = fungible.find((liquid) => liquid.symbol === "TLOS");

    if (!tlos) {
      return "0.0000";
    }

    return parseFloat(tlos.liquid).toFixed(4);
  };

  const getFee = (): void => {
    const balanceFloat = parseFloat(tlosBalance());
    const feeFloat = parseFloat("0.1000");
    const total = balanceFloat - feeFloat;
    const isValidBalanceFee = total >= 0;

    isEnoughForFee = isValidBalanceFee;
  };

  const getRemaining = (): void => {
    const ft = $accountStore.wallet.fungible.find((ft) => ft.symbol === $modalStore.data.symbol);
    const {staked} = ft;

    remaining = (parseFloat(staked) - parseFloat(`${stake}` ? `${stake}` : `0.0000 ${$modalStore.data.symbol}`)).toFixed(4);
  };

  const onInput = (): void => {
    isValue = stake !== null;
    isMin = stake >= 0.0001;
    isValidAsset = (stake.toString().split(".")[1] || []).length <= 4;
    disabled = !isMin || !isValidAsset;

    const tkn = $accountStore.wallet.fungible.find((liquid) => liquid.symbol === $modalStore.data.symbol);
    const {liquid} = tkn;

    const balancee = parseFloat(liquid);
    const total = balancee - stake;

    isEnoughMoney = total >= 0;

    getRemaining();
    getTotal();
    getFee();
  };

  const onChange = (): void => {
    onInput();
  };

  const onSubmit = (): void => {
    const {name, nonce, privateKey} = $accountStore.profile;
    const signature = eccService.sign(`${nonce}`, privateKey);

    socketService.socket.emit("unstakeToken", {
      name,
      signature,
      token: {
        contract: $modalStore.data.contract,
        quantity: `${stake.toFixed(4)} ${$modalStore.data.symbol}`
      }
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
  img {
    height: 16px;
    width: 16px;
    vertical-align: bottom;
  }
  input {width: 100%}
  label {
    margin-bottom: var(--spacing-md);
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
  .stake {
    width: 320px;
    /* padding: var(--spacing-md); */
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
  <div class="stake">
    <h1>Unstake</h1>
    <p>
      Unstake your staked {$modalStore.data.symbol} and claim them after 21
      days. You will not receive any rewards during the vesting period.
    </p>
    <form id="stakeForm" on:submit|preventDefault={onSubmit}>
      <label>
        <div class="label-body">Amount</div>
        <input
          type="number"
          placeholder="Amount"
          min="0.0001"
          step="0.0001"
          required
          bind:value={stake}
          on:input={onInput}
          on:change={onChange}
        />
      </label>

      {#if !isValue}
        <span class="error">Mustn't be empty</span>
      {/if}
      {#if !isValidAsset}
        <span class="error">Up to four decimal places allowed</span>
      {/if}
      {#if !isEnoughMoney}
        <span class="error">Insufficient balance</span>
      {/if}
      {#if !isEnoughForFee}
        <span class="error">Insufficient balance to pay the fees</span>
      {/if}
      {#if !isMin}
        <span class="error">Minimum 0.0001 {$modalStore.data.symbol}.</span>
      {/if}

    </form>

    <div class="info">
      <div class="amt">
        <span>FEE</span> <span>0.1000 <img src="assets/currencies/TLOS.png" alt="TLOS"/></span>
      </div>
      <div class="amt">
        <span>REMAINING</span> <span>{tlosBalance()} <img src="assets/currencies/TLOS.png" alt="TLOS"/></span>
      </div>
      <br/>
      <div class="amt">
        <span>UNSTAKE</span> <span>{total} <img src="assets/currencies/{$modalStore.data.symbol}.png" alt="{$modalStore.data.symbol}"/></span>
      </div>
      <div class="amt">
        <span>REMAINING</span> <span>{remaining} <img src="assets/currencies/{$modalStore.data.symbol}.png" alt="{$modalStore.data.symbol}"/></span>
      </div>
    </div>

    <div class="submit-batn">
      <button form="stakeForm" {disabled}>UNSTAKE</button>
    </div>
  </div>
</Modal>
