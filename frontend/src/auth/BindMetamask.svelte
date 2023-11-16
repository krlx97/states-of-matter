<script lang="ts">
  import {onDestroy, onMount} from "svelte";
  import {ethersService, socketService} from "services";
  import {ethersStore} from "stores";
  import type { Unsubscriber } from "svelte/store";

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
      stepValid.three = store.chainId === 41n;
    });

    stepValid.one = window.ethereum !== undefined;
    stepValid.two = $ethersStore.signer?.address !== undefined;
    stepValid.three = $ethersStore.chainId === 41n;
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
    gap: var(--spacing-md);
    /* text-align: justify; */
  }

  .signin__step {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    /* padding: var(--spacing-md) 0; */
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
    /* margin-bottom: var(--spacing-md); */
  }

  .signin__step__info {
    line-height: 1.4;
    text-align: justify;
  }

  .a {
    text-decoration: none;
    color: white;
  }
</style>

<div class="signin__steps">

  <div class="signin__step">
    <div
      class="signin__step__title"
      class:green="{stepValid.one}"
      class:lt-red="{!stepValid.one}">
      Install metamask <b>{stepValid.one ? "✔" : "X"}</b>
    </div>
    {#if !stepValid.one}
      <a class="a" href="https://metamask.io/" target="_blank">
        <button class="button">
          <img src="assets/icons/metamask.png" alt="Metamask"/> METAMASK.IO
        </button>
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
        <button class="button" on:click={onConnectMetamask}>
          CONNECT
        </button>
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
        <button class="button" on:click={onSelectNetwork}>
          <img src="assets/icons/telosevm.png" alt="Telos EVM"/>TELOS EVM
        </button>
      </div>
    {/if}
  </div>

</div>
