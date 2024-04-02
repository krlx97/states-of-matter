<script lang="ts">
  import {contractAddress} from "@som/shared/data";
  import {modalService, soundService} from "services";
  import CoinComopnent from "./Coin.svelte";
  import EnergizeComponent from "./modals/Energize.svelte";
  import ExploreCrystalsComponent from "./modals/ExploreCrystals.svelte";
  import ExploreEnergyComponent from "./modals/ExploreEnergy.svelte";
  import SolidifyComponent from "./modals/Solidify.svelte";
  import TransferComponent from "./modals/Transfer.svelte";
  import Approvals from "./modals/Approval.svelte";

  const onTrackEcr = async (): Promise<void> => {
    if (!window.ethereum) {
      return;
    }

    await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: contractAddress.ethericCrystals,
          symbol: "ECR",
          decimals: 18,
          image: "https://som.eternitas.games/ecr.png"
        }
      }
    });
  };

  const onExploreCrystals = (): void => {
    modalService.open(ExploreCrystalsComponent);
    soundService.play("click");
  };

  const onTransferCrystals = (): void => {
    modalService.open(TransferComponent, {name: "Etheric Crystals", ticker: "ecr"});
    soundService.play("click");
  };

  const onEnergize = (): void => {
    modalService.open(EnergizeComponent);
    soundService.play("click");
  };

  const onApprovalsCrystals = (): void => {
    modalService.open(Approvals, {name: "Etheric Crystals", ticker: "ecr"});
    soundService.play("click");
  };

  const onTrackEnrg = async (): Promise<void> => {
    if (!window.ethereum) {
      return;
    }

    await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: contractAddress.ethericEnergy,
          symbol: "ENRG",
          decimals: 18,
          image: "https://som.eternitas.games/enrg.png"
        }
      }
    });
  };

  const onExploreEnergy = (): void => {
    modalService.open(ExploreEnergyComponent);
    soundService.play("click");
  };

  const onTransferEnergy = (): void => {
    modalService.open(TransferComponent, {name: "Etheric Energy", ticker: "enrg"});
    soundService.play("click");
  };

  const onSolidify = (): void => {
    modalService.open(SolidifyComponent);
    soundService.play("click");
  };

  const onApprovalsEnergy = (): void => {
    modalService.open(Approvals, {name: "Etheric Energy", ticker: "enrg"});
    soundService.play("click");
  };

  const coins = [{
    name: "Etheric Crystals",
    ticker: "ecr",
    menuItems: [
      ["TRACK", onTrackEcr],
      ["EXPLORE", onExploreCrystals],
      ["TRANSFER", onTransferCrystals],
      ["ENERGIZE", onEnergize],
      ["APPROVE", onApprovalsCrystals]
    ]
  }, {
    name: "Etheric Energy",
    ticker: "enrg",
    menuItems: [
      ["TRACK", onTrackEnrg],
      ["EXPLORE", onExploreEnergy],
      ["TRANSFER", onTransferEnergy],
      ["SOLIDIFY", onSolidify],
      ["APPROVE", onApprovalsEnergy]
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
