<script lang="ts">
  import {playerStore} from "stores";
  import {ModalComponent, TableComponent} from "ui";

  $: items = [
    ["Win one game", $playerStore.tasks.win ? "✅" : "❌"],
    ["Level up", $playerStore.tasks.levelUp ? "✅" : "❌"]
  ];
</script>

<ModalComponent width="360px">
  <svelte:fragment slot="title">Tasks</svelte:fragment>

  <svelte:fragment slot="info">
    Finish the daily tasks by winning one game and leveling up. Rewards are
    flushed once per day.
  </svelte:fragment>

  <svelte:fragment slot="content">
    <TableComponent {items}/>
  </svelte:fragment>
</ModalComponent>
