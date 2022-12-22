<style>
  @keyframes blinkingContent {
    0% {
      background: #404040;
    }
    50% {
      background: transparent;
    }
    100% {
      background: #404040;
    }
  }

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
    min-height: 4.68rem;
    margin: var(--spacing-md);
    padding: 0 var(--spacing-md);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: rgb(var(--light-grey));
    border-radius: 4px;
    box-shadow: var(--elevation-sm);
    animation: blinkingContent 2s linear infinite;
  }

  .title {
    text-align: center;
  }
</style>

<div class="leaderboards">
  <div class="leaderboards__players">
    <h1 class="title">By Level</h1>
    {#each Array(10) as _, i}
      <div class="leaderboards__players__player">
        <div class="card">
        </div>
      </div>
    {/each}
  </div>
  <div class="leaderboards__players">
    <h1 class="title">By ELO</h1>
    {#each Array(10) as _, i}
      <div class="leaderboards__players__player">
      </div>
    {/each}
  </div>
  <div class="leaderboards__players">
    <h1 class="title">By Stale</h1>
    {#each Array(10) as _, i}
      <div class="leaderboards__players__player">
      </div>
    {/each}
  </div>
</div>
