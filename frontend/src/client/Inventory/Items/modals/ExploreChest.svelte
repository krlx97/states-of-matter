<script lang="ts">
  import {ModalComponent} from "ui";
  import TransferItemComponent from "./Transfer.svelte";
  import UnlockComponent from "./Unlock.svelte";

  const views = [
    {name: "Transfer", component: TransferItemComponent},
    {name: "Unlock", component: UnlockComponent}
  ];

  let currentView = views[0];
</script>

<style>
  .explore {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }
</style>

<ModalComponent>
  <div class="explore">
    <div class="nav">
      {#each views as view}
        <button
          class="nav__link"
          class:linkActive={view.name === currentView.name}
          on:click={() => currentView = view}>
          {view.name}
        </button>
      {/each}
    </div>
    <!-- <div class="wallet__content"> -->
      <svelte:component this={currentView.component}/>
    <!-- </div> -->
  </div>
</ModalComponent>
