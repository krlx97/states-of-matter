<script lang="ts">
  import {PlayerStatus} from "@som/shared/enums";
  import {onMount} from "svelte";
  import {ButtonComponent, MenuComponent, ProgressBarComponent} from "ui";

  let pathElement: SVGPathElement;
  // let pathElement2: SVGPathElement;

  let name: string;
  let experience: number;
  let level: number;
  let elo: number;
  let avatarId: number;
  let bannerId: number;
  let status: PlayerStatus | undefined = undefined;
  let games: any;
  let leaderboardPosition = 0;
  let hasUnseenMessages = false;

  let rank = "Gold";
  let nextRank: string;
  let actions: any = [];

  const EXPERIENCE_REQUIRED = 1000;
  let xpOffset: any;
  let eloOffset: any;
  let isMenuToggled = false;
  let myEloo = 0;

  const rankRequirement = new Map([
    ["Bronze", 0],
    ["Silver", 250],
    ["Gold", 500],
    ["Master", 750]
  ]);
  const rankColor = new Map([
    ["Bronze", "#7d5833"],
    ["Silver", "#71767f"],
    ["Gold", "#dea34d"],
    ["Master", "#662d91"]
  ]);

  $: bars = [{color: rank, progress: myEloo}]

  onMount((): void => {
    const xpProgressLen = pathElement.getTotalLength();
    // const eloProgressLength = pathElement2.getTotalLength();

    if (elo < 250) {
      rank = "Bronze";
      nextRank = "Silver";
    } else if (elo >= 250 && elo < 500) {
      rank = "Silver";
      nextRank = "Gold";
    } else if (elo >= 500 && elo < 750) {
      rank = "Gold";
      nextRank = "Master";
    } else if (elo >= 750) {
      rank = "Master";
      nextRank = "You are max rank.";
    }

    xpOffset = xpProgressLen - (xpProgressLen * experience / EXPERIENCE_REQUIRED);

    // const fix = elo - rankRequirement.get(rank);
    // const fix2 = rankRequirement.get(nextRank) - rankRequirement.get(rank);
    myEloo = (elo - rankRequirement.get(rank)) / (rankRequirement.get(nextRank) - rankRequirement.get(rank)) * 100;
    // eloOffset = eloProgressLength - (eloProgressLength * fix / fix2);
  });

  export {name, experience, level, elo, avatarId, bannerId, actions, status, games, leaderboardPosition, hasUnseenMessages};
</script>

<style>
  .player {
    padding: 0 48px;
    display: flex;
    align-items: center;
    gap: var(--md);
    width: 384px;
    height: 96px;
    box-sizing: border-box;
  }

  .player__info {
    position: relative;
    height: 100%;
    padding: 12px 0;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    box-sizing: border-box;
  }

  .player__info__name {
    position: relative;
    /* border: 0 solid rgb(var(--grey)); */
    font-size: var(--xl);
    /* border: 0 solid;
    border-bottom-width: 1px;
    border-image: linear-gradient(
      90deg,
      rgba(127, 127, 127, 1) 0%,
      rgba(255, 255, 255, 1) 50%,
      rgba(127, 127, 127, 1) 100%
    ) 1; */
    text-align: center;
  }

  .player__info__actions {
    display: flex;
    justify-content: space-between;
  }

  .player__progress {
    width: 80px;
    height: 80px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .player__progress:hover .player__progress__tooltip {display: initial}

  .player__progress__tooltip {
    width: 160px;
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    display: none;
    flex-direction: column;
    gap: var(--sm);
    padding: var(--sm);
    background-color: rgb(var(--dark-grey));
    border: 1px solid rgb(var(--grey));
    border-radius: 8px;
    font-size: var(--xs);
    z-index: 1;
  }
  .player__progress__bar {
    position: absolute;
    top: 0;
    left: 0;
  }

  .player__progress__text {
    position: absolute;
    bottom: 0;
    /* padding: 2px; */
    left: 50%;
    transform: translateX(-50%);
    /* width: 24px; */
    /* height: 12px; */
    display: flex;
    align-items: center;
    justify-content: center;
    /* background-color: rgba(0, 0, 0, 0.8); */
    /* border: 1px solid grey; */
    /* border-radius: 8px; */
    text-align: center;
    font-size: var(--sm);
  }

  .player__progress__avatar {
    border-radius: 100%;
  }

  .bar {
    stroke-dasharray: 193.3966827392578;
    stroke-dashoffset: 0;
  }

  .center {
    text-align: center;
    line-height: 1.25;
  }

  .center2 {
    text-align: center;
    font-size: var(--lg);
  }

  .player__status {
    position: absolute;
    bottom: 0;
    right: 0;
  }


.abs {
    position: absolute;
    bottom: 0;
    left: 0;
  }
  .rel {
    position: relative;
  }


  .bar {
    display: inline-block;
    cursor: pointer;
  }

  .bar1, .bar2, .bar3 {
    width: 16px;
    height: 2px;
    background-color: rgb(var(--white));
    margin: 2px 0;
    transition: 400ms;
  }

  .change .bar1 {transform: translate(0, 4px) rotate(-45deg);}
  .change .bar2 {opacity: 0;}
  .change .bar3 {transform: translate(0, -4px) rotate(45deg);}


  .theimage {
    height: 48px;
    width: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: radial-gradient(rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.5) 33%, transparent 66%);
  }
  .theimage:hover .player__progress__tooltip {display: initial}

</style>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="player" style="background-image: url(images/items/{bannerId}.png);">

  <div class="player__progress">

    <img
      class="player__progress__avatar"
      src="images/items/{avatarId}.png"
      alt="Avatar"/>

    <div class="player__progress__bar">
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_5_2)">
      <path d="M26.2234 73.2597C18.5286 70.0724 12.177 64.3156 8.25083 56.9703C4.32467 49.6249 3.06686 41.1455 4.69173 32.9767C6.3166 24.808 10.7236 17.4553 17.1619 12.1716C23.6001 6.88789 31.6712 4 40 4C48.3288 4 56.3999 6.8879 62.8382 12.1716C69.2764 17.4554 73.6834 24.808 75.3083 32.9768C76.9331 41.1455 75.6753 49.6249 71.7492 56.9703C67.823 64.3156 61.4714 70.0724 53.7766 73.2597" stroke="#212121" stroke-width="8"/>
      <path class="bar" bind:this={pathElement} style="stroke-dashoffset: {xpOffset}" d="M24.2751 72.3841C16.9574 68.8308 11.0589 62.9039 7.54081 55.5692C4.02271 48.2346 3.09243 39.9246 4.9016 31.9936C6.71076 24.0626 11.1527 16.9781 17.5035 11.8947C23.8544 6.81126 31.7396 4.02861 39.8743 4.00022C48.009 3.97183 55.9136 6.69936 62.2997 11.7383C68.6859 16.7773 73.1772 23.8306 75.0417 31.7488C76.9061 39.667 76.0339 47.9832 72.5671 55.3423C69.1003 62.7013 63.2433 68.6692 55.9506 72.2735" stroke="#7F7F7F" stroke-width="2"/>
      <mask id="path-3-inside-1_5_2" fill="white">
      <path d="M55.3073 76.9552C45.5062 81.0149 34.4938 81.0149 24.6927 76.9552L27.7541 69.5641C35.595 72.812 44.405 72.812 52.2459 69.5641L55.3073 76.9552Z"/>
      </mask>
      <path d="M55.3073 76.9552C45.5062 81.0149 34.4938 81.0149 24.6927 76.9552L27.7541 69.5641C35.595 72.812 44.405 72.812 52.2459 69.5641L55.3073 76.9552Z" stroke="#212121" stroke-width="8" mask="url(#path-3-inside-1_5_2)"/>
      <mask id="path-4-inside-2_5_2" fill="white">
      <path d="M25.2934 68.8017C34.7626 65.058 45.303 65.0664 54.7662 68.8253L51.813 76.2602C44.2424 73.2531 35.81 73.2464 28.2347 76.2413L25.2934 68.8017Z"/>
      </mask>
      <path d="M25.2934 68.8017C34.7626 65.058 45.303 65.0664 54.7662 68.8253L51.813 76.2602C44.2424 73.2531 35.81 73.2464 28.2347 76.2413L25.2934 68.8017Z" stroke="#212121" stroke-width="8" mask="url(#path-4-inside-2_5_2)"/>
      </g>
      <defs>
      <clipPath id="clip0_5_2">
      <rect width="80" height="80" fill="white"/>
      </clipPath>
      </defs>
      </svg>

      <!-- <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_5_2)">
      <path d="M26.2234 73.2597C18.5286 70.0724 12.177 64.3156 8.25083 56.9703C4.32467 49.6249 3.06686 41.1455 4.69173 32.9767C6.3166 24.808 10.7236 17.4553 17.1619 12.1716C23.6001 6.88789 31.6712 4 40 4C48.3288 4 56.3999 6.8879 62.8382 12.1716C69.2764 17.4554 73.6834 24.808 75.3083 32.9768C76.9331 41.1455 75.6753 49.6249 71.7492 56.9703C67.823 64.3156 61.4714 70.0724 53.7766 73.2597" stroke="#212121" stroke-width="8"/>
      <path class="bar" bind:this={pathElement} style="stroke-dashoffset: {xpOffset}" d="M24.2751 72.3841C16.9574 68.8308 11.0589 62.9039 7.54081 55.5692C4.02271 48.2346 3.09243 39.9246 4.9016 31.9936C6.71076 24.0626 11.1527 16.9781 17.5035 11.8947C23.8544 6.81126 31.7396 4.02861 39.8743 4.00022C48.009 3.97183 55.9136 6.69936 62.2997 11.7383C68.6859 16.7773 73.1772 23.8306 75.0417 31.7488C76.9061 39.667 76.0339 47.9832 72.5671 55.3423C69.1003 62.7013 63.2433 68.6692 55.9506 72.2735" stroke="#848484" stroke-width="4"/>
      <mask id="path-3-inside-1_5_2" fill="white">
      <path d="M55.3073 76.9552C45.5062 81.0149 34.4938 81.0149 24.6927 76.9552L27.7541 69.5641C35.595 72.812 44.405 72.812 52.2459 69.5641L55.3073 76.9552Z"/>
      </mask>
      <path d="M55.3073 76.9552C45.5062 81.0149 34.4938 81.0149 24.6927 76.9552L27.7541 69.5641C35.595 72.812 44.405 72.812 52.2459 69.5641L55.3073 76.9552Z" stroke="#212121" stroke-width="8" mask="url(#path-3-inside-1_5_2)"/>
      <mask id="path-4-inside-2_5_2" fill="white">
      <path d="M25.2934 68.8017C34.7626 65.058 45.303 65.0664 54.7662 68.8253L51.813 76.2602C44.2424 73.2531 35.81 73.2464 28.2347 76.2413L25.2934 68.8017Z"/>
      </mask>
      <path d="M25.2934 68.8017C34.7626 65.058 45.303 65.0664 54.7662 68.8253L51.813 76.2602C44.2424 73.2531 35.81 73.2464 28.2347 76.2413L25.2934 68.8017Z" stroke="#212121" stroke-width="8" mask="url(#path-4-inside-2_5_2)"/>
      </g>
      <defs>
      <clipPath id="clip0_5_2">
      <rect width="80" height="80" fill="white"/>
      </clipPath>
      </defs>
      </svg> -->
    </div>

    <!-- <div class="abs">
      {#if actions.length}
        <ButtonComponent isIcon on:click="{() => isMenuToggled = !isMenuToggled}">
          <div class="bar" class:change="{isMenuToggled}">
            <div class="bar1"></div>
            <div class="bar2"></div>
            <div class="bar3"></div>
          </div>
        </ButtonComponent>
        {#if isMenuToggled}
          <MenuComponent items="{actions}"/>
        {/if}
      {/if}
    </div> -->

    <div class="player__progress__text">
      {level}
    </div>

    <div class="player__progress__tooltip">
      <div class="center">
        Level <b>{level}</b><br/>
        <b>{experience}</b> / <b>1000</b> experience<br/>
        <b>{1000 - experience}</b> experience to level <b>{level + 1}</b><br/><br/>
        Casual games: <b>{games.casual.won + games.casual.lost}</b>
      </div>
      {#if games.casual.won + games.casual.lost > 0}
        <br/>
        <ProgressBarComponent isPercentVisible isValueVisible bars={[{
          color: "green",
          progress: (games.casual.won / (games.casual.won + games.casual.lost) * 100),
          val: games.casual.won
        }, {
          color: "red",
          progress: 100 - (games.casual.won / (games.casual.won + games.casual.lost) * 100),
          val: games.casual.lost
        }]}/>
      {/if}
    </div>

  </div>


  <div class="player__info">

    <div style="display: flex; align-items: center; gap: var(--xs)">
      {#if actions.length}
        <div class="rel">
          <ButtonComponent isIcon on:click="{() => isMenuToggled = !isMenuToggled}">
            <div class="bar" class:change="{isMenuToggled}">
              <div class="bar1"></div>
              <div class="bar2"></div>
              <div class="bar3"></div>
            </div>
          </ButtonComponent>
          {#if isMenuToggled}
            <MenuComponent items="{actions}"/>
          {/if}
        </div>
      {/if}
      <div>{name}</div>
      {#if hasUnseenMessages}
        🗩
      {/if}
      {#if leaderboardPosition}
        <div>#{leaderboardPosition}</div>
      {/if}
      {#if status !== undefined}
        <div style="font-size: 12px;">
          {#if status === PlayerStatus.OFFLINE}
            Offline
          {:else if status === PlayerStatus.ONLINE}
            Online
          {:else if status === PlayerStatus.IN_QUEUE}
            In queue
          {:else if status === PlayerStatus.IN_LOBBY}
            In lobby
          {:else if status === PlayerStatus.IN_GAME}
            In game
          {/if}
        </div>
      {/if}
    </div>

    <!-- <div class="player__info__name"> -->
      <!-- {name.slice(0, 6)}
      {#if name.length > 6}
        ...
      {/if} -->
      <!-- {name} -->
    <!-- </div> -->

    

    

    <div style="width: 100%; display: flex; align-items: center; gap: var(--xs)">
      <div class="theimage">
        <img class="player__progress__avatar" src="images/ranks/{rank}.png" alt={rank} height="32" width="32" />
        <div class="player__progress__tooltip">
        <div class="center">
          {#if rank === "Master"}
            Rank <b style="color: {rankColor.get(rank)}">{rank}</b><br/>
            <b>{elo}</b> elo<br/>
          {:else}
            Rank <b style="color: {rankColor.get(rank)}">{rank}</b><br/>
            <b>{elo}</b> / <b>{rankRequirement.get(nextRank)}</b> elo<br/>
            <b>{rankRequirement.get(nextRank) - elo}</b> elo to <b style="color: {rankColor.get(nextRank)}">{nextRank}</b><br/>
          {/if}
          <br/>
          Ranked games: <b>{games.ranked.won + games.ranked.lost}</b>
        </div>
        {#if games.ranked.won + games.ranked.lost > 0}
          <br/>
          <ProgressBarComponent isPercentVisible isValueVisible bars={[{
            color: "green",
            progress: (games.ranked.won / (games.ranked.won + games.ranked.lost) * 100),
            val: games.ranked.won
          }, {
            color: "red",
            progress: 100 - (games.ranked.won / (games.ranked.won + games.ranked.lost) * 100),
            val: games.ranked.lost
          }]}/>
        {/if}
      </div>
</div>
      <div>
        <b>{rank}</b> | <b>{elo}</b> elo<br/>
        <!-- <b style="color: {rankColor.get(rank)}; text-shadow: 0 0 4px rgb(127, 127, 127)">{rank}</b> | <b>{elo}</b> elo<br/> -->
        <!-- <ProgressBarComponent {bars}/> -->
      </div>
    </div>
  </div>


  <!-- <div class="player__progress">
    <img class="player__progress__avatar" src="images/ranks/{rank}.png" alt={rank} height="64" width="64" />

    <div class="player__progress__bar">
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_5_2)">
      <path d="M26.2234 73.2597C18.5286 70.0724 12.177 64.3156 8.25083 56.9703C4.32467 49.6249 3.06686 41.1455 4.69173 32.9767C6.3166 24.808 10.7236 17.4553 17.1619 12.1716C23.6001 6.88789 31.6712 4 40 4C48.3288 4 56.3999 6.8879 62.8382 12.1716C69.2764 17.4554 73.6834 24.808 75.3083 32.9768C76.9331 41.1455 75.6753 49.6249 71.7492 56.9703C67.823 64.3156 61.4714 70.0724 53.7766 73.2597" stroke="#212121" stroke-width="8"/>
      <path class="bar" bind:this={pathElement2} style="stroke-dashoffset: {eloOffset}" d="M24.2751 72.3841C16.9574 68.8308 11.0589 62.9039 7.54081 55.5692C4.02271 48.2346 3.09243 39.9246 4.9016 31.9936C6.71076 24.0626 11.1527 16.9781 17.5035 11.8947C23.8544 6.81126 31.7396 4.02861 39.8743 4.00022C48.009 3.97183 55.9136 6.69936 62.2997 11.7383C68.6859 16.7773 73.1772 23.8306 75.0417 31.7488C76.9061 39.667 76.0339 47.9832 72.5671 55.3423C69.1003 62.7013 63.2433 68.6692 55.9506 72.2735" stroke="{rankColor.get(rank)}" stroke-width="4"/>
      <mask id="path-3-inside-1_5_2" fill="white">
      <path d="M55.3073 76.9552C45.5062 81.0149 34.4938 81.0149 24.6927 76.9552L27.7541 69.5641C35.595 72.812 44.405 72.812 52.2459 69.5641L55.3073 76.9552Z"/>
      </mask>
      <path d="M55.3073 76.9552C45.5062 81.0149 34.4938 81.0149 24.6927 76.9552L27.7541 69.5641C35.595 72.812 44.405 72.812 52.2459 69.5641L55.3073 76.9552Z" stroke="#212121" stroke-width="8" mask="url(#path-3-inside-1_5_2)"/>
      <mask id="path-4-inside-2_5_2" fill="white">
      <path d="M25.2934 68.8017C34.7626 65.058 45.303 65.0664 54.7662 68.8253L51.813 76.2602C44.2424 73.2531 35.81 73.2464 28.2347 76.2413L25.2934 68.8017Z"/>
      </mask>
      <path d="M25.2934 68.8017C34.7626 65.058 45.303 65.0664 54.7662 68.8253L51.813 76.2602C44.2424 73.2531 35.81 73.2464 28.2347 76.2413L25.2934 68.8017Z" stroke="#212121" stroke-width="8" mask="url(#path-4-inside-2_5_2)"/>
      </g>
      <defs>
      <clipPath id="clip0_5_2">
      <rect width="80" height="80" fill="white"/>
      </clipPath>
      </defs>
      </svg>
    </div>

    <div class="player__progress__tooltip">
      <div class="center">
        {#if rank === "Master"}
          Rank <b style="color: {rankColor.get(rank)}">{rank}</b><br/>
          <b>{elo}</b> elo<br/>
        {:else}
          Rank <b style="color: {rankColor.get(rank)}">{rank}</b><br/>
          <b>{elo}</b> / <b>{rankRequirement.get(nextRank)}</b> elo<br/>
          <b>{rankRequirement.get(nextRank) - elo}</b> elo to <b style="color: {rankColor.get(nextRank)}">{nextRank}</b><br/>
        {/if}
        <br/>
        Ranked games: <b>{games.ranked.won + games.ranked.lost}</b>
      </div>
      {#if games.ranked.won + games.ranked.lost > 0}
        <br/>
        <ProgressBarComponent isPercentVisible isValueVisible bars={[{
          color: "green",
          progress: (games.ranked.won / (games.ranked.won + games.ranked.lost) * 100),
          val: games.ranked.won
        }, {
          color: "red",
          progress: 100 - (games.ranked.won / (games.ranked.won + games.ranked.lost) * 100),
          val: games.ranked.lost
        }]}/>
      {/if}
    </div>

    <div class="player__progress__text">
      {elo}
    </div>
  </div> -->


</div>
