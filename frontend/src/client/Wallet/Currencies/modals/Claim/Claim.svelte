<script lang="ts">
  import {ModalComponent} from "ui";
  import ClaimAirdropsComponent from "./ClaimAirdrops.svelte";
  import ClaimRewardsComponent from "./ClaimRewards.svelte";
  import ClaimUnstakingComponent from "./ClaimUnstaking.svelte";

  const views = [
    {name: "Unstaked", component: ClaimUnstakingComponent},
    {name: "Rewards", component: ClaimRewardsComponent},
    {name: "Airdrops", component: ClaimAirdropsComponent}
  ];

  let currentView = views[0];
</script>

<ModalComponent>
  <div>
    <div class="links">
      {#each views as view}
        <div
          class="link"
          class:linkActive={view.name === currentView.name}
          on:click={() => currentView = view}
          on:keypress={() => currentView = view}
        >{view.name}</div>
      {/each}
    </div>

    <div class="wallet__content">
      <svelte:component this={currentView.component}/>
    </div>
  </div>
</ModalComponent>
