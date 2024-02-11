<script lang="ts">
  import {modalService, soundService} from "services";
  import CoinComopnent from "./Coin.svelte";
  import EnergizeComponent from "./modals/Energize.svelte";
  import ExploreCrystalsComponent from "./modals/ExploreCrystals.svelte";
  import ExploreEnergyComponent from "./modals/ExploreEnergy.svelte";
  import ExploreEssenceComponent from "./modals/ExploreEssence.svelte";
  import SolidifyComponent from "./modals/Solidify.svelte";
  import TransferComponent from "./modals/Transfer.svelte";

  const onExploreCrystals = (): void => {
    modalService.open(ExploreCrystalsComponent);
    soundService.play("click");
  };

  const onExploreEnergy = (): void => {
    modalService.open(ExploreEnergyComponent);
    soundService.play("click");
  };

  const onExploreEssence = (): void => {
    modalService.open(ExploreEssenceComponent);
    soundService.play("click");
  };

  const onEnergize = (): void => {
    modalService.open(EnergizeComponent);
    soundService.play("click");
  };

  const onSolidify = (): void => {
    modalService.open(SolidifyComponent);
    soundService.play("click");
  };

  const onTransferCrystals = (): void => {
    modalService.open(TransferComponent, {id: 1n});
    soundService.play("click");
  };

  const onTransferEnergy = (): void => {
    modalService.open(TransferComponent, {id: 2n});
    soundService.play("click");
  };

  const coins = [{
    name: "Etheric Essence",
    ticker: "ees",
    menuItems: [["EXPLORE", onExploreEssence]]
  }, {
    name: "Etheric Crystals",
    ticker: "ecr",
    menuItems: [
      ["EXPLORE", onExploreCrystals],
      ["TRANSFER", onTransferCrystals],
      ["ENERGIZE", onEnergize]
    ]
  }, {
    name: "Etheric Energy",
    ticker: "enrg",
    menuItems: [
      ["EXPLORE", onExploreEnergy],
      ["TRANSFER", onTransferEnergy],
      ["SOLIDIFY", onSolidify]
    ]
  }];
</script>

<style>
  .coins {
    display: flex;
    gap: var(--md);
    justify-content: center;
  }
</style>

<div class="coins">
  {#each coins as coin}
    <CoinComopnent {coin}/>
  {/each}
</div>
