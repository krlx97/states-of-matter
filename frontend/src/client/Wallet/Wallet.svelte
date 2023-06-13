<script lang="ts">
  import { ethersService } from "services";
  import Chests from "./Chests/Chests.svelte";
  import Currencies from "./Currencies/Currencies.svelte";
  import Shards from "./Shards/Shards.svelte";
  import Skins from "./Skins/Skins.svelte";
    import { accountStore, playerStore, tutorialStore, walletStore } from "stores";
    import { CurrencyComponent, TutorialComponent } from "ui";
    import WalletTutorial1 from "./Tutorial/WalletTutorial1.svelte";
    import WalletTutorial2 from "./Tutorial/WalletTutorial2.svelte";
    import WalletTutorial3 from "./Tutorial/WalletTutorial3.svelte";
    import BindMetamask from "../../auth/BindMetamask.svelte";

  $: isTutorial = $tutorialStore.name === "wallet" && $tutorialStore.currentStep === 1;
  $: isTutorial2 = $tutorialStore.name === "wallet" && $tutorialStore.currentStep === 2;

  const views = [
    {name: "Chests", component: Chests},
    {name: "Shards", component: Shards},
    {name: "Skins", component: Skins}
  ];

  let currentView = views[0];
  let isLoading = false;

  const onClaimStarterPack = async (): Promise<void> => {
    isLoading = true;

    const isConfirmed = await ethersService.transact("game", "claimStarterPack", []);
    if (!isConfirmed) {
      isLoading = false;
      return;
    }

    await ethersService.loadUser();
    isLoading = false;
  };
</script>

<style>
  .wallet-wrapper {
height: 100%;
width: 100%; 
display: flex;
    align-items: center;
    justify-content: center;
    }
  .wallet {
    /* height: 100%;
    width: 100%; */
    display: flex;
/* border: 1px solid red;
box-sizing: border-box; */
    /* flex-direction: column; */
  }
  .wallet__currencies {
    padding: var(--spacing-md);
height: 700px;
/* border: 1px solid blue; */
box-sizing: border-box;
    display: flex;
flex-direction: column;
justify-content: center;
gap: var(--spacing-md);
border-top-width: 0;
    border-right-width: 1px;
    border-bottom-width: 0;
    border-left-width: 0;
    border-style: solid;
    border-image: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(31,31,31,1) 5%, rgba(255,255,255,1) 50%, rgba(31,31,31,1) 95%, rgba(255,255,255,0) 100%) 1;
    
  }
  .wallet__views {
    flex-grow: 1;
/* border: 1px solid green;
box-sizing: border-box; */
  }
  .wallet__content {
    width: 100%;
    flex-grow: 1;
  }

.isTutorial, .isTutorial2 {
    position: relative;
    z-index: 101;
  }
</style>

{#if $accountStore.publicKey}
  <div class="wallet-wrapper">
    <div class="wallet">
      <div class="wallet__currencies" class:isTutorial>
        <Currencies/>
        <table>
          <tr>
            <td>ALLOWANCE</td>
            <td><CurrencyComponent name="crystals" number={$walletStore.allowance}/></td>
          </tr>
          <tr>
            <td>APPROVED</td>
            <td>{$walletStore.isApprovedForAll ? "Yes" : "No"}</td>
          </tr>
        </table>
        {#if isLoading}
          <div class="modal__submit">
            <i class="fa-solid fa-circle-notch fa-2x fa-spin"></i>
          </div>
        {:else}
          {#if !$walletStore.crystals.starterPack}
            <div class="modal__submit">
              <button on:click={onClaimStarterPack}>STARTER PACK</button>
            </div>
          {/if}
        {/if}
      </div>
      <div class="wallet__views" class:isTutorial2>
        <div class="links">
          {#each views as view}
            <div
              class="link"
              class:linkActive={view.name === currentView.name}
              on:click={() => currentView = view}
              on:keypress={() => currentView = view}
            >
              {view.name}
            </div>
          {/each}
        </div>

        <div class="wallet__content">
          <svelte:component this={currentView.component}/>
        </div>
      </div>
    </div>
  </div>

  {#if !$playerStore.tutorial.wallet}
    <TutorialComponent tutorial="wallet" steps={[{
      position: "top: 50%; left: 50%; transform: translate(-50%, -50%)",
      component: WalletTutorial1
    }, {
      position: "top: 246px; left: 610px;",
      component: WalletTutorial2
    }, {
      position: "top: 142px; left: 1260px;",
      component: WalletTutorial3
    }]}/>
  {/if}
{:else}
  <BindMetamask/>
{/if}
