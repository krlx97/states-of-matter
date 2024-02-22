<script lang="ts">
  import {onDestroy, onMount} from "svelte";
  import Chart from "chart.js/auto";
  import {formatUnits} from "ethers";
  import {inventoryStore, snapshotsStore} from "stores";
  import {ModalComponent, TableComponent} from "ui";

  const POW = 10n ** 18n;
  let deployTimestamp = BigInt($inventoryStore.deployTimestamp * 1000n);
  const REWARD_PER_MS = 1000000n;
  const liquid = $inventoryStore.total.ecr;
  let staked = ($inventoryStore.total.enrg * (1n * POW + ((BigInt(Date.now()) - deployTimestamp) * REWARD_PER_MS))) / POW;
  let supply = liquid + staked;
  let chartCanvas: HTMLCanvasElement;
  let int: NodeJS.Timeout;
  let isNoDataYet = false;

  onMount((): void => {
    const ecrr = $snapshotsStore.find((s) => s.name === "ecr");

    if (ecrr) {
      const labels = ecrr.snapshots.map(({date}) => new Date(date).toLocaleDateString());
      const data = ecrr.snapshots.map(({supply}) => formatUnits(supply));

      new Chart(chartCanvas, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Supply",
              data,
              borderColor: "rgb(121, 108, 255)"
            }
          ]
        }
      });
    } else {
      isNoDataYet = true;
      chartCanvas.style.display = "none";
    }

    int = setInterval((): void => {
      staked = ($inventoryStore.total.enrg * (1n * POW + ((BigInt(Date.now()) - deployTimestamp) * REWARD_PER_MS))) / POW;
      supply = liquid + staked;
    }, 1);
  });

  onDestroy((): void => {
    clearInterval(int);
  });

  $: items = [
    ["Supply", supply, "ecr"],
    ["Etheric Crystals", liquid, "ecr"],
    ["Etheric Energy", staked, "ecr"]
  ]
</script>

<style>
  .center {
    width: 640px;
    height: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>

<ModalComponent width="640px">
  <svelte:fragment slot="title">Etheric Crystals</svelte:fragment>

  <svelte:fragment slot="info">
    Before the Fall, people used state issued coins to trade, buy goods and
    accumulate riches to go forward in the world. Nowadays, these coins are
    just relics of the old times. Scattered through the planet, shards in
    magnificent shades and shapes are used in a way similar to money. However,
    they are actually imbued with energy which is power itself, not just a
    mere convention.
  </svelte:fragment>

  <svelte:fragment slot="content">
    <canvas bind:this="{chartCanvas}"></canvas>
    {#if isNoDataYet}
      <div class="center">There are no snapshots yet...</div>
    {/if}
    <TableComponent {items}/>
  </svelte:fragment>
</ModalComponent>
