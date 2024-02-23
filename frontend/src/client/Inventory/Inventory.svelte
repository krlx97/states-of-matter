<script lang="ts">
  import {getAddress} from "ethers";
  import {ethersStore, playerStore, tutorialStore} from "stores";
  import {ButtonComponent, TextComponent, TutorialComponent} from "ui";
  import CurrenciesComponent from "./Coins/Coins.svelte";
  import ItemsComponent from "./Items/Items.svelte";
  import WalletTutorial1 from "./Tutorial/WalletTutorial1.svelte";
  import WalletTutorial2 from "./Tutorial/WalletTutorial2.svelte";
  import WalletTutorial3 from "./Tutorial/WalletTutorial3.svelte";
  import WalletTutorial4 from "./Tutorial/WalletTutorial4.svelte";
  import Rewards from "./RewardsHub/RewardsHub.svelte";
    import { fade } from "svelte/transition";
    import { quadInOut } from "svelte/easing";

  const isInventoryTutorial = $tutorialStore.name === "inventory";

  const steps = [{
    position: "top: 50%; left: 50%; transform: translate(-50%, -50%)",
    component: WalletTutorial1
  }, {
    position: "top: 246px; left: 490px;",
    component: WalletTutorial2
  }, {
    position: "top: 266px; left: 1274px;",
    component: WalletTutorial3
  }, {
    position: "top: 266px; left: 900px;",
    component: WalletTutorial4
  }];

  $: isTutorial = isInventoryTutorial && $tutorialStore.currentStep === 1;
  $: isTutorial2 = isInventoryTutorial && $tutorialStore.currentStep === 2;
  $: isTutorial3 = isInventoryTutorial && $tutorialStore.currentStep === 3;

  const onTelosEvm = async (): Promise<void> => {
    const {ethereum} = window;
    if (!ethereum) { return; }

    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{
          chainId: "0x29"
        }]
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
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
            blockExplorerUrls: ["https://testnet.teloscan.io"]
          }]
        });
      }
    }
  };

  const onConnect = async (): Promise<void> => {
    const {ethereum} = window;
    if (!ethereum) { return; }
    const revoke = await ethereum.request({
      method: "wallet_revokePermissions",
      params: [{
        eth_accounts: {}
      }]
    });

    console.log(revoke);
    const accounts = await ethereum.request({
      method: "eth_requestAccounts"
    });

    console.log(accounts);
  };
</script>

<style>
  .inventory {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
  }

  .inventory__main {
    width: 100%;
    padding: var(--md);
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    background-color: rgba(var(--dark-grey), 0.666);
    /*backdrop-filter: blur(var(--md)); */
    border: 0 solid;
    border-bottom-width: 1px;
    border-image: linear-gradient(
      90deg,
      rgba(var(--dark-grey), 0) 0%,
      rgba(var(--grey), 0.333) 50%,
      rgba(var(--dark-grey), 0) 100%
    ) 1;
    box-sizing: border-box;
  }

  .metamask-error {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--xl);
    text-align: center;
  }

  .isTutorial, .isTutorial2, .isTutorial3 {
    position: relative;
    z-index: 101;
    animation: opa 800ms linear infinite alternate;
  }

  @keyframes opa {
   from {opacity: 0.5;}
    to {opacity: 1;}
  }
</style>

{#if $ethersStore.isLoaded}
  {#if
    !$playerStore.address ||
    ($playerStore.address && $ethersStore.chainId === 41n && $ethersStore.accounts.includes($playerStore.address.toLowerCase()))}
    <div class="inventory">
      <div class="inventory__main">
        <div class:isTutorial>
          <CurrenciesComponent/>
        </div>
        <div class:isTutorial3>
          <Rewards/>
        </div>
      </div>
      <div class:isTutorial2 class="inventory__items">
        <ItemsComponent/>
      </div>
    </div>

    {#if !$playerStore.tutorial.inventory}
      <TutorialComponent tutorial="inventory" {steps}/>
    {/if}
  {:else if $playerStore.address && $ethersStore.chainId !== 41n}
    <div class="metamask-error">
      <div>
        Wrong network selected, please switch to TelosEVM.
      </div>
      <ButtonComponent on:click="{onTelosEvm}">
        <img
          src="images/telosevm.png"
          alt="TelosEVM"
          style="margin-right: var(--xs)"/>
        TelosEVM
      </ButtonComponent>
    </div>
  {:else if $playerStore.address && !$ethersStore.accounts.includes(getAddress($playerStore.address))}
    <div class="metamask-error">
      <div>
        <TextComponent isBold color="primary" size="xl">{getAddress($playerStore.address)}</TextComponent><br/><br/>
        Please connect the game address listed above through metamask.
      </div>
        <ButtonComponent on:click="{onConnect}">
          <img
            src="images/metamask.png"
            alt="Metamask"
            style="margin-right: var(--xs)"/>
          Metamask
        </ButtonComponent>
    </div>
  {/if}
{:else}
  <div class="metamask-error">
    <div>Please wait...</div>
    <i class="fa-solid fa-circle-notch fa-spin fa-4x"></i>
  </div>
{/if}
