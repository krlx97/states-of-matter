<script lang="ts">
  import {modalService} from "services";
  import {ethersStore, playerStore, tutorialStore} from "stores";
  import {ButtonComponent, TutorialComponent} from "ui";
  import CurrenciesComponent from "./Coins/Coins.svelte";
  import ItemsComponent from "./Items/Items.svelte";
  import WalletTutorial1 from "./Tutorial/WalletTutorial1.svelte";
  import WalletTutorial2 from "./Tutorial/WalletTutorial2.svelte";
  import WalletTutorial3 from "./Tutorial/WalletTutorial3.svelte";
  import WalletTutorial4 from "./Tutorial/WalletTutorial4.svelte";
  import Rewards from "./Rewards/Rewards.svelte";
  import ApprovalsComponent from "./Approvals.svelte";
  import UnlockComponent from "./Chest/modals/Unlock.svelte";
    import { getAddress, isAddress } from "ethers";
    import { onMount } from "svelte";

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

  const onApprovals = (): void => {
    modalService.open(ApprovalsComponent);
  };

  const onRandomItem = (): void => {
    modalService.open(UnlockComponent);
  };

  onMount(() => {
    console.log($playerStore.address, $ethersStore.chainId, $ethersStore.accounts, $ethersStore.accounts.includes($playerStore.address.toLowerCase()));
  });
</script>

<style>
  .inventory {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--md);
  }

  .inventory__main {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly
  }

  .isTutorial, .isTutorial2, .isTutorial3 {
    position: relative;
    z-index: 101;
    animation: opa 800ms linear infinite alternate
  }
  @keyframes opa {
   from {opacity: 0.5}
    to {opacity: 1}
  }
</style>

{#if $ethersStore.isLoaded}
  {#if
    !$playerStore.address ||
    ($playerStore.address && $ethersStore.chainId === 41n && $ethersStore.accounts.includes($playerStore.address.toLowerCase()))}
    <div class="inventory">
      <div class="inventory__main">
        <div>
          <ButtonComponent on:click={onApprovals}>APPROVALS</ButtonComponent>
          <ButtonComponent on:click={onRandomItem}>RANDOM ITEM</ButtonComponent>
        </div>

        <div class:isTutorial>
          <CurrenciesComponent/>
        </div>
        <div class:isTutorial3>
          <Rewards/>
        </div>
      </div>
      <div class:isTutorial2>
        <ItemsComponent/>
      </div>
    </div>

    {#if !$playerStore.tutorial.inventory}
      <TutorialComponent tutorial="inventory" {steps}/>
    {/if}
  {:else if $playerStore.address && ($ethersStore.chainId !== 41n || !$ethersStore.accounts.includes(getAddress($playerStore.address)))}
    Wrong network / address selected.
  {/if}
{:else}
  Loading...
{/if}
