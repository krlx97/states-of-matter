<script lang="ts">
  let isHovered = false;
  let title = "";
  let x: number;
  let y: number;

  $: style = `top: ${ y }px; left: ${ y }px;`;

  const onMouseEnter = (event: MouseEvent): void => {
    isHovered = true;
    x = event.pageX;
    y = event.pageY;
  };
  const onMouseLeave = (): void => { isHovered = false; };
  const onMouseMove = (event: MouseEvent): void => {
    x = event.pageX;
    y = event.pageY;
  };

  export {title};
</script>

<style>
  .tooltip-wrapper {
    position: relative;
    border: 1px solid red;
  }
  .tooltip {
    position: absolute;
  }
</style>

<div
  class="tooltip-wrapper"
  on:mouseenter={onMouseEnter}
  on:mouseleave={onMouseLeave}
  on:mousemove={onMouseMove}>
  <slot/>

  {#if isHovered}
    <div class="tooltip" style="top: {y}px; left: {x}px;">
      {title}
    </div>
  {/if}
</div>

