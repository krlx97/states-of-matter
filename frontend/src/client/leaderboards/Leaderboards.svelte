<script lang="ts">
  import {onMount} from "svelte";
  import {socketService} from "services";
  import {leaderboardsStore} from "stores";
  import {PlayerFrameComponent, TextComponent} from "ui";

  const ms2md = new Date().setHours(24,0,0,0) - Date.now();

  onMount((): void => {
    const {byLevel, byElo} = $leaderboardsStore;

    if (!byLevel.length && !byElo.length) {
      socketService.socket.emit("getLeaderboards");
    }
  });
</script>

<style>
  .leaderboards {
    display: flex;
  }

  .leaderboards__title {
    width: 100%;
    background-color: rgba(var(--dark-grey), 0.333);
    backdrop-filter: blur(var(--md));
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: var(--md);
    padding-bottom: var(--xl);
    border: 0 solid;
    border-bottom-width: 1px;
    border-image: linear-gradient(
      90deg,
      rgba(var(--dark-grey), 0) 0%,
      rgba(var(--grey), 0.333) 50%,
      rgba(var(--dark-grey), 0) 100%
    ) 1;
    box-sizing: border-box;
  }

  .leaderboards__players {
    height: 778px;
    flex-basis: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md);
    padding-block: var(--md);
    overflow-y: scroll;
    box-sizing: border-box;
  }

  .leaderboards__players::-webkit-scrollbar {
    width: 4px;
  }

  .leaderboards__players::-webkit-scrollbar-track {
    border-radius: 8px;
  }

  .leaderboards__players::-webkit-scrollbar-thumb {
    background-color: rgb(var(--grey));
    border-radius: 8px;
  }
</style>

<div>

  <div class="leaderboards__title">
    <TextComponent isBold size="xl">Level</TextComponent>
    <TextComponent isBold size="xl">Elo</TextComponent>
  </div>

  <div class="leaderboards">
    <div class="leaderboards__players">
      {#if $leaderboardsStore.byLevel.length}
        {#each $leaderboardsStore.byLevel as params, i}
          <div>
            <PlayerFrameComponent {...params} leaderboardPosition="{i + 1}"/>
          </div>
        {/each}
      {:else}
        Leaderboards haven't been generated yet.
      {/if}
    </div>
    <div class="leaderboards__players">
      {#if $leaderboardsStore.byElo.length}
        {#each $leaderboardsStore.byElo as params, i}
          <div>
            <PlayerFrameComponent {...params} leaderboardPosition="{i + 1}"/>
          </div>
        {/each}
      {:else}
        Leaderboards haven't been generated yet.
      {/if}
    </div>
  </div>

</div>
