<script lang="ts">
    import { eccService, miscService, socketService } from "services";
  import {accountStore, playerStore} from "stores";

  const transferItem = () => {};

  const mint = (): void => {
    const {name, nonce, privateKey} = $accountStore.profile;
    const signature = eccService.sign(`${nonce}`, privateKey);

    socketService.socket.emit("mint", {name, signature});
  };

  const showInfo = (nft: any): void => {
    miscService.openModal("nftInfo", nft);
  }
</script>

<style>
  .nfts {
    height: 647px; /* fix this */
    padding: var(--spacing-md);
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-md);
    box-sizing: border-box;
    overflow-y: scroll;
  }

  .nfts::-webkit-scrollbar {
    width: 8px;
  }
  .nfts::-webkit-scrollbar-track {
    background-color: rgb(63, 63, 63);
    border-radius: 4px;
  }
  .nfts::-webkit-scrollbar-thumb {
    background-color: rgb(127, 127, 127);
    border-radius: 4px;
  }

  .nft {
    height: calc(144px + 32px + 3 * 1em);
    padding: var(--spacing-md);
    /* flex-basis: calc(50% - var(--spacing-md) * 4); */
    box-sizing: border-box;
    border-top-width: 1px;
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
    background: linear-gradient(
      180deg,
      rgba(179, 105, 244, 0.1) 0%,
      rgba(0, 0, 0, 0) 50%,
      rgba(179, 105, 244, 0.1) 100%
    );
  }

  .nft__img {
    display: block;
    margin-bottom: var(--spacing-md);
    height: 144px;
    width: 144px;
    border-radius: 16px;
    box-shadow: var(--elevation-md);
  }

  .nft__serial {
    text-align: center;
    font-size: 2rem;
  }

  .green {color: #69F0AE}
  .blue {color: #448AFF}
  .purple {color: #E040FB}
</style>

<button on:click={mint}>MINT 1,000.0000 VMT</button>
<div class="nfts">
  {#if $accountStore.wallet.nonFungible.length}
    {#each $accountStore.wallet.nonFungible as nft}
      <div class="nft" on:click={() => showInfo(nft)}>
        <img class="nft__img" src={nft.tags.image} alt="NFT"/>
        <div class="nft__serial">
          <span
            class:green={nft.attrs[1].points === 1}
            class:blue={nft.attrs[1].points === 2}
            class:purple={nft.attrs[1].points === 3}>
            #{nft.serial}
          </span>
        </div>
        <!-- <div>
          Author: {nft.tags.author} -->
          <!-- {{nft.tags.subtitle}} -->
          <!-- <mat-list dense>
            <mat-list-item *ngFor="let attr of nft.attrs">
              {{attr.attribute_name.toUpperCase()}} <div class="spacer"></div> {{attr.points}}
            </mat-list-item>
          </mat-list> -->
        <!-- </div> -->
        <!-- <div>
          <button on:click={transferItem}>TRANSFER</button>
        </div> -->
      </div>
    {/each}
  {:else}
    You do not own any NFTs yet :\
  {/if}
</div>
