<script lang="ts">
  import {onMount} from "svelte";
  import {accountStore, playerStore} from "stores";
  import { miscService } from "services";

  let rank: string;
  let w: HTMLDivElement;
  let l: HTMLDivElement;

  const onCopyToClipboard = (): void => {
    navigator.clipboard.writeText($accountStore.profile.privateKey);
    miscService.showNotification("Private key copied to clipboard.");
  };

  onMount((): void => {
    const {elo} = $playerStore.games.ranked;

    if (elo < 1000) {
      rank = "bronze";
    } else if (elo >= 1000 && elo < 1500) {
      rank = "silver";
    } else if (elo >= 1500 && elo < 2000) {
      rank = "gold";
    } else if (elo >= 2000) {
      rank = "master";
    }

    w.style.width = `${$playerStore.games.ranked.won / ($playerStore.games.ranked.won + $playerStore.games.ranked.lost) * 100}%`;
    l.style.width = `${$playerStore.games.ranked.lost / ($playerStore.games.ranked.won + $playerStore.games.ranked.lost) * 100}%`;
  });
</script>

<style>
  .profile {
    padding: var(--spacing-md);
  }

  .profile__rank {
    padding: var(--spacing-md) 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
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
  }

  .profile__rank__info {
    line-height: 1.4;
    text-align: center;
  }


  .win__progress {
    height: 8px;
    width: 256px;
    /* border: 1px solid orange; */
    /* box-sizing: border-box; */
    display: flex;
    /* border-radius: 8px; */
    box-shadow: var(--elevation-md);
  }

  .win__progress__bar__w {
    height: 8px;
    background-color: rgb(var(--green));
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    /* border-radius: 8px; */
  }

  .win__progress__bar__l {
    height: 8px;
    background-color: rgb(var(--red));
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    /* border-radius: 8px; */
  }

  .rank__img {
    margin: var(--spacing-md) 0;
  }

  .profile__key {
    padding: var(--spacing-md) 0;
    line-height: 1.4;
  }

  .f-red {color: rgb(var(--red));}
  .f-green {color: rgb(var(--green));}
  .f-purple {color: rgb(var(--purple));}

  .private-key {
    cursor: pointer;
    padding: var(--spacing-md) 0;
    font-family: monospace;
  }
</style>

<div class="profile">
  <div class="profile__rank">
    <div>JOINED: {new Date($accountStore.profile.joinedAt * 1000).toLocaleDateString()} | Rank: {rank}</div>
    <img class="rank__img" src="assets/ranks/{rank}.png" alt="{rank}"/>
    <div class="profile__rank__info">
      <div>
        ELO: <span class="f-purple">{$playerStore.games.ranked.elo}</span>
      </div>
      <div>
        W:
        <span class="f-green">{$playerStore.games.ranked.won}</span>
        | L:
        <span class="f-red">{$playerStore.games.ranked.lost}</span>
        | WR:
        {($playerStore.games.ranked.won / ($playerStore.games.ranked.won + $playerStore.games.ranked.lost) * 100).toFixed(2) || 0}%
      </div>
      <div class="win__progress">
        <div class="win__progress__bar__w" bind:this={w}></div>
        <div class="win__progress__bar__l" bind:this={l}></div>
      </div>
    </div>
  </div>

  <div class="profile__key">
    Private Key:
    <div class="private-key" on:click={onCopyToClipboard}>
      <u>{$accountStore.profile.privateKey}</u>
    </div>
    <em>
      Click to copy to clipboard. Please securely store your Eternitas account
      private key. If you lose access to the private key the account will be
      permanently lost.
    </em>
  </div>

  <div class="profile__key">
    Activated:
    <div class="private-key">{$accountStore.profile.isActivated ? "Yes" : "No"}</div>
    <em>Activate your account by paying a one time fee of 10 TLOS in order to be able to transfer tokens.</em>
  </div>
  <br/><br/>
  <button>LOGOUT</button>
</div>
