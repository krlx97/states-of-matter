<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import {ethersService, formService, socketService} from "services";
  import {ButtonComponent, InputComponent, FormComponent, FormSubmitComponent, SelectComponent} from "ui";
  import { getAddress } from "ethers";
  import { ethersStore } from "stores";
  import BindMetamask from "./BindMetamask.svelte";

  const formStore = formService.create({
    name: ["", "name"],
    password: ["", "password"]
  });

  const formStoreMetamask = formService.create({});
  let selectedAddress: any;
  let checked = false;
  let view = "password";
  let isPasswordVisible = false;

  formService.validate(formStoreMetamask);

  const onInput = (): void => {
    formService.validate(formStore);
  };

  const onTogglePasswordVisible = (): void => {
    isPasswordVisible = !isPasswordVisible;
  };

  const onSubmit = (): void => {
    socketService.socket.emit("signinPassword", {
      name: $formStore.fields.name.value,
      password: $formStore.fields.password.value,
      rememberMe: checked
    });
  };

  const onMetamask = async (): Promise<void> => {
    await ethersService.init();
    socketService.socket.emit("getNonce", {address: selectedAddress});
  };

  onMount(async () => {

    socketService.socket.on("getNonce", async (params) => {
      const {nonce} = params;
      const data = await ethersService.sign(`signin${nonce}`);

      if (!data) { return; }

      const {signature, address} = data;

      socketService.socket.emit("signinMetamask", {
        address,
        signature,
        rememberMe: checked
      });
    })
  });

  onDestroy(() => {
    socketService.socket.off("getNonce");
  });
</script>

<style>
  button img {
    display: inline;
    margin-right: var(--md);
  }

  .alt-auth {
    display: flex;
    flex-direction: column;
    gap: var(--md);
  }

  .floating {
    position: relative;
    width: 100%;
    height: 16px;
    margin: 32px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .floating__bar {
    flex-basis: 45%;
    height: 2px;
    background-color: rgb(127, 127, 127);
  }

  .floating__or {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>

<div class="signin">
  {#if view === "password"}
    <FormComponent on:submit="{onSubmit}">
      <div>Password signin</div>

      <InputComponent
        label="Name"
        error="{$formStore.fields.name.error}"
        bind:value="{$formStore.fields.name.value}"
        on:input="{onInput}"/>

      <InputComponent
        label="Password"
        type="{isPasswordVisible ? "text" : "password"}"
        error="{$formStore.fields.password.error}"
        action="{[isPasswordVisible ? "HIDE" : "SHOW", onTogglePasswordVisible]}"
        bind:value="{$formStore.fields.password.value}"
        on:input="{onInput}"/>

      <InputComponent label="Remember me" type="checkbox" bind:checked/>

      <svelte:fragment slot="submit">
        <FormSubmitComponent {formStore}>SIGNIN</FormSubmitComponent>
      </svelte:fragment>
    </FormComponent>

    <div class="floating">
      <div class="floating__bar"></div>
      <div class="floating__or">OR</div>
      <div class="floating__bar"></div>
    </div>

    <div class="alt-auth">
      <ButtonComponent on:click="{() => view = "metamask"}">
        <img src="images/metamask.png" alt="Metamask" height="32" width="32"/> METAMASK
      </ButtonComponent>
    </div>
  {:else}
    <FormComponent on:submit="{onMetamask}">
      <div>Metamask signin</div>

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
      <!-- <InputComponent
        label="Address"
        value="{$ethersStore.signer?.address}"
        disabled/> -->

      <InputComponent
        label="Remember me"
        type="checkbox"
        bind:checked/>

      <svelte:fragment slot="submit">
        <FormSubmitComponent formStore={formStoreMetamask}>SIGNIN</FormSubmitComponent>
      </svelte:fragment>
    </FormComponent>

    <div class="floating">
      <div class="floating__bar"></div>
      <div class="floating__or">OR</div>
      <div class="floating__bar"></div>
    </div>

    <div class="alt-auth">
      <ButtonComponent on:click="{() => view = "password"}">
        PASSWORD
      </ButtonComponent>
    </div>
  {/if}

</div>
