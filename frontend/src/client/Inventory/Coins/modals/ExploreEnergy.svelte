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

    if (eenrg) {
      const labels = eenrg.snapshots.map(({date}) => new Date(date).toLocaleDateString());
      const data = eenrg.snapshots.map(({supply}) => formatUnits(supply));

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
      chartCanvas.style.display = "none";
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

  .center {
    width: 640px;
    height: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>

<ModalComponent width="640px">
  <svelte:fragment slot="title">Etheric Energy</svelte:fragment>
  <svelte:fragment slot="info">
    When the energy from the shard is taken out by a powerful mage or a hero,
    it becomes only a shell, a somewhat beautiful stone. Drained energy can be
    converted by humans and other beings so they become stronger and more
    powerful, or it can be stored in other containers. Then it can be used as
    an amulet or a magical weapon or tool.
  </svelte:fragment>
  <svelte:fragment slot="content">
    <div class="worth">
      <div class="worth__token">1.000000000000000000 <img src="images/currencies/sm/enrg.png" alt="Etheric Energy"/></div>
      <div>=</div>
      <div class="worth__token">{val2} <img src="images/currencies/sm/ecr.png" alt="Etheric Crystals"/></div>
    </div>

    <canvas bind:this="{chartCanvas}"></canvas>
    {#if isNoDataYet}
      <div class="center">There are no snapshots yet...</div>
    {/if}

    <TableComponent items="{[
      ["Supply", $inventoryStore.enrg.totalSupply, "enrg"]
    ]}"/>
  </svelte:fragment>
</ModalComponent>
