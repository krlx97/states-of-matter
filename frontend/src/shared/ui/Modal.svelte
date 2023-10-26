<script lang="ts">
  import {fade, scale} from "svelte/transition";
  import {modalService} from "services";

  let isClosable = true;
  let dark = false;

  const onExit = (): void => {
    if (isClosable) {
      modalService.close();
    }
  };

  export {isClosable, dark};
</script>

<style>
  .modal-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 110;
  }

  .modal-inner {
    max-width: 640px;
    padding: var(--spacing-md);
    backdrop-filter: blur(32px);
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgb(127, 127, 127);
    border-radius: 8px;
    box-sizing: border-box;
  }
</style>

<div style={dark ? "background-color: rgb(0, 0, 0)" : "background-color: rgba(0, 0, 0, 0.5)"} class="modal-wrapper" on:click|self={onExit} on:keypress|self={onExit} in:fade={{duration: 250}}>
  <div class="modal-inner" in:scale={{duration: 250}}>
    <slot/>
  </div>
</div>
