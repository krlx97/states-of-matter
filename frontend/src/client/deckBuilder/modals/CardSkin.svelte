<script lang="ts">
  import {onMount} from "svelte";
  import {cardsView, items} from "@som/shared/data";
  import {socketService, soundService} from "services";
  import {modalStore, inventoryStore, playerStore} from "stores";
  import {CardComponent, ModalComponent} from "ui";

  const {socket} = socketService;

  let selectedSkin = $playerStore.skins[0];
  let item = items[0];
  let isSelected = selectedSkin.skinId === item.id;
  let skin: any;
  let balance = 0n;

  const doesOwn = (): boolean => {
    // if ($inventoryStore.items.find((item) => item.id === skin.id).balance.gt(0)) {
    //   return true;
    // } else {
    //   return false;
    // }
    return true;
  };

  const onSelectSkin = (): void => {
    if (balance < 1) { return; }

    socket.emit("selectSkin", {
      cardId: skin.cardId,
      skinId: skin.id
    });

    soundService.play("click");
  };

  onMount(() => {
    selectedSkin = $playerStore.skins.find(({cardId}): boolean => skin.cardId === cardId);
    item = items.find((item): boolean => selectedSkin.skinId === item.id);
    isSelected = selectedSkin.skinId === skin.id;
    balance = $inventoryStore.items.find((i) => i.id === BigInt(skin.id))?.balance || 0n;
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
  .mythic:hover {
    border-color: rgb(var(--mythic));
    box-shadow: 0 2px 8px 0 rgb(var(--mythic));
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
  .mythicx {
    border-color: rgb(var(--mythic));
    box-shadow: 0 2px 8px 0 rgb(var(--mythic));
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
    /* filter: grayscale(1); */
  }

  .isGrey {
    filter: grayscale(1);
  }

  .isSelected {
    border-color: white;
  }

  img, video {
    height: 96px;
  }
</style>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- {#key $playerStore} -->
  <div
    class="skin"
    class:common="{skin.rarity === 0 && balance > 0}"
    class:uncommon="{skin.rarity === 1 && balance > 0}"
    class:rare="{skin.rarity === 2 && balance > 0}"
    class:epic="{skin.rarity === 3 && balance > 0}"
    class:legendary="{skin.rarity === 4 && balance > 0}"
    class:mythic="{skin.rarity === 5 && balance > 0}"
    class:commonx={skin.rarity === 0 && isSelected}
    class:uncommonx={skin.rarity === 1 && isSelected}
    class:rarex={skin.rarity === 2 && isSelected}
    class:epicx={skin.rarity === 3 && isSelected}
    class:legendaryx={skin.rarity === 4 && isSelected}
    class:mythicx={skin.rarity === 5 && isSelected}
    on:click="{onSelectSkin}">

    {#if balance < 1}
      <div class="skin--disabled">🔒</div>
    {/if}
    {#if skin.rarity === 3 || skin.rarity === 0}
      <img class:isGrey="{balance < 1}" src="images/items/{skin.id}.png" alt="{skin.id}">
    {:else}
      <video class:isGrey="{balance < 1}" autoplay loop muted>
        <source src="images/items/{skin.id}.webm" type="video/webm"/>
      </video>
    {/if}
  </div>
<!-- {/key} -->
