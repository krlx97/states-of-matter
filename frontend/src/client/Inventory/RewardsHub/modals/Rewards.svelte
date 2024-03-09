<script lang="ts">
  import {socketService} from "services";
  import {playerStore} from "stores";
  import {ButtonComponent, ModalComponent, TableComponent, TextComponent} from "ui";

  let onClaim = (): void => {
    socketService.socket.emit("claimRewards" as any);
  };
</script>

<ModalComponent>

  <svelte:fragment slot="title">Rewards</svelte:fragment>

  <svelte:fragment slot="info">
    You acquire various rewards in States of Matter by leveling up, increasing
    ranked elo, completing daily and weekly tasks, or achieving a top 100
    position in the leaderboards. All rewards stack.
  </svelte:fragment>

  <svelte:fragment slot="content">
    <div style="text-align: center;">
      <TextComponent>Daily flush</TextComponent>
    </div>
    <TableComponent items="{[
      ["Top 100 elo", 3n * 10n ** 18n, "ecr"],
      ["Top 100 level", 1n * 10n ** 18n, "ecr"],
      ["Daily task", 1n * 10n ** 18n, "ecr"],
      ["Weekly task", 1n, "shard"],
      ["Silver", 1n * 10n ** 18n, "ees"],
      ["Gold", 3n * 10n ** 18n, "ees"],
      ["Master", 5n * 10n ** 18n, "ees"]
    ]}"/>
    <div style="text-align: center; margin-top: 16px;">
      <TextComponent>Repeatable</TextComponent>
    </div>
    <TableComponent items="{[
      ["Every level", 1n * 10n ** 18n, "ees"],
      ["Every 2 levels", 2n * 10n ** 18n, "ees"],
      ["Every 4 levels", 4n * 10n ** 18n, "ees"],
      ["Every 8 levels", 8n * 10n ** 18n, "ees"],
      ["Every 16 levels", 16n * 10n ** 18n, "ees"],
      ["Every 32 levels", 32n * 10n ** 18n, "ees"],
      ["Every 64 levels", 64n * 10n ** 18n, "ees"],
    ]}"/>
    <div style="text-align: center; margin-top: 16px;">
      <TextComponent>Your rewards</TextComponent>
    </div>
    <TableComponent items="{[
      ["Etheric Essence", $playerStore.rewards.ees, "ees"],
      ["Etheric Crystals", $playerStore.rewards.ecr, "ecr"]
    ]}"/>
    <div style="display: flex; justify-content: center">
      <ButtonComponent type="button" on:click="{onClaim}">CLAIM</ButtonComponent>
    </div>
  </svelte:fragment>

</ModalComponent>
