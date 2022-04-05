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
    const {username, publicKey, privateKey, last_nonce} = $playerStore;
    const signature = eccService.sign(`transfer:${last_nonce + 1}`, privateKey);

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
      isWithdraw: scoops
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
    &__content {@include flex(column);}
  }
</style>

<div class="token-wrapper" class:isRequestsToggled>
  <div class="token">
    <div class="token__img" on:click={toggleRequests}>
      <Img src="currencies/{token.token}.png" alt={token.name}/>
    </div>
    <div class="token__content">
      <Text>{token.name}</Text>
      <Text>{token.amount}</Text>
    </div>
  </div>
  {#if isRequestsToggled}
    <div transition:slide={transitionSlide}>
      {#if token.token === "DMT"}
        <Text size="lg">Token not tradeable.</Text>
      {:else}
        <Form on:submit={onSendToken}>
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
        </Form>
        <!-- <div style="width: 256px;">{JSON.stringify(form)}</div> -->
      {/if}
    </div>
  {/if}
</div>
