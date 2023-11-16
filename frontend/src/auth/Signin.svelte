<script lang="ts">
  import { onMount } from "svelte";
  import {ethersService, formService, socketService} from "services";
  import {FormFieldComponent} from "ui";
    import { getAddress } from "ethers";
    import { ethersStore } from "stores";

  const formStore = formService.create({
    name: ["", "name"],
    password: ["", "password"]
  });

  let checked = false;
  let view = "password";

  let isPasswordVisible = false;

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
    // const accounts = await window.ethereum.request({
    //   method: "eth_requestAccounts"
    // });

    socketService.socket.emit("getNonce", {
      // address: getAddress(accounts[0])
      address: $ethersStore.signer?.address as any
    });
  };

  onMount(async () => {
    // await ethersService.init();
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
</script>

<style>
  button img {
    display: inline;
    margin-right: var(--spacing-md);
  }

  .alt-auth {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
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
    <form on:submit|preventDefault="{onSubmit}">
      <div>Password signin</div>
      <FormFieldComponent
        label="Name"
        error="{$formStore.fields.name.error}"
        bind:value="{$formStore.fields.name.value}"
        on:input="{onInput}"/>

      <FormFieldComponent
        label="Password"
        type="{isPasswordVisible ? "text" : "password"}"
        error="{$formStore.fields.password.error}"
        action="{[isPasswordVisible ? "HIDE" : "SHOW", onTogglePasswordVisible]}"
        bind:value="{$formStore.fields.password.value}"
        on:input="{onInput}"/>

      <FormFieldComponent
        label="Remember me"
        type="checkbox"
        bind:checked/>

      <div class="form__submit">
        <button class="button" disabled="{$formStore.isDisabled}">SIGNIN</button>
      </div>
    </form>

    <div class="floating">
      <div class="floating__bar"></div>
      <div class="floating__or">OR</div>
      <div class="floating__bar"></div>
    </div>

    <div class="alt-auth">
      <button class="button" on:click="{() => view = "metamask"}">
        <img src="assets/icons/metamask.png" alt="Metamask"/> METAMASK
      </button>
    </div>
  {:else}
    <form on:submit|preventDefault="{onMetamask}">
      <div>Metamask signin</div>

      <FormFieldComponent
        label="Address"
        value="{$ethersStore.signer?.address}"
        disabled/>

      <FormFieldComponent
        label="Remember me"
        type="checkbox"
        bind:checked/>

      <div class="form__submit">
        <button class="button" disabled="{$formStore.isDisabled}">SIGNIN</button>
      </div>
    </form>

    <div class="floating">
      <div class="floating__bar"></div>
      <div class="floating__or">OR</div>
      <div class="floating__bar"></div>
    </div>

    <div class="alt-auth">
      <button class="button" on:click="{() => view = "password"}">
        PASSWORD
      </button>
    </div>
  {/if}

</div>
