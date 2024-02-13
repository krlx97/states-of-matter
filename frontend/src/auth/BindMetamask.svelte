<script lang="ts">
  import {onDestroy, onMount} from "svelte";
  import {ethersService, socketService} from "services";
  import {bindStepsStore, ethersStore} from "stores";
  import {ButtonComponent, TextComponent} from "ui";
  import type { Unsubscriber } from "svelte/store";

  const {ethereum} = window;

  // const $bindStepsStore = {
  //   one: false,
  //   two: false,
  //   three: true
  // };

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

    $ethersStore.accounts = accounts;
  };

  // let unsub: Unsubscriber;

  onMount(async (): Promise<void> => {
    // unsub = ethersStore.subscribe((store): void => {
    //   $bindStepsStore.one = window.ethereum !== undefined;
    //   $bindStepsStore.two = store.signer?.address !== undefined;
    //   $bindStepsStore.three = store.chainId === /*1337n*/41n;
    // });

    // $bindStepsStore.one = window.ethereum !== undefined;
    // $bindStepsStore.two = $ethersStore.signer?.address !== undefined;
    // $bindStepsStore.three = $ethersStore.chainId === /*1337n*/41n;

    if (ethereum) {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts"
      });

      $ethersStore.accounts = accounts;
    }
  });

  // onDestroy((): void => {
  //   unsub();
  // });
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
      <TextComponent color="{window.ethereum !== undefined ? "success" : "warn"}">
        Install metamask <b>{window.ethereum !== undefined ? "✔" : "X"}</b>
      </TextComponent>
    </div>

    {#if window.ethereum === undefined}
      <a class="a" href="https://metamask.io/" target="_blank">
        <ButtonComponent type="button">
          <img src="images/metamask.png" alt="Metamask" height="32" width="32"/>
          METAMASK.IO
        </ButtonComponent>
      </a>
    {/if}

  </div>



  <div class="signin__step">

    <div class="signin__step__title">
      <TextComponent color="{$ethersStore.accounts.length ? "success" : "warn"}">
        Connect metamask <b>{$ethersStore.accounts.length ? "✔" : "X"}</b>
      </TextComponent>
    </div>

    {#if window.ethereum !== undefined && !$ethersStore.accounts.length}
      <div>
        <ButtonComponent type="button" on:click="{onConnectMetamask}">
          CONNECT
        </ButtonComponent>
      </div>
    {/if}

  </div>



  <div class="signin__step">

    <div class="signin__step__title">
      <TextComponent color="{$ethersStore.chainId === 41n ? "success" : "warn"}">
        Select Telos EVM Test network <b>{$ethersStore.chainId === 41n ? "✔" : "X"}</b>
      </TextComponent>
    </div>

    {#if window.ethereum !== undefined && $ethersStore.accounts.length && $ethersStore.chainId !== 41n}
      <div>
        <ButtonComponent type="button" on:click="{onSelectNetwork}">
          <img src="images/telosevm.png" alt="Telos EVM" height="32" width="32"/> TELOS EVM
        </ButtonComponent>
      </div>
    {/if}

  </div>

</div>
