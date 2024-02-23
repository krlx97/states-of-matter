<script lang="ts">
  import {QueueId} from "@som/shared/enums";
  import {modalService, socketService, soundService} from "services";
  import {playerStore, tutorialStore, queueStore} from "stores";
  import {ButtonComponent, TextComponent} from "ui";
  import JoinLobbyComponent from "./modals/JoinLobby.svelte";
  import GameEnded from "./modals/GameEnded.svelte";
  // import GameEndedComponent from "./modals/GameEnded.svelte";

  $: isInCasualQueue = $playerStore.queueId === QueueId.CASUAL;
  $: isInRankedQueue = $playerStore.queueId === QueueId.RANKED;
  $: isTutorial1 = $tutorialStore.name === "play" && $tutorialStore.currentStep === 0;
  $: isTutorial2 = $tutorialStore.name === "play" && $tutorialStore.currentStep === 1;
  $: isTutorial3 = $tutorialStore.name === "play" && $tutorialStore.currentStep === 2;
  $: isDeckValid = $playerStore.decks[$playerStore.deckId].cardsInDeck === 30;

  const onMakeLobby = (): void => {
    soundService.play("click");
    socketService.socket.emit("createLobby");
  };

  const onJoinLobby = (): void => {
    soundService.play("click");
    modalService.open(JoinLobbyComponent);
  };

  const onJoinCasualQueue = (): void => {
    soundService.play("click");

    socketService.socket.emit("joinQueue", {
      queueId: QueueId.CASUAL
    });
  };

  const onJoinRankedQueue = (): void => {
    soundService.play("click");

    socketService.socket.emit("joinQueue", {
      queueId: QueueId.RANKED
    });
  };

  const onLeaveQueue = (): void => {
    soundService.play("click");
    socketService.socket.emit("leaveQueue");
  };

  const onDeckBuilder = (): void => {
    soundService.play("click");

  };
</script>

<style>
  .modes {
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mode {
    flex-basis: 33.3333%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    box-sizing: border-box;
    transition: background-color 400ms ease-in-out;
  }

  .mode__actions {
    margin-top: var(--md);
    display: flex;
    justify-content: space-evenly;
  }

  .isTutorial1, .isTutorial2, .isTutorial3 {
    position: relative;
    z-index: 101;
  }

  /* .casual:hover {
    background-color: rgba(0, 255, 0, 0.1);
  }
  .ranked:hover {
    background-color: rgba(255, 0, 0, 0.1);
  }
  .custom:hover {
    background-color: rgba(128, 0, 255, 0.1);
  } */
  .big {font-size: var(--xl);}
</style>

<div class="modes">
  {#if !isDeckValid}
    <!-- <div style="display: flex; flex-direction: column; gap: 16px;"> -->
      <TextComponent color="warn">
        <span class="big">
          You must add 30 cards in your selected deck before you can play. Head over
          to Deck Builder page and build your first deck.
        </span>
      </TextComponent>
      <!-- <div style="display: flex; justify-content: center;">
        <ButtonComponent on:click="{onDeckBuilder}">DECK BUILDER</ButtonComponent>
      </div> -->
    <!-- </div> -->
  {:else}
    <div class="mode casual" class:isTutorial1>
      {#if isInCasualQueue}
        <h2>Queue time: {$queueStore.timeInQueue}</h2>
      {:else}
        <h2>NORMAL</h2>
      {/if}
      <div class="mode__actions">
        {#if isInCasualQueue}
          <ButtonComponent on:click="{onLeaveQueue}">LEAVE</ButtonComponent>
        {:else}
          <ButtonComponent
            on:click={onJoinCasualQueue}
            disabled={isInRankedQueue || !isDeckValid || isTutorial1}>
            PLAY
          </ButtonComponent>
        {/if}
      </div>
    </div>

    <div class="mode ranked" class:isTutorial2>
      {#if isInRankedQueue}
        <h2>Queue time: {$queueStore.timeInQueue}</h2>
      {:else}
        <h2>RANKED</h2>
      {/if}
      <div class="mode__actions">
        {#if isInRankedQueue}
          <ButtonComponent on:click="{onLeaveQueue}">LEAVE</ButtonComponent>
        {:else}
          <ButtonComponent
            on:click="{onJoinRankedQueue}"
            disabled="{isInCasualQueue || !isDeckValid || isTutorial2}">
            PLAY
          </ButtonComponent>
        {/if}
      </div>
    </div>

    <div class="mode custom" class:isTutorial3>
      <h2>CUSTOM LOBBY</h2>
      <div class="mode__actions">
        <ButtonComponent
          on:click="{onMakeLobby}"
          disabled="{isInCasualQueue || isInRankedQueue || !isDeckValid || isTutorial3}">
          CREATE
        </ButtonComponent>
        <ButtonComponent
          on:click="{onJoinLobby}"
          disabled="{isInCasualQueue || isInRankedQueue || !isDeckValid || isTutorial3}">
          JOIN
        </ButtonComponent>
      </div>
    </div>
  {/if}
</div>
