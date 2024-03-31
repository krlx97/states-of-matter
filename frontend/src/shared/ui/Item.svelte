<script lang="ts">
  import {onMount} from "svelte";
  import {TextComponent} from "ui";

  let item: any;
  let shardElement: HTMLDivElement;
  let shardElementRect: DOMRect;
  let isBalancesVisible = true;
  let isGrayscaled = false;

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

  export {item, isBalancesVisible, isGrayscaled};
</script>

<style>
  .item {
    /* height: 180px; */
    width: 110px;
    color: rgb(var(--white));
    background-color: rgb(var(--dark-grey));
    border: 1px solid rgb(var(--grey), var(--opacity-sm));
    border-radius: 8px;
    box-sizing: border-box;
    cursor: pointer;
    transform: perspective(320px);
    transition:
      border-color 250ms ease,
      color 250ms ease,
      transform 50ms linear;
    overflow: hidden;
  }

  .item__img, video {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 136px;
    width: 108px;
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
  }

  .item__title {
    height: 28px;
    padding: 0 4px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: var(--sm);
  }

  .common:hover {
    border-color: rgba(var(--common), var(--opacity-md));
  }

  .uncommon:hover {
    border-color: rgba(var(--uncommon), var(--opacity-md));
  }

  .rare:hover {
    border-color: rgba(var(--rare), var(--opacity-md));
  }

  .epic:hover {
    border-color: rgba(var(--epic), var(--opacity-md));
  }

  .legendary:hover {
    border-color: rgba(var(--legendary), var(--opacity-md));
  }

  .mythic:hover {
    border-color: rgba(var(--mythic), var(--opacity-md));
  }

  .commona {
    color: rgb(var(--common));
  }

  .uncommona {
    color: rgb(var(--uncommon));
  }

  .rarea {
    color: rgb(var(--rare));
  }

  .epica {
    color: rgb(var(--epic));
  }

  .legendarya {
    color: rgb(var(--legendary));
  }

  .mythica {
    color: rgb(var(--mythic));
  }

  .isGrayscale {
    filter: grayscale(1);
  }
</style>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="item"
  class:common={item.rarity === 0}
  class:uncommon={item.rarity === 1}
  class:rare={item.rarity === 2}
  class:epic={item.rarity === 3}
  class:legendary={item.rarity === 4}
  class:mythic={item.rarity === 5}
  bind:this={shardElement}
  on:mousemove={onMousemove}
  on:mouseleave={onMouseleave}>

  {#if item.rarity === 0}
    <div class="item__img">
      {#if item.type === 0}
        <img class:isGrayscale={isGrayscaled && item.owned < 1n} src="images/items/{item.id}.png" alt="{item.name}" style:border-radius="50%">
      {:else if item.type === 1}
        <img class:isGrayscale={isGrayscaled && item.owned < 1n} src="images/items/{item.id}.png" alt="{item.name}" width="108">
      {:else}
        <img class:isGrayscale={isGrayscaled && item.owned < 1n} src="images/items/{item.id}.png" alt="{item.name}" height="136" width="108">
      {/if}
    </div>
  {:else}
    {#if item.rarity === 2}
      <div class="item__img">
        {#if item.type === 0}
          <img class:isGrayscale={isGrayscaled && item.balance < 1n} src="images/items/{item.id}.png" alt="{item.name}" style:border-radius="50%">
        {:else if item.type === 1}
          <img class:isGrayscale={isGrayscaled && item.balance < 1n} src="images/items/{item.id}.png" alt="{item.name}" width="108">
        {:else}
          <img class:isGrayscale={isGrayscaled && item.balance < 1n} src="images/items/{item.id}.png" alt="{item.name}" height="136" width="108">
        {/if}
      </div>
    {:else}
      <div class="item__img">
        <video autoplay loop muted class:isGrayscale={isGrayscaled && item.balance < 1n}>
          <source src="images/items/{item.id}.webm" type="video/webm"/>
          {item.name}
        </video>
      </div>
    {/if}
  {/if}

  <div class="item__title">
    <div
      style="text-align: center;"
      class:commona={item.rarity === 0}
      class:uncommona={item.rarity === 1}
      class:rarea={item.rarity === 2}
      class:epica={item.rarity === 3}
      class:legendarya={item.rarity === 4}
      class:mythica={item.rarity === 5}>
      {item.name}
    </div>
    {#if isBalancesVisible}
      <div>
        {#if item.rarity === 0}
          <div style="text-align: center;">
          <TextComponent color="{item.owned > 0n ? "success" : "warn"}">
            {item.owned > 0n ? "✔" : "×"}
          </TextComponent>
          </div>
        {:else}
          <div style="width: 100%; display: flex; justify-content: center;">
            <div>{item.balance} [{item.shards}]</div>
          </div>
        {/if}
      </div>
    {/if}
  </div>

</div>
