<script lang="ts">
  import {onDestroy, onMount} from "svelte";
  import {ethersService, formService, socketService} from "services";
  import {ButtonComponent, InputComponent, FormComponent, FormSubmitComponent, SelectComponent} from "ui";
  import BindMetamask from "./BindMetamask.svelte";
  import { ethersStore } from "stores";

  const formStore = formService.create({
    name: ["", "name"],
    password: ["", "password"]
  });

  let selectedAddress = $ethersStore.accounts[0];

  let isPasswordVisible = false;
  let step = 1;
  let accountType = "password";
  // let disabled = true;

  const onInput = (): void => {
    // if (accountType === "password") {
    //   disabled = $formStore.fields.name.error !== "" || $formStore.fields.password.error !== "";
    // } else {
    //   console.log($formStore.fields.name.error, selectedAddress);
    //   disabled = $formStore.fields.name.error !== "" || selectedAddress !== undefined
    // }

    formService.validate(formStore);
  };

  const onTogglePasswordVisible = (): void => {
    isPasswordVisible = !isPasswordVisible;
  };

  const onNextStep = (): void => {
    step += 1;
  };

  const onPreviousStep = (): void => {
    step -= 1;
  };


  // $: if (accountType === "password") {
  //   disabled = !$formStore.fields.name.error && !$formStore.fields.password.error
  // } else {
  //   disabled = !$formStore.fields.name.error && selectedAddress !== undefined
  // }

  const onSignup = async (): Promise<void> => {
    if (accountType === "metamask") {
      const data = await ethersService.sign("signup");

      if (!data) { return; }

      const {signature, address} = data;

      socketService.socket.emit("signupMetamask", {
        name: $formStore.fields.name.value,
        address,
        signature
      });
    } else {
      socketService.socket.emit("signupPassword", {
        name: $formStore.fields.name.value,
        password: $formStore.fields.password.value
      });
    }
  };

  // let sub;
  // onMount(async () => {
  //   sub = ethersStore.subscribe((store) => {
  //     selectedAddress = store.accounts[0];
  //     onInput();
  //   });

    // window.ethereum.on("accountsChanged", (accounts: any) => {
    //   address = accounts[0];
    // });

    // const accounts = await window.ethereum.request({
    //   method: "eth_accounts"
    // });

    // address = accounts[0];
  // });

  // onDestroy(() => {
  //   sub();
  // })
</script>

<style>
  .signup {
    padding: var(--md);
    height: 512px;
    box-sizing: border-box;
  }

  .account-types {
    display: flex;
    flex-direction: column;
    gap: var(--md);
  }
</style>

<div class="signup">

  <FormComponent on:submit="{onSignup}">
    {#if step === 1}
      <div>Step 1: Choose account type</div>

      <div class="account-types">
        <InputComponent
          label="Password"
          type="radio"
          value="password"
          bind:group="{accountType}" on:change="{onInput}"/>
        <InputComponent
          label="Metamask"
          type="radio"
          value="metamask"
          bind:group="{accountType}" on:change="{onInput}"/>
      </div>

      <div class="form__submit">
        <ButtonComponent type="button" on:click="{onNextStep}">
          NEXT
        </ButtonComponent>
      </div>
    {:else if step === 2}
      <div>Step 2: Signup</div>

      <InputComponent
        label="Name"
        error="{$formStore.fields.name.error}"
        bind:value="{$formStore.fields.name.value}"
        on:input="{onInput}"/>

      {#if accountType === "password"}
        <InputComponent
          label="Password"
          type="{isPasswordVisible ? "text" : "password"}"
          error="{$formStore.fields.password.error}"
          action="{[
            isPasswordVisible ? "HIDE" : "SHOW",
            onTogglePasswordVisible
          ]}"
          bind:value="{$formStore.fields.password.value}"
          on:input="{onInput}"/>
      {:else}
        {#if window.ethereum !== undefined && $ethersStore.accounts.length && $ethersStore.chainId === 41n}
          <SelectComponent
            label="Address"
            values={$ethersStore.accounts}
            bind:selected="{selectedAddress}"/>
          <!-- {selectedAddress} -->
          <!-- <InputComponent
            label="Address"
            value="{$ethersStore.accounts[0]}"
            disabled/> -->
        {:else}
          <BindMetamask/>
        {/if}
      {/if}

      <div style="display: flex; justify-content: space-between">
        <ButtonComponent on:click="{onPreviousStep}">
          PREVIOUS
        </ButtonComponent>
        <ButtonComponent type="submit">SIGNUP</ButtonComponent>
      </div>
    {/if}

  </FormComponent>

</div>
