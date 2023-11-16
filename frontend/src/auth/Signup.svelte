<script lang="ts">
  import {onMount} from "svelte";
  import {ethersService, formService, socketService} from "services";
  import {FormFieldComponent} from "ui";
  import BindMetamask from "./BindMetamask.svelte";
    import { ethersStore } from "stores";

  const formStore = formService.create({
    name: ["", "name"],
    password: ["", "password"]
  });

  let isPasswordVisible = false;

  const onInput = (): void => {
    formService.validate(formStore);
  };

  const onTogglePasswordVisible = (): void => {
    isPasswordVisible = !isPasswordVisible;
  };

  let step = 1;
  let name = "";
  let password = "";
  let repeatPassword = "";
  let disabled = true;
  let accountType = "password";
  let address = "";

  const onNextStep = (): void => {
    step += 1;
  };

  const onPreviousStep = (): void => {
    step -= 1;
  };

  const onSignup = async (): Promise<void> => {
    if (accountType === "metamask") {
      // await ethersService.init();
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

  onMount(async () => {
    // window.ethereum.on("accountsChanged", (accounts: any) => {
    //   address = accounts[0];
    // });

    const accounts = await window.ethereum.request({
      method: "eth_accounts"
    });

    // address = accounts[0];
  });
</script>

<style>
  .signup {
    padding: var(--spacing-md);
    height: 512px;
    box-sizing: border-box;
  }

  .account-types {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }
</style>

<div class="signup">

  <form on:submit|preventDefault="{onSignup}">
    {#if step === 1}
      <div>Step 1: Choose account type</div>

      <div class="account-types">
        <FormFieldComponent
          label="Password"
          type="radio"
          value="password"
          bind:group="{accountType}"/>
        <FormFieldComponent
          label="Metamask"
          type="radio"
          value="metamask"
          bind:group="{accountType}"/>
      </div>

      <div class="form__submit">
        <button class="button" type="button" on:click="{onNextStep}">
          NEXT
        </button>
      </div>
    {:else if step === 2}
      <div>Step 2: Signup</div>

      <FormFieldComponent
        label="Name"
        error="{$formStore.fields.name.error}"
        bind:value="{$formStore.fields.name.value}"
        on:input="{onInput}"/>
      {#if accountType === "password"}
        <FormFieldComponent
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
        {#if $ethersStore.isValid}
          <FormFieldComponent
            label="Address"
            value="{$ethersStore.signer?.address}"
            disabled/>
        {:else}
          <BindMetamask/>
        {/if}
      {/if}

      <div style="display: flex; justify-content: space-between">
        <button class="button" type="button" on:click="{onPreviousStep}">
          PREVIOUS
        </button>
        <button class="button" on:click="{onSignup}">
          SIGNUP
        </button>
      </div>
    {/if}

  </form>

</div>
