<script lang="ts">
  import {cardLores, cardSkins} from "data"
  import {eccService, socketService} from "services";
  import {accountStore, modalStore, playerStore} from "stores";
  import Card from "../ui/Card.svelte";
  import Modal from "../ui/Modal.svelte";

  let isSelectionVisible = false;
  let selections = [];

  const deselectSkin = (): void => {
    const {name, nonce, privateKey} = $accountStore.profile;
    const signature = eccService.sign(`${nonce}`, privateKey);

    socketService.socket.emit("deselectSkin", {
      id: $modalStore.data.id,
      username: name,
      signature
    });
  };

  const selectSkin = (serial: number): void => {
    const {name, nonce, privateKey} = $accountStore.profile;
    const signature = eccService.sign(`${nonce}`, privateKey);

    socketService.socket.emit("selectSkin", {
      serial,
      username: name,
      signature
    });
  };

  const viewSkins = (skinid: number): void => {
    selections = [];

    $accountStore.wallet.nonFungible.forEach((nft) => {
      const att = nft.attrs.find((attr) => attr.attribute_name === "cardid");

      if (att.points === $modalStore.data.id) {
        selections.push(nft.serial);
      }
    });

    isSelectionVisible = !isSelectionVisible;
  };
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
    position: relative;
    display: flex;
    align-self: flex-end;
  }

  .serials {
    position: absolute;
    top: calc(100% - 32px);
    left: 0;
    width: 64px;
    /* height: 128px; */
    padding-top: calc(32px + 0.5em);
    /* background-color: rgb(var(--dark-grey)); */
    /* border-radius: 4px; */
    /* box-shadow: var(--elevation-md); */
    /* background: rgb(179,105,244); */
    background: linear-gradient(to bottom, rgba(179,105,244,1) 0%, rgba(31,31,31,1) calc(32px + 0.5em));
    /* transform: translateX(-50%); */
    z-index: 32;

    border-top-width: 0;
    border-right-width: 1px;
    border-bottom-width: 0;
    border-left-width: 1px;
    border-style: solid;
    border-image: linear-gradient(
      180deg,
      rgba(31, 31, 31, 1) 0%,
      rgba(255,255,255,1) 50%,
      rgba(31,31,31,1) 100%
    ) 1;
    cursor: initial;
  }

  .serial {
    border-top-width: 0px;
    border-right-width: 0;
    border-bottom-width: 1px;
    border-left-width: 0;
    border-style: solid;
    border-image: linear-gradient(
      90deg,
      rgba(63,63,63,1) 0%,
      rgba(255,255,255,1) 50%,
      rgba(63,63,63,1) 100%
    ) 1;
    text-align: center;
    /* padding: 0.33em; */
    padding: 0.5em 0;
    margin: 0 0.5em 0.5em 0.5em;
    box-sizing: border-box;
    cursor: pointer;
    transition: text-shadow 225ms ease-in-out, border-image 225ms ease-in-out;

  }

  .serial:hover {
    text-shadow: rgba(255, 255, 255, 1) 0px 0px 8px;
    border-image: linear-gradient(
      90deg,
      rgba(31,31,31,1) 0%,
      rgba(var(--purple),1) 50%,
      rgba(31,31,31,1) 100%
    ) 1;
  }

  .skin {
    height: 64px;
    width: 64px;
    position: relative;
    margin-left: var(--spacing-md);
    cursor: pointer;
    z-index: 30;
  }

  .skin__img {
    position: absolute;
    top: 0;
    left: 0;
    height: 64px;
    width: 64px;
    border-radius: 50%;
    border: 1px solid white;

    z-index: 33;
  }

  .skin:first-child {
    margin-left: 0;
  }

  .active {
    border-color: rgb(var(--purple));
  }
</style>

<Modal>
  <div class="lore">

    <div class="lore__card">
      <Card card={$modalStore.data} health={0} damage={0}/>
    </div>

    <div class="lore__info">

      <div class="lore__info__text">
        {cardLores.get($modalStore.data.id)}
      </div>

      <div class="skins">
        <div class="skin">
          <img
            class="skin__img"
            src="assets/cards/{$modalStore.data.id}.jpg"
            alt="Default Skin"
            on:click={deselectSkin}
            on:keypress={deselectSkin}
          />
        </div>

        {#each cardSkins.get($modalStore.data.id) as dataa}
          <div class="skin">

            <img
              class="skin__img"
              src="assets/cards/{$modalStore.data.id}/{dataa.skinId}{dataa.extension}"
              alt="Custom Skin"
              on:click={() => viewSkins(dataa.skinId)}
              on:keydown={() => viewSkins(dataa.skinId)}
            />

            {#if isSelectionVisible}
              <div class="serials">
                {#if selections.length}
                  {#each selections as s}
                    <div
                      class="serial"
                      on:click={() => selectSkin(s)}
                      on:keypress={() => selectSkin(s)}
                    >
                      {s}
                    </div>
                  {/each}
                {:else}
                  You do not own any NFT for this skin.
                {/if}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </div>
</Modal>
