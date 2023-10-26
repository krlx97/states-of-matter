<script lang="ts">
  import {cardsView, items} from "@som/shared/data";
  import {socketService} from "services";
  import {modalStore, walletStore} from "stores";
  import {CardComponent, ModalComponent} from "ui";
  import CardSkinComponent from "./CardSkin.svelte";

  const {socket} = socketService;
  const {id} = $modalStore.data;
  const cardView = cardsView.get(id);

  // const doesOwn = (skin: number): boolean => {
  //   if ($walletStore.items.find((item) => item.id === skin).balance.gt(0)) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };

  const onDefaultSkin = (): void => {
    socket.emit("defaultSkin" as any, {cardId: id});
  };

  // const onSelectSkin = (skin: number): void => {
  //   socket.emit("selectSkin" as any, {skin});
  // };
</script>

<style>
  .lore {
    display: flex;
  }

  .lore__info {
    position: relative;
    margin-left: 1em;
    flex-grow: 1;
    font-style: italic;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .lore__info__text {
    text-align: justify;
    text-justify: inter-word;
    line-height: 1.4;
  }

  .skins {
    display: flex;
    align-self: flex-end;
    gap: var(--spacing-md);
  }

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

  /* .skin--disabled {
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
  } */

  .skin__img {
    /* position: absolute;
    top: 0;
    left: 0; */
    height: 64px;
    width: 64px;
    /* z-index: 9; */
  }

/* .item__img, video {
    height: 136px;
    width: 108px;
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
  } */

  .skin:first-child {
    margin-left: 0;
  }

  /* .active {
    border-color: rgb(var(--purple));
  } */
</style>

<ModalComponent>
  <div class="lore">

    <div class="lore__card">
      <CardComponent card={$modalStore.data} health={0} damage={0}/>
    </div>

    <div class="lore__info">
      <div class="lore__info__text">{cardView.lore}</div>

      <div class="skins">
        <!-- Default skin -->
        <div class="skin">
<!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
          <img
            class="skin__img"
            src="assets/cards/{$modalStore.data.id}.jpg"
            alt="Default Skin"
            on:click="{onDefaultSkin}"/>
        </div>
        <!-- Custom skins -->
        {#each cardView.skins as skin}
          <CardSkinComponent skinId="{skin}"/>
          <!-- <div class="skin" on:click={() => onSelectSkin(skin)} on:keypress={() => onSelectSkin(skin)}>
            {#if !doesOwn(skin)}
              <div class="skin--disabled">
                <i class="fa-solid fa-lock"></i>
              </div>
            {/if}
            {#if !items.find((item) => item.id === skin).rarity || items.find((item) => item.id === skin).rarity === 0}
              <img class="skin__img" style={!doesOwn(skin) ? "filter: grayscale(1)" : ""} src="assets/items/{skin}.png" alt={skin.toString()}>
            {:else}
              <video autoplay loop muted style={!doesOwn(skin) ? "filter: grayscale(1)" : ""}>
                <source src="assets/items/{skin}.webm" type="video/webm"/>
              </video>
            {/if}
          </div> -->
        {/each}
      </div>
    </div>
  </div>
</ModalComponent>
