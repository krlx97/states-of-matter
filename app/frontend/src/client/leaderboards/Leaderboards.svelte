<script lang="ts">
  import {onDestroy, onMount} from "svelte";
  import {socketService} from "services";

  let byLevel = [];
  let byElo = [];
  let byDMT = [];

  onMount(() => {
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
    });

    socketService.socket.emit("getLeaderboardsByLevel");
  });

  onDestroy((): void => {
    socketService.socket.off("getLeaderboardsByLevel");
  });
</script>

<style lang="scss">
  @import "../../shared/styles/variables";

  .leaderboards {
    height: 100%;
    width: 100%;
    display: flex;

    &__players {
      padding: 1em;
      flex-basis: 33.3333%;
      display: flex;
      flex-direction: column;

      &__player {
        margin: $spacing-md;
        padding: 0 $spacing-md;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: $light-grey;
        border-radius: 4px;
        box-shadow: $elevation-sm;
      }
    }
  }

  .title {text-align: center;}
</style>

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
        <!-- react PTSD xd -->
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
        <!-- react PTSD xd -->
        <h1 style="color: {i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : "white"}">#{i + 1}</h1>      </div>
    {/each}
  </div>
  <div class="leaderboards__players">
    <h1 class="title">By <img src="assets/currencies/DMT.png" height="24" width="24"/></h1>
    {#each byDMT as {username, dmt}, i}
      <div class="leaderboards__players__player">
        <img src="assets/avatars/{0}.png" height="48" width="48" alt="Avatar"/>
        <p>
          {username}<br/>
          <img src="assets/currencies/DMT.png" height="16" width="16"/> {dmt}
        </p>
        <!-- react PTSD xd -->
        <h1 style="color: {i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : "white"}">#{i + 1}</h1>      </div>
    {/each}
  </div>
</div>
