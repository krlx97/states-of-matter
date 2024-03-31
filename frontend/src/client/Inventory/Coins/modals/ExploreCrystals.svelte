<script lang="ts">
  import {onDestroy, onMount} from "svelte";
  import {Chart} from "chart.js";
  import {formatUnits} from "ethers";
  import {inventoryStore, snapshotsStore} from "stores";
  import {ModalComponent, TableComponent} from "ui";

  const POW = 10n ** 18n;
  let deployTimestamp = BigInt($inventoryStore.deployTimestamp * 1000n);
  const REWARD_PER_MS = 1000000n;
  const liquid = $inventoryStore.ecr.totalSupply;
  let staked = ($inventoryStore.enrg.totalSupply * (1n * POW + ((BigInt(Date.now()) - deployTimestamp) * REWARD_PER_MS))) / POW;
  let supply = liquid + staked;
  let chartCanvas: HTMLCanvasElement;
  let int: NodeJS.Timeout;
  let int2: NodeJS.Timeout;
  let isNoDataYet = false;
  let c: any;

  onMount((): void => {
    const ecrr = $snapshotsStore.find(({name}): boolean => name === "ecr");

    if (ecrr) {
      const labels = ecrr.snapshots.map(({date}) => new Date(date).toLocaleDateString());
      const data = ecrr.snapshots.map(({supply}) => formatUnits(supply));

      c = new Chart(chartCanvas, {
        type: "line",
        data: {
          labels,
          datasets: [{
            label: "Supply",
            data,
            borderColor: "rgb(121, 108, 255)"
          }]
        }
      });

      c.data.labels.push(new Date().toLocaleDateString());
      c.data.datasets[0].data.push(formatUnits(supply));

      int2 = setInterval(() => {
        c.data.labels[c.data.labels.length - 1] = (new Date().toLocaleDateString());
        c.data.datasets[0].data[c.data.datasets[0].data.length - 1] = (formatUnits(supply));
        c.update("none");
      }, 1000);
    } else {
      isNoDataYet = true;
      chartCanvas.style.display = "none";
    }

    int = setInterval((): void => {
      staked = ($inventoryStore.enrg.totalSupply * (1n * POW + ((BigInt(Date.now()) - deployTimestamp) * REWARD_PER_MS))) / POW;
      supply = liquid + staked;
    }, 10);
  });

  onDestroy((): void => {
    clearInterval(int);
    clearInterval(int2);
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
