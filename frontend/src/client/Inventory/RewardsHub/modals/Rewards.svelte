<script lang="ts">
  import {socketService} from "services";
  import {playerStore} from "stores";

  import {
    ButtonComponent,
    ModalComponent,
    TableComponent,
    TextComponent
  } from "ui";

  let disabled = false;

  let onClaim = (): void => {
    disabled = true;
    socketService.socket.emit("claimRewards" as any);
  };
</script>

<ModalComponent>

  <svelte:fragment slot="title">Rewards</svelte:fragment>

  <svelte:fragment slot="info">
    You acquire various rewards in States of Matter by leveling up, increasing
    ranked elo, completing daily tasks, or achieving a top 100 position in the
    leaderboards. All rewards stack, and are flushed once per day.
  </svelte:fragment>

  <svelte:fragment slot="content">
    <div style="text-align: center;">
      <TextComponent>Leaderboards</TextComponent>
    </div>
    <TableComponent items="{[
      ["Top 100 elo", 3n * 10n ** 18n, "ecr"],
      ["Top 100 level", 2n * 10n ** 18n, "ecr"]
    ]}"/>

    <div style="text-align: center;">
      <TextComponent>Rank</TextComponent>
    </div>
    <TableComponent items="{[
      ["Silver", 1n * 10n ** 17n, "ecr"],
      ["Gold", 2n * 10n ** 17n, "ecr"],
      ["Master", 3n * 10n ** 17n, "ecr"]
    ]}"/>

    <div style="text-align: center;">
      <TextComponent>Daily tasks</TextComponent>
    </div>
    <TableComponent items="{[
      ["First win", 1n * 10n ** 18n, "ecr"],
      ["First level up", 1n, "shard"]
    ]}"/>

    <div style="text-align: center; margin-top: 16px;">
      <TextComponent>Your rewards</TextComponent>
    </div>
    <TableComponent items="{[
      ["Shard Packs", $playerStore.rewards.shardPacks, "shard"],
      ["Etheric Crystals", $playerStore.rewards.ecr, "ecr"]
    ]}"/>

    <div style="display: flex; justify-content: center">
      <ButtonComponent type="button" {disabled} on:click="{onClaim}">
        CLAIM
      </ButtonComponent>
    </div>
  </svelte:fragment>

</ModalComponent>
