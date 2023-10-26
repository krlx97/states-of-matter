<script lang="ts">
  import { onMount } from "svelte";
  import {OreId} from "oreid-js";
  import {WebPopup} from "oreid-webpopup";
  import {formService, socketService} from "services";
  import {FormFieldComponent} from "ui";

  const oreId = new OreId({
    appName: "States of Matter",
    appId: "t_3766635213fb4d6381310c7bd965fc1e",
    plugins: {
      popup: WebPopup()
    }
  });

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

  const onSubmit = (): void => {
    socketService.socket.emit("signin", {
      name: $formStore.fields.name.value,
      password: $formStore.fields.password.value
    });
  };

  const onGoogleAuth = async (): Promise<void> => {
    await oreId.popup.auth({
      provider: "google"
    });
    const userData = await oreId.auth.user.getData();
    console.log(`Hello ${userData.name}`);
    console.log(`Your blockchain accounts are: ${userData.chainAccounts}`);
  };

  onMount(async () => {
    await oreId.init();
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
    margin: var(--spacing-md) 0;
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

  <form on:submit|preventDefault="{onSubmit}">
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
    <button class="button" on:click="{onGoogleAuth}">
      <img src="assets/icons/google.png" alt="Google"/> GOOGLE
    </button>
    <button class="button">
      <img src="assets/icons/metamask.png" alt="Metamask"/> METAMASK
    </button>
  </div>

</div>
