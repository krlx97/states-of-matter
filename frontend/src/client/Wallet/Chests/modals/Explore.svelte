<script lang="ts">
  import {ModalComponent} from "ui";
  import TransferItemComponent from "../../modals/TransferItem.svelte";
  import UnlockComponent from "./Unlock.svelte";

  const views = [
    {name: "Transfer", component: TransferItemComponent},
    {name: "Unlock", component: UnlockComponent}
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
