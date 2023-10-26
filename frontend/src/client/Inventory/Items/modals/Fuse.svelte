<script lang="ts">
  import {ethersService} from "services";
  import {modalStore, walletStore} from "stores";
  import {CurrencyComponent} from "ui";

  const {id} = $modalStore.data;
  const price = 1000n * 10n ** 18n;
  let owned = $walletStore.items.find((item) => item.id === id).balance;
  let remaining = $walletStore.ecr.balance - price;
  // let disabled = owned <= 0 || remaining <= 0;
  let isLoading = false;

  const onFuse = async (): Promise<void> => {
    isLoading = true;
    const {somGame} = ethersService.keys;

    if (!$walletStore.isApprovedForAll) {
      const isConfirmed = await ethersService.transact("somTokens", "setApprovalForAll", [somGame, true]);
      if (!isConfirmed) {
        isLoading = false;
        return;
      }
    }

    const isConfirmed = await ethersService.transact("somGame", "fuseShards", [id]);
    if (!isConfirmed) {
      isLoading = false;
      return;
    }

    await ethersService.reloadUser();
    owned = $walletStore.items.find((item) => item.id === id).balance;
    remaining = $walletStore.ecr.balance - price;
    // disabled = owned <= 0 || remaining <= 0;
    isLoading = false;
  };
</script>

<div class="modal">
  <div class="modal__info">
    Spend etheric crystals to fuse three shards into a skin.
  </div>

  <div class="modal__table">
    <table>
      <tr>
        <td>OWNED</td>
        <td>{owned}</td>
      </tr>
      <br/>
      <tr>
        <td>PRICE</td>
        <td><CurrencyComponent name="ecr" number={price}/></td>
      </tr>
      <tr>
        <td>REMAINING</td>
        <td><CurrencyComponent name="ecr" number={remaining}/></td>
      </tr>
    </table>
  </div>

  {#if isLoading}
    <div class="modal__submit">
      <i class="fa-solid fa-circle-notch fa-2x fa-spin"></i>
    </div>
  {:else}
    {#if owned < 3}
      <div class="modal__error">You do not own enough shards.</div>
    {:else if remaining < 0}
      <div class="modal__error">Insufficient balance.</div>
    {:else}
      <div class="modal__submit">
        <button class="button" on:click={onFuse}>FUSE</button>
      </div>
    {/if}
  {/if}
</div>
