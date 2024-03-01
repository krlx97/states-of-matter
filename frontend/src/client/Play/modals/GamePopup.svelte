<script lang="ts">
  import {onMount} from "svelte";
  import {socketService, soundService} from "services";
  import {gamePopupStore} from "stores";
  import {ButtonComponent, ModalComponent, ProgressBarComponent} from "ui";

  const {socket} = socketService;
  let progress = 100;
  let start = 0;

  const onAccept = (): void => {
    soundService.play("click");
    socket.emit("acceptGame");
  };

  const onDecline = (): void => {
    soundService.play("click");
    socket.emit("declineGame");
  };

  const progressBarAnimation = (timestamp: number): void => {
    if (!start) {
      start = timestamp;
    }

    const elapsed = timestamp - start;

    progress = 100 - (elapsed / 10_000 * 100);

    if (progress > 0) {
      requestAnimationFrame(progressBarAnimation);
    }
  };

  onMount((): void => {
    requestAnimationFrame(progressBarAnimation);
  });
</script>

<style>
  .game-popup {
    width: 320px;
    height: 320px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: var(--md);
  }

  .game-popup__title {
    font-size: var(--font-xlg);
    text-align: center;
  }

  .game-popup__actions {
    display: flex;
    gap: var(--md);
  }
</style>

<ModalComponent isClosable={false} dark>
  <div class="game-popup">

      <div class="game-popup__title">Game found</div>
    <!-- <div>

    </div> -->
      <div>
        {#if !$gamePopupStore.hasPlayerAccepted && !$gamePopupStore.hasOpponentAccepted}
          Please accept the match.
        {:else if $gamePopupStore.hasPlayerAccepted && !$gamePopupStore.hasOpponentAccepted}
          Waiting for opponent...
        {:else if !$gamePopupStore.hasPlayerAccepted && $gamePopupStore.hasOpponentAccepted}
          Opponent has accepted the match.
        {/if}
      </div>

    {#if !$gamePopupStore.hasPlayerAccepted}
      <div class="game-popup__actions">
        <ButtonComponent on:click={onAccept}>ACCEPT</ButtonComponent>
        <ButtonComponent on:click={onDecline}>DECLINE</ButtonComponent>
      </div>
    {/if}

    <ProgressBarComponent bars={[{
      color: "purple",
      progress
    }]}/>

  </div>
</ModalComponent>
