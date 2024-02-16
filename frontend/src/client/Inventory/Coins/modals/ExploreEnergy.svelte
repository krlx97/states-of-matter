<script lang="ts">  import Chart from "chart.js/auto";

    import { formatUnits } from "ethers";
  import { inventoryStore, snapshotsStore } from "stores";
  import {onMount} from "svelte";
  import {ModalComponent, TableComponent} from "ui";

  let int: NodeJS.Timeout;
  let value: any;
  const POW = 10n ** 18n;
  let deployTimestamp = BigInt($inventoryStore.deployTimestamp * 1000n);
  const REWARD_PER_MS = 1000000n;
  let chartCanvas: HTMLCanvasElement;
  let val2: any;
  let isNoDataYet = false;

  onMount((): void => {
    deployTimestamp = BigInt($inventoryStore.deployTimestamp * 1000n);
    const eenrg = $snapshotsStore.find((s) => s.name === "enrg");
    const labels = eenrg.snapshots.map(({date}) => new Date(date).toLocaleDateString());
    const data = eenrg.snapshots.map(({supply}) => formatUnits(supply));

    console.log({labels, data});

    if (data) {
      new Chart(chartCanvas, {
        type: "line",
        data: {
          labels: labels,
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
    }

    int = setInterval((): void => {
      const timestamp = BigInt(Date.now());
      value = `${1n * POW + ((timestamp - deployTimestamp) * REWARD_PER_MS)}`;

      val2= value.slice(0, value.length - 18) + "." + value.slice(-18);
    }, 1000/60);
  });
</script>

<style>
  .worth {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md);
  }

  .worth__token {
    font-size: var(--xl);
    font-family: monospace;
    display: flex;
    align-items: center;
    gap: 4px;
  }
</style>

<ModalComponent width="640px">
  <svelte:fragment slot="title">Etheric Energy</svelte:fragment>
  <svelte:fragment slot="info">Lore coming soon...</svelte:fragment>
  <svelte:fragment slot="content">
    <div class="worth">
      <div class="worth__token">1.000000000000000000 <img src="images/currencies/sm/enrg.png" alt="Etheric Energy"/></div>
      <div>=</div>
      <div class="worth__token">{val2} <img src="images/currencies/sm/ecr.png" alt="Etheric Energy"/></div>
    </div>

    <canvas bind:this="{chartCanvas}"></canvas>
    {#if isNoDataYet}
      There are no snapshots yet...
    {/if}

    <TableComponent items="{[
      ["Supply", $inventoryStore.total.enrg, "enrg"]
    ]}"/>
  </svelte:fragment>
</ModalComponent>
