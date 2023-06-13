<script lang="ts">
  import {onMount} from "svelte";
  import {socketService} from "services";
  import {leaderboardsStore} from "stores";
  import Loading from "./Loading.svelte";

  onMount((): void => {
    if (!$leaderboardsStore.byLevel.length && !$leaderboardsStore.byElo.length) {
      socketService.socket.emit("getLeaderboards");
    }
  });
</script>

<style>
  .leaderboards {
    height: 100%;
    width: 100%;
    display: flex;
  }

  .leaderboards__players {
    height: 740px;
    padding: 1em;
    flex-basis: 50%;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
  }

  .leaderboards__players::-webkit-scrollbar {
    width: 8px;
  }
  .leaderboards__players::-webkit-scrollbar-track {
    background-color: rgb(var(--dark-grey));
  }
  .leaderboards__players::-webkit-scrollbar-thumb {
    background-color: rgb(var(--light-grey));
    border: 1px solid transparent;
    border-radius: 8px;
    box-sizing: border-box;
  }

  .leaderboards__players__player {
    margin: var(--spacing-md);
    /* padding: var(--spacing-md); */
    display: flex;
    align-items: center;
    justify-content: space-between;

    box-sizing: border-box;
    /* background-color: rgb(var(--light-grey)); */
    /* border-radius: 4px; */
    /* box-shadow: var(--elevation-sm); */

    border-top-width: 0;
    border-right-width: 0;
    border-bottom-width: 1px;
    border-left-width: 0;
    border-style: solid;
    border-image: linear-gradient(
      90deg,
      rgba(63,63,63,1) 0%,
      rgba(255,255,255,1) 50%,
      rgba(63,63,63,1) 100%
    ) 1;
    /* background: linear-gradient(
      180deg,
      rgba(179, 105, 244, 0.1) 0%,
      rgba(0, 0, 0, 0) 50%,
      rgba(179, 105, 244, 0.1) 100%
    ); */
  }

  .title {
    text-align: center;
  }
</style>

{#if !$leaderboardsStore.byLevel.length && !$leaderboardsStore.byElo.length}
  <Loading />
{:else}
  <div class="leaderboards">
    <div class="leaderboards__players">
      <h1 class="title">Level Leaderboards</h1>
      {#each $leaderboardsStore.byLevel as {name, level, avatarId}, i}
        <div class="leaderboards__players__player">
          <img src="assets/avatars/{avatarId}.png" height="48" width="48" alt="Avatar"/>
          <div style="width: 92px; text-align: center;">
            {name}
          </div>
          <div>Level {level}</div>
          <div style="color: {i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : "white"}; font-size: 32px;">#{i + 1}</div>
        </div>
      {/each}
    </div>
    <div class="leaderboards__players">
      <h1 class="title">Elo Leaderboards</h1>
      {#each $leaderboardsStore.byElo as {name, elo, avatarId}, i}
        <div class="leaderboards__players__player">
          <img src="assets/avatars/{avatarId}.png" height="48" width="48" alt="Avatar"/>
          <div style="width: 92px; text-align: center;">
            {name}
          </div>
          <div>Elo {elo}</div>
          <div style="color: {i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : "white"}; font-size: 32px;">#{i + 1}</div>
        </div>
      {/each}
    </div>
  </div>
{/if}
