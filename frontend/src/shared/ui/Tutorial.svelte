<script lang="ts">
  import {onMount} from "svelte";
  import {socketService} from "services";
  import {playerStore, tutorialStore} from "stores";

  let tutorial: keyof typeof $playerStore.tutorial;
  let steps: Array<any>;
  let currentStep = 0;

  const onPreviousStep = (): void => {
    currentStep -= 1;
    $tutorialStore.currentStep = currentStep;
  };

  const onNextStep = (): void => {
    currentStep += 1;
    $tutorialStore.currentStep = currentStep;
  };

  const onFinish = (): void => {
    socketService.socket.emit("finishTutorial" as any, {tutorial});
  };

  onMount(() => {
    $tutorialStore.name = tutorial;
    $tutorialStore.currentStep = currentStep;
  });

  export {tutorial, steps};
</script>

<style>
  .tutorial-overlay {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 100;
  }
  .tutorial {
    position: fixed;
    /* width: 20%;
    height: 20%; */
    /* margin: 32px; */
    width: 384px;
    z-index: 101;
    padding: var(--spacing-md);
backdrop-filter: blur(32px);
    background-color: rgba(255, 255, 255, 0.1);
    border: 2px solid rgb(127, 127, 127);
    border-radius: 8px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-md);
  }

  .text {
        /* text-align: justify; */
    line-height: 1.4;
    margin-bottom: var(--spacing-md);

  }

  .actions {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  /* .text img {
    display: inline;
  } */
</style>

<div class="tutorial-overlay"></div>

<div style={steps[currentStep].position} class="tutorial">
  <!-- <div class="text">{@html steps[currentStep].text}</div> -->
  <!-- <div> -->
    <svelte:component this={steps[currentStep].component}/>
  <!-- </div> -->
  <div class="actions">
    <!-- {#if currentStep > 0} -->
      <button on:click={onPreviousStep} disabled={currentStep < 1}>PREVIOUS</button>
    <!-- {/if} -->
    <div>{currentStep + 1} / {steps.length}</div>
    {#if currentStep >= steps.length - 1}
      <button on:click={onFinish}>FINISH</button>
    {:else}
      <button on:click={onNextStep}>NEXT</button>
    {/if}
  </div>
</div>
