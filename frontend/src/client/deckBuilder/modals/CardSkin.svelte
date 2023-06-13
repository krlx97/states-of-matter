<script lang="ts">
  import {cardsView, items} from "@som/shared/data";
  import {socketService} from "services";
  import {modalStore, walletStore} from "stores";
  import {CardComponent, ModalComponent} from "ui";

  const {socket} = socketService;
  const {id} = $modalStore.data;
  const cardView = cardsView.get(id);

  let skinId: number;

  const doesOwn = (): boolean => {
    if ($walletStore.items.find((item) => item.id === skinId).balance.gt(0)) {
      return true;
    } else {
      return false;
    }
  };

  const onSelectSkin = (): void => {
    socket.emit("selectSkin" as any, {skin: skinId});
  };

  export {skinId};
</script>

<style>
  .skin {
    height: 64px;
    width: 64px;
    position: relative;
    /* margin-left: var(--spacing-md); */
    cursor: pointer;
    border: 2px solid rgb(127, 127, 127);
    box-sizing: border-box;
    border-radius: 50%;
    overflow: hidden;
  }
  .skin:hover {
    border-color: white;
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

  .skin__img, video {
    /* position: absolute;
    top: 0;
    left: 0; */
    height: 64px;
    width: 64px;
    /* z-index: 9; */
  }
.skin:first-child {
    margin-left: 0;
  }
</style>

<div class="skin" on:click={onSelectSkin} on:keypress={onSelectSkin}>
  {#if !doesOwn()}
    <div class="skin--disabled">
      <i class="fa-solid fa-lock"></i>
    </div>
  {/if}
  {#if !items.find((item) => item.id === skinId).rarity || items.find((item) => item.id === skinId).rarity === 0}
    <img class="skin__img" style={!doesOwn() ? "filter: grayscale(1)" : ""} src="assets/items/{skinId}.png" alt={skinId.toString()}>
  {:else}
    <video autoplay loop muted style={!doesOwn() ? "filter: grayscale(1)" : ""}>
      <source src="assets/items/{skinId}.webm" type="video/webm"/>
    </video>
  {/if}
</div>
