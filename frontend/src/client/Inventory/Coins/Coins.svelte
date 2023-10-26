<script lang="ts">
  import {modalService} from "services";
  import CoinComopnent from "./Coin.svelte";
  import Claim from "./modals/Claim/Claim.svelte";
  import ExploreCrystals from "./modals/ExploreCrystals.svelte";
  import ExploreEssence from "./modals/ExploreEssence.svelte";
  import Stake from "./modals/Stake.svelte";
  import TransferComponent from "./modals/Transfer.svelte";
  import Unstake from "./modals/Unstake.svelte";
  import SwapComponent from "./modals/Swap.svelte";
  import RemoveLiquidity from "./modals/RemoveLiquidity.svelte";
  import AddLiquidity from "./modals/AddLiquidity.svelte";
  import ExploreWrappedTelos from "./modals/ExploreWrappedTelos.svelte";
  import Wrap from "./modals/Wrap.svelte";
  import Unwrap from "./modals/Unwrap.svelte";
  import ExploreLpecr from "./modals/ExploreLpecr.svelte";

  const onExploreCrystals = (): void => {
    modalService.open(ExploreCrystals);
  };

  const onExploreWtlos = (): void => {
    modalService.open(ExploreWrappedTelos);
  };

  const onTransferEcr = (): void => {
    modalService.open(TransferComponent, {id: 1n});
  };

  const onTransferWtlos = (): void => {
    modalService.open(TransferComponent, {id: 2n});
  };

  const onTransferLpecr = (): void => {
    modalService.open(TransferComponent, {id: 3n});
  };

  const onStakeEcr = (): void => {
    modalService.open(Stake, {id: 1n});
  };

  const onStakeLpecr = (): void => {
    modalService.open(Stake, {id: 3n});
  };

  const onUnstakeEcr = (): void => {
    modalService.open(Unstake, {id: 1n});
  };

  const onUnstakeLpecr = (): void => {
    modalService.open(Unstake, {id: 3n});
  };

  const onClaim = (): void => {
    modalService.open(Claim);
  };

  const onExploreEssence = (): void => {
    modalService.open(ExploreEssence);
  };

  const onExploreLpecr = (): void => {
    modalService.open(ExploreLpecr);
  };

  const onSwap = (): void => {
    modalService.open(SwapComponent);
  };

  const onAddLiquidity = (): void => {
    modalService.open(AddLiquidity);
  };

  const onRemoveLiquidity = (): void => {
    modalService.open(RemoveLiquidity);
  };

  const onWrap = (): void => {
    modalService.open(Wrap);
  };

  const onUnwrap = (): void => {
    modalService.open(Unwrap);
  };

  const coins = [{
    name: "Etheric Essence",
    ticker: "ese",
    menuItems: [["EXPLORE", onExploreEssence]]
  }, {
    name: "Etheric Crystals",
    ticker: "ecr",
    menuItems: [
      ["EXPLORE", onExploreCrystals],
      ["TRANSFER", onTransferEcr],
      ["STAKE", onStakeEcr],
      ["UNSTAKE", onUnstakeEcr],
      ["CLAIM", onClaim]
    ]
  }, {
    name: "Etheric Telos",
    ticker: "wtlos",
    menuItems: [
      ["EXPLORE", onExploreWtlos],
      ["TRANSFER", onTransferWtlos],
      ["WRAP", onWrap],
      ["UNWRAP", onUnwrap]
    ]
  }, {
    name: "Etheric Energy",
    ticker: "lpecr",
    menuItems: [
      ["EXPLORE", onExploreLpecr],
      ["TRANSFER", onTransferLpecr],
      ["STAKE", onStakeLpecr],
      ["UNSTAKE", onUnstakeLpecr],
      ["SWAP", onSwap],
      ["ADD", onAddLiquidity],
      ["REMOVE", onRemoveLiquidity]
    ]
  }];
</script>

<style>
  .coins {
    display: flex;
    gap: var(--spacing-md);
    justify-content: center;
  }
</style>

<div class="coins">
  {#each coins as coin}
    <CoinComopnent {coin}/>
  {/each}
</div>
