<script lang="ts">
  import {onMount} from "svelte";

  let item: any;
  let shardElement: HTMLDivElement;
  let shardElementRect: DOMRect;

  const onMousemove = (event: MouseEvent): void => {
    const {pageX, pageY} = event;
    const {top, left, height, width} = shardElementRect;
    const percentX = (pageX - (left + width / 2)) / (width / 2);
    const percentY = -((pageY - (top + height / 2)) / (height / 2));

    shardElement.style.transform = `
      perspective(320px)
      rotateY(${percentX * 12}deg)
      rotateX(${percentY * 12}deg)
    `;
  };

  const onMouseleave = (): void => {
    shardElement.style.transform = "perspective(320px) rotateY(0) rotateX(0)";
  };

  onMount((): void => {
    shardElementRect = shardElement.getBoundingClientRect();
  });

  export {item};
</script>

<style>
  .item {
    height: 160px;
    width: 112px;
    color: rgb(127, 127, 127);
    background-color: rgb(31, 31, 31);
    border: 2px solid rgb(127, 127, 127);
    border-radius: 8px;
    box-sizing: border-box;
    cursor: pointer;
    transform: perspective(320px);
    transition:
      border-color 250ms ease,
      color 250ms ease,
      transform 50ms linear;
  }

  .item__img, video {
    height: 136px;
    width: 108px;
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
  }

  .item__title {
    padding-top: 6px;
    text-align: center;
    font-size: var(--font-xsm);
  }

  .none:hover {
    border-color: rgb(255, 255, 255);
    color: rgb(255, 255, 255);
  }

  .uncommon:hover {
    border-color: rgb(var(--green));
    color: rgb(var(--green));
  }

  .rare:hover {
    border-color: rgb(var(--blue));
    color: rgb(var(--blue));
  }

  .epic:hover {
    border-color: rgb(var(--purple));
    color: rgb(var(--purple));
  }
</style>

<div
  class="item"
  class:none={!item.rarity}
  class:uncommon={item.rarity === 0}
  class:rare={item.rarity === 1}
  class:epic={item.rarity === 2}
  bind:this={shardElement}
  on:mousemove={onMousemove}
  on:mouseleave={onMouseleave}
>
  {#if item.rarity === 0 || !item.rarity}
    <img class="item__img" src="assets/items/{item.type === 1 ? item.id - 1 : item.id}.png" alt={item.name}>
  {:else}
    <!-- <div class="item__img"> -->
      <video autoplay loop muted>
        <source src="assets/items/{item.type === 1 ? item.id - 1 : item.id}.webm" type="video/webm"/>
        {item.name}
      </video>
    <!-- </div> -->
  {/if}
  <div class="item__title">{item.name}</div>
</div>
