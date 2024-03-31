<script lang="ts">
  import {onMount} from "svelte";
  import {socketService, soundService} from "services";
  import {inventoryStore, playerStore} from "stores";

  const {socket} = socketService;
  let skin: any;
  let selectedSkin: any = $playerStore.skins[0];
  let invitem: any = $inventoryStore.collectibles.items.find((i) => i.id === BigInt(skin.id));
  let isSelected = BigInt(selectedSkin.skinId) === invitem?.id;

  const onSelectSkin = (): void => {
    if (invitem.rarity !== 0 && invitem.balance < 1) { return; }

    soundService.play("click");

    socket.emit("selectSkin" as any, {
      cardId: skin.cardId,
      skinId: skin.id
    });
  };

  onMount(() => {
    selectedSkin = $playerStore.skins.find(({cardId}): boolean => skin.cardId === cardId);
    invitem = $inventoryStore.collectibles.items.find((i) => i.id === BigInt(skin.id));
    isSelected = selectedSkin.skinId === skin.id;
  });

  export {skin};
</script>

<style>
  .skin {
    position: relative;
    height: 64px;
    width: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgb(var(--grey));
    box-sizing: border-box;
    box-shadow: 0 2px 8px 0 rgb(var(--dark-grey));
    cursor: pointer;
    border-radius: 50%;
    overflow: hidden;
    transition: border-color 400ms cubic-bezier(var(--ease-in-out-quart)), box-shadow 400ms cubic-bezier(var(--ease-in-out-quart));
  }

  .common:hover {
    border-color: rgb(var(--common));
    box-shadow: 0 2px 8px 0 rgb(var(--common));
  }
  .uncommon:hover {
    border-color: rgb(var(--uncommon));
    box-shadow: 0 2px 8px 0 rgb(var(--uncommon));
  }
  .rare:hover {
    border-color: rgb(var(--rare));
    box-shadow: 0 2px 8px 0 rgb(var(--rare));
  }
  .epic:hover {
    border-color: rgb(var(--epic));
    box-shadow: 0 2px 8px 0 rgb(var(--epic));
  }
  .legendary:hover {
    border-color: rgb(var(--legendary));
    box-shadow: 0 2px 8px 0 rgb(var(--legendary));
  }

  .commonx {
    border-color: rgb(var(--common));
    box-shadow: 0 2px 8px 0 rgb(var(--common));
  }
  .uncommonx {
    border-color: rgb(var(--uncommon));
    box-shadow: 0 2px 8px 0 rgb(var(--uncommon));
  }
  .rarex {
    border-color: rgb(var(--rare));
    box-shadow: 0 2px 8px 0 rgb(var(--rare));
  }
  .epicx {
    border-color: rgb(var(--epic));
    box-shadow: 0 2px 8px 0 rgb(var(--epic));
  }
  .legendaryx {
    border-color: rgb(var(--legendary));
    box-shadow: 0 2px 8px 0 rgb(var(--legendary));
  }

  .skin--disabled {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    cursor: not-allowed;
  }

  .isGrey {
    filter: grayscale(1);
  }

  img, video {
    height: 96px;
  }
</style>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="skin"
  class:common="{invitem.rarity === 0 && invitem.balance > 0}"
  class:uncommon="{invitem.rarity === 1 && invitem.balance > 0}"
  class:rare="{invitem.rarity === 2 && invitem.balance > 0}"
  class:epic="{invitem.rarity === 3 && invitem.balance > 0}"
  class:legendary="{invitem.rarity === 4 && invitem.balance > 0}"
  class:commonx={invitem.rarity === 0 && isSelected}
  class:uncommonx={invitem.rarity === 1 && isSelected}
  class:rarex={invitem.rarity === 2 && isSelected}
  class:epicx={invitem.rarity === 3 && isSelected}
  class:legendaryx={invitem.rarity === 4 && isSelected}
  on:click="{onSelectSkin}">

  {#if invitem.rarity === 0}
    <img src="images/items/{invitem.id}.png" alt="{invitem.id}">
  {:else}
    {#if invitem.balance < 1n}
      <div class="skin--disabled">🔒</div>
    {/if}
    {#if invitem.rarity === 2 || invitem.rarity === 0}
      <img class:isGrey="{invitem.balance < 1n}" src="images/items/{invitem.id}.png" alt="{invitem.id}">
    {:else}
      <video class:isGrey="{invitem.balance < 1n}" autoplay loop muted>
        <source src="images/items/{invitem.id}.webm" type="video/webm"/>
      </video>
    {/if}
  {/if}
</div>
