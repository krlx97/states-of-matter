<script lang="ts">
  import {onDestroy, onMount} from "svelte";
  import {BigNumber, ethers} from "ethers";
  import {ethersService, modalService} from "services";
  import {accountStore, modalStore, walletStore} from "stores";
  import {CurrencyComponent} from "ui";
  import RandomSkinComponent from "./RandomSkin.svelte";

  const {id} = $modalStore.data;
  const price = ethers.utils.parseUnits("1000.0");
  const owned = $walletStore.items.find((item) => item.id === id).balance;
  const remaining = $walletStore.crystals.balance.sub(price);
  const disabled = owned <= 0 || remaining.lte(0);
  let isLoading = false;

  const onUnlock = async (): Promise<void> => {
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

    const isConfirmed = await ethersService.transact("game", "unlockChest", [id]);
    if (!isConfirmed) {
      isLoading = false;
      return;
    }

    await ethersService.loadUser();
  };

  const onRandomSkin = (account: string, id: BigNumber): void => {
    if (account.toLowerCase() === $accountStore.publicKey.toLowerCase()) {
      modalService.open(RandomSkinComponent, {
        id: parseInt(id.toString())
      });
    }
  }

  onMount((): void => {
    ethersService.contracts.game.on("RandomSkin", onRandomSkin);
  });

  onDestroy((): void => {
    ethersService.contracts.game.off("RandomSkin", onRandomSkin);
  });
</script>

<div class="modal">
  <div class="modal__info">
    Inside each chest, there is a set of skins that are categorized into three
    levels of rarity: uncommon, rare, and epic. When you unlock a chest, you
    will receive a skin that is randomly selected from a list that is also
    randomly chosen.
  </div>

  <div class="modal__table">
    <table>
      <tr>
        <td>UNCOMMON</td>
        <td class="green">90%</td>
      </tr>
      <tr>
        <td>RARE</td>
        <td class="blue">9%</td>
      </tr>
      <tr>
        <td>EPIC</td>
        <td class="purple">1%</td>
      </tr>
      <br/>
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
    {#if owned <= 0}
      <div class="modal__error">You do not own any chests.</div>
    {:else if remaining.lte(0)}
      <div class="modal__error">Insufficient balance.</div>
    {:else}
      <div class="modal__submit">
        <button {disabled} on:click={onUnlock}>UNLOCK</button>
      </div>
    {/if}
  {/if}
</div>
