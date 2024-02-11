<script lang="ts">
  import {onDestroy, onMount} from "svelte";
  import {ethersService, socketService} from "services";
  import {ethersStore} from "stores";
  import type { Unsubscriber } from "svelte/store";
  import {ButtonComponent, TextComponent} from "ui";

  const {ethereum} = window;

  const stepValid = {
    one: false,
    two: false,
    three: true
  };

  const onSelectNetwork = async (): Promise<void> => {
    if (!ethereum) { return; }

    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{
          chainId: "0x29"
        }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: "0x29",
              rpcUrls: ["https://testnet.telos.net/evm"],
              chainName: "Telos Testnet",
              nativeCurrency: {
                name: "TLOS",
                symbol: "TLOS",
                decimals: 18
              },
              blockExplorerUrls: ["https://teloscan.io/"]
            }]
          });
        } catch (addError) {}
      }
    }
  };

  const onConnectMetamask = async (): Promise<void> => {
    const accounts = await ethereum.request({
      method: "eth_requestAccounts"
    });
  };

  let unsub: Unsubscriber;

  onMount(async (): Promise<void> => {
    unsub = ethersStore.subscribe((store): void => {
      stepValid.one = window.ethereum !== undefined;
      stepValid.two = store.signer?.address !== undefined;
      stepValid.three = store.chainId === /*1337n*/41n;
    });

    stepValid.one = window.ethereum !== undefined;
    stepValid.two = true;
    // stepValid.two = $ethersStore.signer?.address !== undefined;
    stepValid.three = $ethersStore.chainId === /*1337n*/41n;
  });

  onDestroy((): void => {
    unsub();
  });
</script>

<style>
  .signin__steps {
    margin: 1em 0;
    display: flex;
    flex-direction: column;
    gap: var(--md);
    /* text-align: justify; */
  }

  .signin__step {
    display: flex;
    flex-direction: column;
    gap: var(--md);
    /* padding: var(--md) 0; */
/* border: 0 solid;
    border-bottom-width: 1px;
    border-image: linear-gradient(
      90deg,
      rgba(31, 31, 31, 1) 0%,
      rgba(255, 255, 255, 1) 50%,
      rgba(31, 31, 31, 1) 100%
    ) 1; */
  }

  .signin__step__title {
    font-size: var(--font-lg);
    /* margin-bottom: var(--md); */
  }

  .signin__step__info {
    line-height: 1.25;
    text-align: justify;
  }

  .a {
    text-decoration: none;
    color: white;
  }
</style>

<div class="signin__steps">

  <div class="signin__step">
    <div class="signin__step__title">
      <TextComponent color="{stepValid.one ? "success" : "warn"}">
        Install metamask <b>{stepValid.one ? "✔" : "X"}</b>
      </TextComponent>
    </div>
    {#if !stepValid.one}
      <a class="a" href="https://metamask.io/" target="_blank">
        <ButtonComponent>
          <img src="images/metamask.png" alt="Metamask" height="32" width="32"/> METAMASK.IO
        </ButtonComponent>
      </a>
      Refresh this page after installation.
    {/if}
  </div>

  <div class="signin__step">
    <div class="signin__step__title">
      <span class:green={stepValid.two} class:lt-red={!stepValid.two}>
        Connect metamask <b>{stepValid.two ? "✔" : "X"}</b>
      </span>
    </div>
    {#if stepValid.one && !stepValid.two}
      <div>
        <ButtonComponent on:click={onConnectMetamask}>
          CONNECT
        </ButtonComponent>
      </div>
    {/if}
  </div>

  <div class="signin__step">
    <div class="signin__step__title">
      <span class:green={stepValid.three} class:lt-red={!stepValid.three}>
        Select Telos EVM network <b>{stepValid.three ? "✔" : "X"}</b>
      </span>
    </div>
    {#if stepValid.one && stepValid.two && !stepValid.three}
      <div>
        <ButtonComponent on:click={onSelectNetwork}>
          <img src="images/telosevm.png" alt="Telos EVM" height="32" width="32"/>TELOS EVM
        </ButtonComponent>
      </div>
    {/if}
  </div>

</div>
