<script lang="ts">
  import {ModalComponent, TableComponent} from "ui";
</script>

<ModalComponent>
  <svelte:fragment slot="title">Rewards</svelte:fragment>
  <svelte:fragment slot="info">
    You acquire various rewards in States of Matter by leveling up, increasing
    ranked elo, completing daily and weekly tasks, or achieving a top 100
    position in the leaderboards. Rewards stack.
  </svelte:fragment>
  <div>
    <h1>Daily flush</h1>
    <TableComponent items="{[
      ["Top 100 elo", 10n * 10n ** 18n, "ecr"],
      ["Top 100 level", 5n * 10n ** 18n, "ecr"],
      ["Silver", 1n * 10n ** 18n, "ees"],
      ["Gold", 3n * 10n ** 18n, "ees"],
      ["Master", 1n * 10n ** 18n, "ecr"]
    ]}"/>
    <h1>Instant</h1>
    <TableComponent items="{[
      ["Daily task", 1n * 10n ** 18n, "ecr"],
      ["Weekly task", 10n * 10n ** 18n, "ecr"],
      ["Every level", 1n * 10n ** 18n, "ees"],
      ["Every 2 levels", 2n * 10n ** 18n, "ees"],
      ["Every 4 levels", 4n * 10n ** 18n, "ees"],
      ["Every 8 levels", 8n * 10n ** 18n, "ees"],
      ["Every 16 levels", 16n * 10n ** 18n, "ees"],
      ["Every 32 levels", 32n * 10n ** 18n, "ees"],
      ["Every 64 levels", 64n * 10n ** 18n, "ees"],
    ]}"/>
  </div>
</ModalComponent>
