<script lang="ts">
  import {onMount} from "svelte";
  import {TextComponent} from "ui";
    import { inventoryStore } from "stores";

  let item: any;
  let shardElement: HTMLDivElement;
  let shardElementRect: DOMRect;
  let invitem: any = {id: 0n, balance: 0n, supply: 0n};

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
    invitem = $inventoryStore.items.find((i) => i.id === BigInt(item.id));
    shardElementRect = shardElement.getBoundingClientRect();
  });

  export {item};
</script>

<style>
  .item {
    /* height: 180px; */
    width: 110px;
    color: rgb(127, 127, 127);
    background-color: rgb(31, 31, 31);
    border: 1px solid rgb(127, 127, 127);
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
    /* align-items: center; */
    justify-content: center;
    font-size: var(--xs);
  }

  .none:hover {
    border-color: rgb(255, 255, 255);
    color: rgb(255, 255, 255);
  }

  .common:hover {
    border-color: rgb(var(--common));
    color: rgb(var(--common));
  }

  .uncommon:hover {
    border-color: rgb(var(--uncommon));
    color: rgb(var(--uncommon));
  }

  .rare:hover {
    border-color: rgb(var(--rare));
    color: rgb(var(--rare));
  }

  .epic:hover {
    border-color: rgb(var(--epic));
    color: rgb(var(--epic));
  }

  .legendary:hover {
    border-color: rgb(var(--legendary));
    color: rgb(var(--legendary));
  }

  .mythic:hover {
    border-color: rgb(var(--mythic));
    color: rgb(var(--mythic));
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

  {#if item.rarity === 0 || item.rarity === 3}
    <div class="item__img">
      {#if item.type === 0}
        <img src="images/items/{item.id}.png" alt="{item.name}" style:border-radius="50%">
      {:else if item.type === 1}
        <img src="images/items/{item.id}.png" alt="{item.name}" width="108">
      {:else}
        <img src="images/items/{item.id}.png" alt="{item.name}" height="136" width="108">
      {/if}
    </div>
  {:else}
    <div class="item__img">
      <video autoplay loop muted>
        <source src="images/items/{item.id}.webm" type="video/webm"/>
        {item.name}
      </video>
    </div>
  {/if}

  <div class="item__title">
    <div style="text-align: center;">{item.name}</div>
    <div>
      {#if item.rarity === 0}
        <div style="text-align: center;">
        <TextComponent color="{invitem.balance > 0n ? "success" : "warn"}">
          {invitem.balance > 0n ? "✔" : "×"}
        </TextComponent>
        </div>
      {:else}
        <div style="width: 100%; display: flex; justify-content: space-between;">
          <div>{invitem.balance}</div>
          <div>{invitem.supply}</div>
        </div>
      {/if}
    </div>
  </div>

</div>
