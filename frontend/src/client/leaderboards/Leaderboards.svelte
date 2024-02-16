<script lang="ts">
  import {onMount} from "svelte";
  import {socketService} from "services";
  import {leaderboardsStore} from "stores";
  import {PlayerFrameComponent} from "ui";

  const ms2md = new Date().setHours(24,0,0,0) - Date.now();

  onMount((): void => {
    const {byLevel, byElo} = $leaderboardsStore;

    if (!byLevel.length && !byElo.length) {
      socketService.socket.emit("getLeaderboards");
    }
  });
</script>

<style>
  .wrapper {
    height: 100%;
    width: 100%;
  }
  .leaderboards {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .leaderboards__players {
    height: 88.8%;
    /* padding: var(--md); */
    flex-basis: 50%;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md);
    overflow-y: scroll;
    /* box-sizing: border-box; */
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

  .title {
    text-align: center;
    font-size: var(--xl);
    font-weight: bold;
  }

  .reset {
    width: 100%;
    text-align: center;
    font-size: var(--xl);
    font-weight: bold;
  }
</style>

<div class="wrapper">

  <div class="reset">
    Next update: {`${new Date(Date.now() + ms2md).toLocaleDateString()} ${new Date(Date.now() + ms2md).toLocaleTimeString()}`}
  </div>

  <div class="leaderboards">
    <div class="leaderboards__players">
      <div class="title">Level</div>
      {#if $leaderboardsStore.byLevel.length}
        {#each $leaderboardsStore.byLevel as {name, elo, level, experience, avatarId, bannerId, games}, i}
          <div>
            <PlayerFrameComponent {name} {level} {elo} {avatarId} {bannerId} {experience} {games} leaderboardPosition="{i + 1}"/>
          </div>
        {/each}
      {:else}
        Leaderboards haven't been generated yet.
      {/if}
    </div>
    <div class="leaderboards__players">
      <div class="title">Elo</div>
      {#if $leaderboardsStore.byElo.length}
        {#each $leaderboardsStore.byElo as {name, elo, level, experience, avatarId, bannerId, games}, i}
          <div>
            <PlayerFrameComponent {name} {level} {elo} {avatarId} {bannerId} {experience} {games} leaderboardPosition="{i + 1}"/>
          </div>
        {/each}
      {:else}
          Leaderboards haven't been generated yet.
      {/if}
    </div>
  </div>

</div>
