<script lang="ts">
  import {onDestroy, onMount} from "svelte";
  import {ethersService, socketService} from "services";
  import {ethersStore} from "stores";
  import {ButtonComponent, TextComponent} from "ui";
  import type { Unsubscriber } from "svelte/store";

  const {ethereum} = window;

  const onSelectNetwork = async (): Promise<void> => {
    if (!ethereum) { return; }

    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{
          chainId: "0x29"
        }],
      });
    } catch (switchError: any) {
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
    const accounts = await ethereum?.request({
      method: "eth_requestAccounts"
    });

    $ethersStore.accounts = accounts;
  };

  onMount(async (): Promise<void> => {
    if (ethereum) {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts"
      });

      $ethersStore.accounts = accounts;
    }
  });
</script>

<style>
  .signin__steps {
    margin: 1em 0;
    display: flex;
    flex-direction: column;
    gap: var(--md);
  }

  .signin__step {
    display: flex;
    flex-direction: column;
    gap: var(--md);
  }

  .signin__step__title {
    font-size: var(--font-lg);
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
        <ButtonComponent>
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
        <ButtonComponent on:click="{onConnectMetamask}">
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
        <ButtonComponent on:click="{onSelectNetwork}">
          <img src="images/telosevm.png" alt="Telos EVM" height="32" width="32"/> TELOS EVM
        </ButtonComponent>
      </div>
    {/if}

  </div>

</div>
