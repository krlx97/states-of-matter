<script lang="ts">
  import {onMount} from "svelte";
  import {modalService, soundService} from "services";
  import {gameStore, modalStore, playerStore} from "stores";
  import {ModalComponent, ProgressBarComponent} from "ui";

  const {playerA, playerB, game} = $modalStore.data;
  let progress = 100;
  let start = 0;

  const progressBarAnimation = (timestamp: number): void => {
    if (!start) {
      start = timestamp;
    }

    const elapsed = timestamp - start;
    progress = 100 - (elapsed / 5000 * 100);

    if (progress > 0) {
      requestAnimationFrame(progressBarAnimation);
    } else {
      // gameStore.set(game);
      modalService.close();
    }
  };

  onMount((): void => {
soundService.play("accept");
    requestAnimationFrame(progressBarAnimation);
  });
</script>

<style>
  .players {
    width: 320px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    margin-bottom: var(--spacing-md);
  }

  .player {
    width: 100%;
    display: flex;
    align-items: center;
    border: 1px solid rgb(127, 127, 127);
    border-radius: 8px;
    padding: var(--spacing-md);
    box-sizing: border-box;
  }

  .player__avatar {
    margin-right: var(--spacing-md);
  }

  .player__info {
    line-height: 1.4;
  }

  .player__name {
    font-size: 24px;
  }

  .vs {
    text-align: center;
    font-size: 3rem;
    padding: 16px 0;
  }
</style>

<ModalComponent isClosable={false} dark={true}>
  <div class="players">
    <div class="player">
      <img class="player__avatar" src="assets/avatars/{playerA.avatarId}.png" alt="Avatar"/>
      <div class="player__info">
        <span
          class="player__name"
          class:green={playerA.name === $playerStore.name}
          class:red={playerA.name !== $playerStore.name}
        >
          {playerA.name}
        </span>
        <br/>
        Level {playerA.level}
        |
        Elo {playerA.elo}
      </div>
    </div>
    <div class="vs">VS</div>
    <div class="player">
      <img class="player__avatar" src="assets/avatars/{playerB.avatarId}.png" alt="Avatar"/>
      <div class="player__info">
        <span
          class="player__name"
          class:green={playerA.name !== $playerStore.name}
          class:red={playerA.name === $playerStore.name}
        >
          {playerB.name}
        </span>
        <br/>
        Level {playerB.level} | Elo {playerB.elo}
      </div>
    </div>
  </div>
  <ProgressBarComponent bars={[{color: "purple", progress}]}/>
</ModalComponent>
