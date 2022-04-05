<script lang="ts">
  import {eccService, socketService} from "services";
  import {playerStore} from "stores";
  import Button from "../ui/Button.svelte";
  import Modal from "../ui/Modal.svelte";
  import Text from "../ui/Text.svelte";

  $: disabled = $playerStore.wallet

  const chains = [
    {id: 0, text: "TLOS", fee: "0.0010 TLOS"},
    {id: 1, text: "SOM", fee: "0.001 SOM"},
    {id: 2, text: "ATMOS", fee: "0.0010 ATMOS"}
  ];

  const form = {
    chain: {id: 0, text: "TLOS", fee: "0.0010 TLOS"},
    to: "",
    amount: "0.0000",
    isWithdraw: false
  };

  const onSendToken = (): void => {
    const {username, publicKey, privateKey} = $playerStore;
    const signature = eccService.sign(`sendToken`, privateKey);

    socketService.socket.emit("sendToken", {
      chain_id: form.chain.id,
      relayer: "admin",
      from: username,
      to: form.to,
      quantity: `${form.amount} ${form.chain.text}`,
      fee: `${form.chain.text === "TLOS" ? "0.0010" : "0.001"} ${form.chain.text}`,
      nonce: 1,
      memo: "test",
      sig: signature,
      isWithdraw: form.isWithdraw
    });
  };
</script>

<style lang="scss">
  @import "../shared/styles/variables";

  .form__field {
    margin-bottom: $spacing-md;

    &:last-child {margin-bottom: 0}
  }
  select {
    appearance: none;
    width: 100%;
    padding: $spacing-sm $spacing-lg;
    background-color: $dark-grey;
    border: 2px solid $green;
    box-sizing: border-box;
    color: white;
    outline: none;
    font-family: "Exo 2", sans-serif;
  }
  option {
    padding: 1em;
  }
  .checkbox {
    width: auto;
  }
</style>

<Modal>
  <div>SEND TOKENS</div>

  <form>

    <div class="form__field">
      <label for="chain">Token</label>
      <select id="chain" bind:value={form.chain}>
        {#each chains as chain}
          <option value={chain}>
            {chain.text}
          </option>
        {/each}
      </select>
    </div>


    <div class="form__field">
      <label for="to">To</label>
      <input id="to" class="input--green" placeholder="To" bind:value={form.to}/>
    </div>

    <div class="form__field">
      <label for="amount">Amount</label>
      <input id="amount" class="input--green" placeholder="Amount" bind:value={form.amount}/>
    </div>

    <div class="form__field" style="display: flex">
      <input class="checkbox" id="withdraw" type="checkbox" bind:checked={form.isWithdraw}/>
      <label for="withdraw" style="flex-grow: 1">Withdraw?</label>
    </div>

    <div>Fee: {form.chain.fee}</div>
    <div>Total: {(parseFloat(form.amount) + parseFloat(form.chain.fee)).toFixed(4)} {form.chain.text}</div>

    <Button color="green" on:click={onSendToken}>
      <Text>SEND</Text>
    </Button>
  </form>
</Modal>
