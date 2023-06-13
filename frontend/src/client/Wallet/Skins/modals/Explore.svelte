<script lang="ts">
  import {ModalComponent} from "ui";
  import DisenchantComponent from "./Disenchant.svelte";
  import TransferItemComponent from "../../modals/TransferItem.svelte";

  const views = [
    {name: "Transfer", component: TransferItemComponent},
    {name: "Disenchant", component: DisenchantComponent}
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
