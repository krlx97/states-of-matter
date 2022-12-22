<script lang="ts">
  import {onDestroy, onMount} from "svelte";
  import {socketService} from "services";
  import Loading from './Loading.svelte';

  let byLevel = [];
  let byElo = [];
  let byDMT = [];
  let loading = false;

  onMount((): void => {
    socketService.socket.on("getLeaderboardsByLevel", (params) => {
      const adminLv = params.byLevel.find(({username}) => username === "admin");
      const iAdminLv = params.byLevel.indexOf(adminLv);

      const adminElo = params.byElo.find(({username}) => username === "admin");
      const iAdminElo = params.byElo.indexOf(adminElo);

      const adminDMT = params.byDMT.find(({username}) => username === "admin");
      const iAdminDMT = params.byDMT.indexOf(adminDMT);

      byLevel = params.byLevel;
      byLevel.splice(iAdminLv, 1);

      byElo = params.byElo;
      byElo.splice(iAdminElo, 1);

      byDMT = params.byDMT;
      byDMT.splice(iAdminDMT, 1);
      loading = true;
    });

    socketService.socket.emit("getLeaderboardsByLevel");
  });

  onDestroy((): void => {
    socketService.socket.off("getLeaderboardsByLevel");
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
    flex-basis: 33.3333%;
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
    padding: 0 var(--spacing-md);
    display: flex;
    align-items: center;
    justify-content: space-between;
    /* background-color: rgb(var(--light-grey)); */
    /* border-radius: 4px; */
    /* box-shadow: var(--elevation-sm); */

    border-top-width: 1px;
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

{#if !loading}
  <Loading />
{:else}
  <div class="leaderboards">
    <div class="leaderboards__players">
      <h1 class="title">By Level</h1>
      {#each byLevel as {username, lv, avatarId}, i}
        <div class="leaderboards__players__player">
          <img src="assets/avatars/{avatarId}.png" height="48" width="48" alt="Avatar"/>
          <p>
            {username}<br/>
            Level: {lv}
          </p>
          <h1 style="color: {i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : "white"}">#{i + 1}</h1>
        </div>
      {/each}
    </div>
    <div class="leaderboards__players">
      <h1 class="title">By ELO</h1>
      {#each byElo as {username, elo, avatarId}, i}
        <div class="leaderboards__players__player">
          <img src="assets/avatars/{avatarId}.png" height="48" width="48" alt="Avatar"/>
          <p>
            {username}<br/>
            Elo: {elo}
          </p>
          <h1 style="color: {i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : "white"}">#{i + 1}</h1>      </div>
      {/each}
    </div>
    <div class="leaderboards__players">
      <h1 class="title">By Staked <img src="assets/currencies/VMT.png" height="24" width="24" alt="VMT"/></h1>
      {#each byDMT as {username, dmt}, i}
        <div class="leaderboards__players__player">
          <img src="assets/avatars/{0}.png" height="48" width="48" alt="Avatar"/>
          <p>
            {username}<br/>
            {dmt.split(" ")[0]} <img src="assets/currencies/VMT.png" height="16" width="16" alt="VMT"/>
          </p>
          <h1 style="color: {i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : "white"}">#{i + 1}</h1>      </div>
      {/each}
    </div>
  </div>
{/if}
