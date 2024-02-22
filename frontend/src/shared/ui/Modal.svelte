<script lang="ts">
  import {fade, scale} from "svelte/transition";
  import {modalService} from "services";

  let isClosable = true;
  let dark = false;
  let width = "320px";

  const onExit = (): void => {
    if (isClosable) {
      modalService.close();
    }
  };

  export {isClosable, dark, width};
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
    background-color: rgba(0, 0, 0, 0.666);
    z-index: 110;
  }

  .modal-inner {
    /* max-width: 640px; */
    /* height: 480px; */
    /* overflow-y: scroll; */
    padding: var(--md);
    backdrop-filter: blur(var(--md));
    background-color: rgba(64, 64, 64, 0.666);
    border: 1px solid rgba(var(--grey), 0.666);
    border-radius: 8px;
    box-sizing: border-box;
  }

  .modal {
    max-width: 640px;
    display: flex;
    flex-direction: column;
    gap: var(--md);
  }

  .modal__title {
    font-size: var(--xl);
    font-weight: bold;
  }

  .modal__info {
    line-height: 1.25;
    text-align: justify;
  }

  .modal__content {
    display: flex;
    flex-direction: column;
    gap: var(--md);
  }
</style>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  style:background-color={dark ? "rgb(0, 0, 0)" : "rgba(0, 0, 0, 0.5)"}
  class="modal-wrapper"
  on:click|self="{onExit}"
  in:fade={{duration: 400}}>

  <div class="modal-inner" in:scale={{duration: 400}}>

    <div class="modal" style:width>
      {#if $$slots.title}
        <div class="modal__title">
          <slot name="title"/>
        </div>
      {/if}
      {#if $$slots.info}
        <div class="modal__info">
          <slot name="info"/>
        </div>
      {/if}
      {#if $$slots.content}
        <div class="modal__content">
          <slot name="content"/>
        </div>
      {/if}
      <slot/>
    </div>

  </div>

</div>
