<script lang="ts">
  let tooltipElement: HTMLDivElement;
  export let width = "480px";

  export const onMousemove = (event: MouseEvent): void => {
    const {clientX, clientY} = event;
    const {offsetHeight, offsetWidth} = tooltipElement;
    const x = clientX - offsetWidth / 2;
    let y = clientY - offsetHeight - 32;

    if (y < 0) {
      y = clientY + 32;
    }

    tooltipElement.style.opacity = "1";
    tooltipElement.style.top = `${y}px`;
    tooltipElement.style.left = `${x}px`;
  };

  export const onMouseout = (): void => {
    tooltipElement.style.opacity = "0";
  };
</script>

<style>
  .tooltip {
    position: fixed;
    width: 480px;
    padding: var(--sm);
    backdrop-filter: blur(8px);
    background-color: rgba(var(--dark-grey), 0.9);
    border: 1px solid rgba(var(--grey), var(--opacity-sm));
    border-radius: 8px;
    opacity: 0;
    z-index: 30;
    transition: opacity 333ms cubic-bezier(var(--ease-in-out-quart));
  }
</style>

<div class="tooltip" style:width bind:this="{tooltipElement}">
  <slot/>
</div>
