<script lang="ts">
  import {onMount} from "svelte";
  import {modalService, soundService} from "services";
  import {intervals, modalStore, queueStore} from "stores";
  import {ModalComponent, PlayerFrameComponent, ProgressBarComponent} from "ui";

  const {playerA, playerB} = $modalStore.data;
  let progress = 100;
  let start = 0;

  const progressBarAnimation = (timestamp: number): void => {
    if (!start) {
      start = timestamp;
    }

    const elapsed = timestamp - start;
    progress = 100 - (elapsed / 6000 * 100);

    if (progress > 0) {
      requestAnimationFrame(progressBarAnimation);
    } else {
      modalService.close();

      queueStore.update((store) => {
        store.timeInQueue = "00:00";
        document.title = "States of Matter";
        return store;
      });

      clearInterval(intervals[2]);
    }
  };

  onMount((): void => {
    soundService.play("duelStart");
    requestAnimationFrame(progressBarAnimation);
  });
</script>

<style>
  .players {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    margin-bottom: var(--md);
  }

  .vs {
    text-align: center;
    font-size: 3rem;
    padding: 16px 0;
  }
</style>

<ModalComponent isClosable={false} dark>
  <div class="players">
    <PlayerFrameComponent {...playerA}/>
    <div class="vs">VS</div>
    <PlayerFrameComponent {...playerB}/>
  </div>

  <ProgressBarComponent bars={[{color: "purple", progress}]}/>
</ModalComponent>
