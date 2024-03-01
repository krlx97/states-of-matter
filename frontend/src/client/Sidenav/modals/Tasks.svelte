<script lang="ts">
  import {playerStore} from "stores";
  import {ModalComponent, TableComponent} from "ui";

  // const ms2md = new Date().setHours(24,0,0,0) - Date.now();
</script>

<ModalComponent width="360px">
  <svelte:fragment slot="title">Tasks</svelte:fragment>
  <svelte:fragment slot="info">
    Finish the daily task by winning one game or playing three games. Doing so
    seven days in a row completes the weekly task. Weekly task will be reset if
    you miss the daily task.
  </svelte:fragment>
  <TableComponent items="{[
    ["Daily task", $playerStore.tasks.daily || $playerStore.tasks.dailyAlternative > 2 ? "Yes" : "No"],
    ["Weekly task", $playerStore.tasks.weekly],
    // ["Reset", `${new Date(Date.now() + ms2md).toLocaleDateString()} ${new Date(Date.now() + ms2md).toLocaleTimeString()}`]
  ]}"/>
</ModalComponent>
