<script lang="ts">
  import {onMount} from "svelte";
  import {socketService, soundService} from "services";
  import {gamePopupStore} from "stores";
  import {ModalComponent, ProgressBarComponent} from "ui";

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
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .game-popup__title {
    font-size: var(--font-xlg);
    text-align: center;
  }

  .game-popup__players {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }

  .game-popup__actions {
    display: flex;
    gap: var(--spacing-md);
  }

  .grey {color: rgb(31, 31, 31);}
</style>

<ModalComponent isClosable={false}>
  <div class="game-popup">
    <div class="game-popup__title">Game found</div>
    <div class="game-popup__players">
      <i
        class="fa-solid fa-user fa-2x"
        class:green={$gamePopupStore.playersAccepted > 0}
        class:grey={$gamePopupStore.playersAccepted === 0}
      ></i>
      <i
        class:green={$gamePopupStore.playersAccepted > 1}
        class:grey={$gamePopupStore.playersAccepted < 2}
        class="fa-solid fa-user fa-2x grey"
      ></i>
    </div>
    <div class="game-popup__actions">
      <button class="button" on:click={onAccept}>ACCEPT</button>
      <button class="button" on:click={onDecline}>DECLINE</button>
    </div>
    <ProgressBarComponent bars={[{
      color: "purple",
      progress
    }]}/>
  </div>
</ModalComponent>
