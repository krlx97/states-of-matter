<script lang="ts">
  import {playerStore, tutorialStore} from "stores";
  import {TutorialComponent} from "ui";
  import CurrenciesComponent from "./Coins/Coins.svelte";
  import ItemsComponent from "./Items/Items.svelte";
  import WalletTutorial1 from "./Tutorial/WalletTutorial1.svelte";
  import WalletTutorial2 from "./Tutorial/WalletTutorial2.svelte";
  import WalletTutorial3 from "./Tutorial/WalletTutorial3.svelte";
  import WalletTutorial4 from "./Tutorial/WalletTutorial4.svelte";
  import Rewards from "./Rewards/Rewards.svelte";
    import Chest from "./Chest/Chest.svelte";

  $: isTutorial = $tutorialStore.name === "inventory" && $tutorialStore.currentStep === 1;
  $: isTutorial2 = $tutorialStore.name === "inventory" && $tutorialStore.currentStep === 2;
  $: isTutorial3 = $tutorialStore.name === "inventory" && $tutorialStore.currentStep === 3;

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

<div class="inventory">
  <div class="inventory__main">
    <Chest/>
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
