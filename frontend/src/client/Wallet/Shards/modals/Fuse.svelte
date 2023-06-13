<script lang="ts">
  import {ethers} from "ethers";
  import {ethersService} from "services";
  import {modalStore, walletStore} from "stores";
  import {CurrencyComponent} from "ui";

  const {id} = $modalStore.data;
  const price = ethers.utils.parseUnits("1000.0");
  let owned = $walletStore.items.find((item) => item.id === id).balance;
  let remaining = $walletStore.crystals.balance.sub(price);
  let disabled = owned <= 0 || remaining.lte(0);
  let isLoading = false;

  const onFuse = async (): Promise<void> => {
    isLoading = true;
    const {game} = ethersService.keys;

    if (!$walletStore.allowance.gte(price)) {
      const isConfirmed = await ethersService.transact("currency", "increaseAllowance", [game, price]);
      if (!isConfirmed) {
        isLoading = false;
        return;
      }
    }

    if (!$walletStore.isApprovedForAll) {
      const isConfirmed = await ethersService.transact("skins", "setApprovalForAll", [game, true]);
      if (!isConfirmed) {
        isLoading = false;
        return;
      }
    }

    const isConfirmed = await ethersService.transact("game", "fuseShards", [id]);
    if (!isConfirmed) {
      isLoading = false;
      return;
    }

    await ethersService.loadUser();
    owned = $walletStore.items.find((item) => item.id === id).balance;
    remaining = $walletStore.crystals.balance.sub(price);
    disabled = owned.lte(0) || remaining.lte(0);
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
        <td><CurrencyComponent name="crystals" number={price}/></td>
      </tr>
      <tr>
        <td>REMAINING</td>
        <td><CurrencyComponent name="crystals" number={remaining}/></td>
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
    {:else if remaining.lte(0)}
      <div class="modal__error">Insufficient balance.</div>
    {:else}
      <div class="modal__submit">
        <button {disabled} on:click={onFuse}>FUSE</button>
      </div>
    {/if}
  {/if}
</div>
