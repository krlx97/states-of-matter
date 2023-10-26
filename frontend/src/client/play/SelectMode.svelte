<script lang="ts">
  import {QueueId} from "@som/shared/enums";
  import {onDestroy, onMount} from "svelte";
  import {modalService, socketService, soundService} from "services";
  import {casualQueueJoinTime, playerStore, tutorialStore} from "stores";
  import {ProgressBarComponent} from "ui";
  import JoinLobby from "./modals/JoinLobby.svelte";

  $: isInCasualQueue = $playerStore.queueId === QueueId.CASUAL;
  $: isInRankedQueue = $playerStore.queueId === QueueId.RANKED;
  $: isTutorial1 = $tutorialStore.name === "play" && $tutorialStore.currentStep === 0;
  $: isTutorial2 = $tutorialStore.name === "play" && $tutorialStore.currentStep === 1;
  $: isTutorial3 = $tutorialStore.name === "play" && $tutorialStore.currentStep === 2;

  $: isDeckValid = $playerStore.decks[$playerStore.deckId].cardsInDeck === 30;
  let interval: NodeJS.Timer;
  let timeInQueue = "";
  let rank: string;

  const onMakeLobby = (): void => {
    soundService.play("click");
    socketService.socket.emit("createLobby");
  };

  const onJoinLobby = (): void => {
    soundService.play("click");
    modalService.open(JoinLobby);
  };

  const onJoinCasualQueue = (): void => {
    soundService.play("click");
    socketService.socket.emit("joinQueue", {queueId: QueueId.CASUAL});
  };

  const onJoinRankedQueue = (): void => {
    soundService.play("click");
    socketService.socket.emit("joinQueue", {queueId: QueueId.RANKED});
  };

  const onLeaveQueue = (): void => {
    soundService.play("click");
    socketService.socket.emit("leaveQueue");
    clearInterval(interval);
    document.title = "States of Matter";
  };

  onMount((): void => {
    const {elo} = $playerStore;

    if (elo < 250) {
      rank = "Bronze";
    } else if (elo >= 250 && elo < 500) {
      rank = "Silver";
    } else if (elo >= 500 && elo < 750) {
      rank = "Gold";
    } else if (elo >= 750) {
      rank = "Master";
    }

    interval = setInterval((): void => {
      const date = new Date(Date.now() - $casualQueueJoinTime);
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();

      timeInQueue = `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
      document.title = `${timeInQueue} | States of Matter`;
    }, 1000);
  });

  onDestroy((): void => {
    clearInterval(interval);
  });
</script>

<style>
  /* .modes--wrapper {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  } */

  .modes {
    position: relative;
    height: 440px;
    width: 100%;
    display: flex;
    padding: var(--spacing-xl);
    /* align-items: center; */
  }

  .invalid-deck {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    line-height: 1.5;
    font-size: var(--spacing-xlg);
  }

  .mode {
    height: 100%;
    padding: var(--spacing-md);
    flex-basis: 33.3333%;
    display: flex;
    flex-direction: column;
    /* align-items: center; */
    justify-content: center;
    text-align: center;
    box-sizing: border-box;
  }

  .mode__stats {
    flex-grow: 1;
    padding: var(--spacing-md);
    /* height: 320px; */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
box-sizing: border-box;
  }

  .mode__info {
height: 164px;
    margin-block: 1em;
    font-size: 16px;
    line-height: 1.4em;
text-align: justify;
    text-justify: inter-word;
    /* flex-grow: 1; */
    /* justify-self: flex-end;
    height: 320px; */

  }

  .mode__actions {
    margin-top: var(--spacing-md);
    display: flex;
    justify-content: space-evenly;
  }

  .red {color: rgb(var(--red));}

.isTutorial1, .isTutorial2, .isTutorial3 {
    position: relative;
    z-index: 101;
  }
</style>

<!-- <div class="modes--wrapper"> -->
  <div class="modes">
    {#if !isDeckValid}
      <div class="invalid-deck red">
        You must add 30 cards in your selected deck before you can play. Head over
        to Deck Builder page and build your first deck.
      </div>
    {:else}
      <div class="mode" class:isTutorial1>
        {#if isInCasualQueue}
          <h2>Queue time: {timeInQueue}</h2>
        {:else}
          <h2>CASUAL</h2>
        {/if}

        <div class="mode__info">
          Jump into the casual queue and get matched with players of similar skill
          level for fair and balanced play. Gain experience and earn rewards as you
          level up, showcasing your progress to the world. Ready to have some fun?
        </div>

        <div class="mode__stats">
          <table>
            <tr>
              <td>WON</td>
              <td>{$playerStore.games.casual.won}</td>
            </tr>
            <tr>
              <td>LOST</td>
              <td>{$playerStore.games.casual.lost}</td>
            </tr>
            {#if $playerStore.games.casual.won + $playerStore.games.casual.lost !== 0}
              <tr>
                <td>WIN RATE</td>
                <td>{($playerStore.games.casual.won / ($playerStore.games.casual.won + $playerStore.games.casual.lost) * 100).toFixed(2) || 0}%</td>
              </tr>
            {/if}
          </table>
          {#if $playerStore.games.casual.won + $playerStore.games.casual.lost !== 0}
            <ProgressBarComponent bars={[{
              color: "green",
              progress: ($playerStore.games.casual.won / ($playerStore.games.casual.won + $playerStore.games.casual.lost) * 100)
            }, {
              color: "red",
              progress: 100 - ($playerStore.games.casual.won / ($playerStore.games.casual.won + $playerStore.games.casual.lost) * 100)
            }]}/>
          {/if}
        </div>

        <div class="mode__actions">
          {#if isInCasualQueue}
            <button class="button" on:click={onLeaveQueue}>LEAVE</button>
          {:else}
            <button class="button" on:click={onJoinCasualQueue} disabled={isInRankedQueue || !isDeckValid}>
              PLAY
            </button>
          {/if}
        </div>
      </div>

      <div class="mode" class:isTutorial2>
        {#if isInRankedQueue}
          <h2>Queue time: {timeInQueue}</h2>
        {:else}
          <h2>RANKED</h2>
        {/if}

        <div class="mode__info">
          Ready to show off your skills? Enter the Ranked queue and compete against other players of your skill level in a highly competitive environment. Rise through the ranks and earn rewards as you climb the ladder, showcasing your dominance to the world. So what are you waiting for? Step into the queue and prove you're the best!
        </div>

        <div class="mode__stats">
          <div>
            <img class="rank__img" src="assets/ranks/{rank}.png" alt={rank}/>
          </div>
          <table>
            <tr>
              <td>ELO</td>
              <td>{$playerStore.elo}</td>
            </tr>
            <tr>
              <td>RANK</td>
              <td>{rank}</td>
            </tr>
            <tr>
              <td>WON</td>
              <td>{$playerStore.games.ranked.won}</td>
            </tr>
            <tr>
              <td>LOST</td>
              <td>{$playerStore.games.ranked.lost}</td>
            </tr>
            {#if $playerStore.games.ranked.won + $playerStore.games.ranked.lost !== 0}
              <tr>
                <td>WIN RATE</td>
                <td>{($playerStore.games.ranked.won / ($playerStore.games.ranked.won + $playerStore.games.ranked.lost) * 100).toFixed(2) || 0}%</td>
              </tr>
            {/if}
          </table>
          {#if $playerStore.games.ranked.won + $playerStore.games.ranked.lost !== 0}
            <ProgressBarComponent bars={[{
              color: "green",
              progress: ($playerStore.games.ranked.won / ($playerStore.games.ranked.won + $playerStore.games.ranked.lost) * 100)
            }, {
              color: "red",
              progress: 100 - ($playerStore.games.ranked.won / ($playerStore.games.ranked.won + $playerStore.games.ranked.lost) * 100)
            }]}/>
          {/if}

        </div>

        <div class="mode__actions">
          {#if isInRankedQueue}
            <button class="button" on:click={onLeaveQueue}>LEAVE</button>
          {:else}
            <button class="button" on:click={onJoinRankedQueue} disabled={isInCasualQueue || !isDeckValid}>
              PLAY
            </button>
          {/if}
        </div>
      </div>

      <div class="mode" class:isTutorial3>
        <h2>CUSTOM</h2>
        <div class="mode__stats"></div>
        <!-- <div class="mode__info">
          Create your own versus or tournament lobbies and challenge your friends
          to an epic battle. Settle scores, test your skills, and compete for the
          ultimate prize. No rules, no limits – winner takes all. Are you ready to
          dominate the competition? It's game time!
        </div> -->
        <div class="mode__actions">
          <button
            class="button"
            on:click={onMakeLobby}
            disabled={isInCasualQueue || isInRankedQueue || !isDeckValid}
          >
            CREATE
          </button>
          <button
            class="button"
            on:click={onJoinLobby}
            disabled={isInCasualQueue || isInRankedQueue || !isDeckValid}
          >
            JOIN
          </button>
        </div>
      </div>
    {/if}

  </div>
<!-- </div> -->
