<script lang="ts">
  import {eccService, socketService} from "services";
  import {playerStore} from "stores";
  import Button from "../../../ui/Button.svelte";
  import Img from "../../../ui/Img.svelte";
  import Input from "../../../ui/Input.svelte";
  import Text from "../../../ui/Text.svelte";
  import Form from "../../../ui/Form.svelte";

  interface Tkn {
    name: string;
    token: string;
    amount: string;
    chain_id: number;
    ticker: string;
  }

  let token: Tkn;
  let scoops = false;

  const form = {
    chain: {id: 0, text: "TLOS", fee: "0.0010 TLOS"},
    to: "",
    amount: "0.0000",
    isWithdraw: false
  };

  const onSendToken = (): void => {
    const {username, publicKey, privateKey, nonce} = $playerStore;
    console.log($playerStore);
    const signature = eccService.sign(`${nonce + 1}`, privateKey);

    socketService.socket.emit("sendToken", {
      chain_id: token.chain_id,
      relayer: "admin",
      from: username,
      to: form.to,
      quantity: `${form.amount} ${token.ticker}`,
      fee: `${form.chain.text === "TLOS" ? "0.0010" : "0.001"} ${token.ticker}`,
      nonce: 1,
      memo: "test",
      sig: signature,
      isWithdraw: form.isWithdraw
    });
  };

  import {quadInOut} from "svelte/easing";

  import {slide} from "svelte/transition";
  import type {SlideParams} from "svelte/transition";


  const transitionSlide: SlideParams = {
      duration: 333,
      easing: quadInOut
    }

  let isRequestsToggled = false;


  const toggleRequests = (): void => {
    isRequestsToggled = !isRequestsToggled;
  };

  export {token};
</script>
  
<style lang="scss">
  @import "../../../shared/styles/mixins";
  @import "../../../shared/styles/variables";

  .isRequestsToggled {box-shadow: elevation-lg;}

  .token-wrapper {
    margin-bottom: $spacing-md;
    background-color: $light-grey;
    border-radius: 4px;

    &:last-child {margin-bottom: 0;}
  }

  .token {
    padding: $spacing-md;
    @include flex($align-items: center);
    border-radius: 4px;
    box-shadow: $elevation-sm;
    box-sizing: border-box;

    &__img {margin-right: $spacing-md;}
    &__content {@include flex(column); flex-grow: 1;}
  }

  .overflow-fix {
    padding: $spacing-md;
    box-sizing: border-box;
  }
</style>

<div class="token-wrapper" class:isRequestsToggled>
  <div class="token">
    <div class="token__img">
      <Img src="currencies/{token.token}.png" alt={token.name}/>
    </div>
    <div class="token__content">
      <Text>{token.name}</Text>
      <Text>{token.amount}</Text>
    </div>
    <Button style="icon" color="grey" on:click={toggleRequests}>
      {#if isRequestsToggled}
        <img src="assets/icons/up.png" alt="Up"/>
      {:else}
        <img src="assets/icons/down.png" alt="Down"/>
      {/if}
    </Button>
  </div>
  {#if isRequestsToggled}
    <div transition:slide={transitionSlide}>
      {#if token.token === "DMT"}
        <div style="padding: 1em">
          <h3>Token not tradeable.</h3>
        </div>
      {:else}
        <form class="overflow-fix" on:submit|preventDefault={onSendToken}>
          <Input placeholder="To" maxlength={12} bind:value={form.to}/>
          <!-- <Input placeholder="Game Wallet" type="radio" value={false} bind:group={form.isWithdraw}/>
          <Input placeholder="Telos Wallet" type="radio" value={true} bind:group={form.isWithdraw}/> -->
          <Input placeholder="Amount" bind:value={form.amount} maxlength={32}/>
          <Input placeholder="Withdraw" type="checkbox" bind:checked={form.isWithdraw} maxlength={32}/>

          <div style="text-align: right;">Fee: {form.chain.fee}</div>
          <div style="text-align: right;">Total: {(parseFloat(form.amount) + parseFloat(form.chain.fee)).toFixed(4)} {form.chain.text}</div>
          <div style="text-align: right; margin-bottom: 1em;">Remaining: {(parseFloat(token.amount) - (parseFloat(form.amount) + parseFloat(form.chain.fee))).toFixed(4)} {form.chain.text}</div>

          <Button type="submit">
            <Text>SEND</Text>
          </Button>
        </form>
        <!-- <div style="width: 256px;">{JSON.stringify(form)}</div> -->
      {/if}
    </div>
  {/if}
</div>
