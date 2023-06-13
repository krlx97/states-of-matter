<script lang="ts">
  import {fly, slide, type FlyParams} from "svelte/transition";
  import {ethersService, modalService} from "services";
  import {walletStore} from "stores";
  import {CurrencyComponent} from "ui";
  import Claim from "./modals/Claim/Claim.svelte";
  import ExploreCrystals from "./modals/ExploreCrystals.svelte";
  import ExploreEssence from "./modals/ExploreEssence.svelte";
  import Stake from "./modals/Stake.svelte";
  import TransferCrystal from "./modals/TransferCrystal.svelte";
  import Unstake from "./modals/Unstake.svelte";

  let areBtnsToggled = false;
  let areBtnsToggled2 = false;
  const flyParams: FlyParams = {
    y: -8,
    duration: 225,
    opacity: 0
  };

  const onExploreCrystals = (): void => {
    modalService.open(ExploreCrystals);
  };

  const onTransferCrystal = (): void => {
    modalService.open(TransferCrystal);
  };

  const onStake = (): void => {
    modalService.open(Stake);
  };

  const onUnstake = (): void => {
    modalService.open(Unstake);
  };

  const onClaim = (): void => {
    modalService.open(Claim);
  };

  const onExploreEssence = (): void => {
    modalService.open(ExploreEssence);
  };

  const onAddToMetamask = async () => {
    await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: ethersService.keys.currency,
          symbol: "ECR",
          decimals: 18,
          image: "https://cdn.discordapp.com/attachments/804019178611933234/1089583533204447344/coin1.1.png",
        },
      },
    });
  };
</script>

<style>
  .tokens {
    width: 352px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--spacing-md);
  }

  .token {
    position: relative;
    padding: var(--spacing-md);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    box-sizing: border-box;
    border: 1px solid;
    border-right-width: 0;
    border-left-width: 0;
    border-image: linear-gradient(
      90deg,
      rgba(63,63,63,1) 0%,
      rgba(255,255,255,1) 50%,
      rgba(63,63,63,1) 100%
    ) 1;
    background: linear-gradient(
      180deg,
      rgba(179, 105, 244, 0.1) 0%,
      rgba(0, 0, 0, 0) 50%,
      rgba(179, 105, 244, 0.1) 100%
    );
  }

  .token__header {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }

  .token__header__title {
    flex-grow: 1;
    font-size: var(--font-lg);
    font-weight: bold;
  }
</style>

<div class="tokens">
  <div class="token">
    <div class="token__header">
      <img src="assets/currencies/crystal.png" on:click={onAddToMetamask} alt="X"/>
      <div class="token__header__title">Etheric Crystals</div>
      <button class="button--icon token__header__more" on:click={() => areBtnsToggled = !areBtnsToggled}>
        <i class="fa-solid fa-chevron-down chevron"></i>
      </button>
    </div>
    <div>
      <table>
        <tr>
          <td>BALANCE</td>
          <td><CurrencyComponent name="crystals" number={$walletStore.crystals.balance}/></td>
        </tr>
        <tr>
          <td>STAKED</td>
          <td><CurrencyComponent name="crystals" number={$walletStore.crystals.staked}/></td>
        </tr>
        <tr>
          <td>UNSTAKED</td>
          <td><CurrencyComponent name="crystals" number={$walletStore.crystals.unstaked}/></td>
        </tr>
        <tr>
          <td>REWARDS</td>
          <td><CurrencyComponent name="crystals" number={$walletStore.crystals.rewards}/></td>
        </tr>
        <tr>
          <td>LIQUIDITY</td>
          <td><CurrencyComponent name="crystals" number={$walletStore.crystals.liquidity}/></td>
        </tr>
        <br/>
        <tr>
          <td>AIRDROPS</td>
          <td>{$walletStore.crystals.airdrops}</td>
        </tr>
      </table>
    </div>
    {#if areBtnsToggled}
      <div class="menu" transition:slide>
        <button class="menu__link" on:click={onExploreCrystals}>EXPLORE</button>
        <button class="menu__link" on:click={onTransferCrystal}>TRANSFER</button>
        <button class="menu__link" on:click={onStake}>STAKE</button>
        <button class="menu__link" on:click={onUnstake}>UNSTAKE</button>
        <button class="menu__link" on:click={onClaim}>CLAIM</button>
      </div>
    {/if}
  </div>

  <div class="token">
    <div class="token__header">
      <img src="assets/currencies/essence.png" alt="Essence" height=64 width=64/>
      <div class="token__header__title">Etheric Essence</div>
      <button class="button--icon token__header__more" on:click={() => areBtnsToggled2 = !areBtnsToggled2}>
        <i class="fa-solid fa-chevron-down chevron"></i>
      </button>
    </div>
    <div>
      <table>
        <tr>
          <td>BALANCE</td>
          <td>{$walletStore.essence.balance}</td>
        </tr>
      </table>
    </div>
    {#if areBtnsToggled2}
      <div class="menu" transition:fly={flyParams}>
        <button class="menu__link" on:click={onExploreEssence}>EXPLORE</button>
      </div>
    {/if}
  </div>
</div>
