<script lang="ts">
  import {onMount} from "svelte";
  import Chart from "chart.js/auto";
  import {inventoryStore, snapshotsStore} from "stores";
  import {ModalComponent, TableComponent} from "ui";
    import { formatUnits } from "ethers";

  let chartElement: HTMLCanvasElement;
  let chart: Chart;
  const items = [["Supply", $inventoryStore.total.ees, "ees"]];
  let isNoDataYet = false;

  onMount((): void => {
    const ees = $snapshotsStore.find((s) => s.name === "ees");
    const labels = ees.snapshots.map(({date}) => new Date(date).toLocaleDateString());
    const data = ees.snapshots.map(({supply}) => formatUnits(supply));

    if (data) {
      chart = new Chart(chartElement, {
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
    } else {
      isNoDataYet = true;
    }
  });
</script>

<ModalComponent width="640px">
  <svelte:fragment slot="title">Etheric Essence</svelte:fragment>

  <svelte:fragment slot="info">
    When the energy from the shard is taken out by a powerful mage or a hero,
    it becomes only a shell, a somewhat beautiful stone. Drained energy can be
    converted by humans and other beings so they become stronger and more
    powerful, or it can be stored in other containers. Then it can be used as
    an amulet or a magical weapon or tool.
  </svelte:fragment>

  <svelte:fragment slot="content">
    <canvas bind:this="{chartElement}"></canvas>
    {#if isNoDataYet}
      There are no snapshots yet...
    {/if}
    <TableComponent {items}/>
  </svelte:fragment>
</ModalComponent>
