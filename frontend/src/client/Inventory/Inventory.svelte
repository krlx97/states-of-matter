<script lang="ts">
  import {ethersService} from "services";
  import {accountStore, playerStore, tutorialStore} from "stores";
  import {TutorialComponent} from "ui";
  import CurrenciesComponent from "./Coins/Coins.svelte";
  import ItemsComponent from "./Items/Items.svelte";
  import WalletTutorial1 from "./Tutorial/WalletTutorial1.svelte";
  import WalletTutorial2 from "./Tutorial/WalletTutorial2.svelte";
  import WalletTutorial3 from "./Tutorial/WalletTutorial3.svelte";
  import BindMetamask from "../../auth/BindMetamask.svelte";

  $: isTutorial = $tutorialStore.name === "wallet" && $tutorialStore.currentStep === 1;
  $: isTutorial2 = $tutorialStore.name === "wallet" && $tutorialStore.currentStep === 2;

  let isLoading = false;

  const steps = [{
    position: "top: 50%; left: 50%; transform: translate(-50%, -50%)",
    component: WalletTutorial1
  }, {
    position: "top: 246px; left: 610px;",
    component: WalletTutorial2
  }, {
    position: "top: 142px; left: 1260px;",
    component: WalletTutorial3
  }];

  const onClaimStarterPack = async (): Promise<void> => {
    isLoading = true;

    const isConfirmed = await ethersService.transact("somGame", "claimStarterPack", []);
    if (!isConfirmed) {
      isLoading = false;
      return;
    }

    await ethersService.reloadUser();
    isLoading = false;
  };
</script>

<style>
  .wallet {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-md);
  }

  .isTutorial, .isTutorial2 {
    position: relative;
    z-index: 101;
  }
</style>

{#if $accountStore.publicKey}
  <div class="wallet">
    <div class:isTutorial>
      <CurrenciesComponent/>
    </div>
    <div class:isTutorial2>
      <ItemsComponent/>
    </div>
  </div>

  {#if !$playerStore.tutorial.inventory}
    <TutorialComponent tutorial="inventory" {steps}/>
  {/if}
{:else}
  <BindMetamask/>
{/if}
