<script lang="ts">
  import {miscService} from "services";

  const onExit = (): void => {
    miscService.closeModal();
  };
</script>

<style>
  .wrapper--modal {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 100;
  }

  .modal {
    max-width: 640px;
    padding: var(--spacing-lg);
    backdrop-filter: blur(32px);
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgb(128, 128, 128);
    border-radius: 8px;
    box-sizing: border-box;
    z-index: 101;
  }
</style>

<div class="wrapper--modal" on:click|self={onExit} on:keypress|self={onExit}>
  <div class="modal">
    <slot/>
  </div>
</div>
