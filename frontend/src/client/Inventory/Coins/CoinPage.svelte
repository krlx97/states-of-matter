<script lang="ts">
  import { fade, fly, slide } from "svelte/transition";
  import {createEventDispatcher, onDestroy, onMount} from "svelte";
  import {Chart} from "chart.js";
  import {formatUnits} from "ethers";
  import {inventoryStore, snapshotsStore} from "stores";
  import {ButtonComponent, LinkComponent, ModalComponent, RouterComponent, TableComponent} from "ui";
  import CPTransfer from "./CPTransfer.svelte";
  import { soundService } from "services";
  import CPEnergize from "./CPEnergize.svelte";
  import CPApproval from "./CPApproval.svelte";
    import { selectedToken } from "../isViewingPageStore";

  export let token: any;
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

  const dispatch = createEventDispatcher();
  const views = [
    {name: "Transfer", component: CPTransfer, props: {}},
    {name: "Energize", component: CPEnergize, props: {}},
    {name: "Approve",  component: CPApproval, props: {}}
  ];
  let currentView = views[0];

  const onChangeView = (view: any): void => {
    soundService.play("click");
    currentView = view;
  };

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
    ["Supply", supply, "ECR"],
    ["Etheric Crystals", liquid, "ECR"],
    ["Etheric Energy", staked, "ECR"]
  ]

</script>

<style>
  .coin-page {
    /* position: absolute;
    bottom: 0;
    left: 0; */
    position: relative;
    /* padding: 0 4em; */
    width: 100%;
    padding: 16px;
    border-radius: 8px;
    margin: auto;
    height: auto;
    /* padding: var(--md); */
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: var(--md);
    /* border: 1px solid grey; */
     backdrop-filter: blur(var(--lg));
    background-color: rgba(32, 32, 32, 0.25);
  }
  .coin-page__content {
    display: flex;
    flex-direction: column;
    gap: var(--md);
  }
  .coin-page__forms {
    /* width: 392px; */
    flex: 0 0 392px;
    display: flex;
    flex-direction: column;
    gap: var(--md);
  }

.router__nav {
    display: flex;
    justify-content: space-evenly;
  }
.router__content {
    flex-grow: 1;
    /* display: flex;
    align-items: center; */
  }
</style>

<div class="coin-page" in:fly={{y: 1080}} out:fly={{y: 1080}}>

  <div style="position: absolute; top: -24px; left: -64px">
  </div>

  <div class="coin-page__content">
    <div style="display: flex; justify-content: space-between;">
      <div style="display: flex; align-items: center; font-size: 32px; gap: 16px">
    <ButtonComponent isIcon on:click={() => dispatch("back")}><i class="fa-solid fa-arrow-left"></i></ButtonComponent>

        <img src="images/currencies/sm/{token.ticker}.png" />
        {token.name}
      </div>
<div style="display: flex; gap: 16px;">
        <ButtonComponent>TRANSFER</ButtonComponent>
        <ButtonComponent>ENERGIZE</ButtonComponent>
        <ButtonComponent>APPROVE</ButtonComponent>
        <ButtonComponent>TRACK</ButtonComponent>
      </div>
    </div>
    <div style="text-align: justify; line-height: 1.25">
      {token.lore}
    </div>
    <!-- <div class="coin-page__content" style="flex-grow: 1;"> -->
      <canvas bind:this="{chartCanvas}"></canvas>

    <TableComponent {items}/>
      {#if isNoDataYet}
        <div class="center">There are no snapshots yet...</div>
      {/if}

      
    <!-- </div> -->
  </div>

  <!-- <div class="coin-page__forms">
    <div class="router__nav">
      {#each views as view}
        <LinkComponent
          color="white"
          isActive="{view === currentView}"
          on:click="{() => onChangeView(view)}">
          {view.name}
        </LinkComponent>
      {/each}
    </div>
    <div class="router__content">
      <svelte:component this="{currentView.component}"/>
    </div>
  </div> -->
</div>
