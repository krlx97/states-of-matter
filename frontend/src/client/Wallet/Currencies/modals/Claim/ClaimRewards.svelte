<script lang="ts">
  import {ethersService} from "services";
  import {walletStore} from "stores";
  import {CurrencyComponent} from "ui";

  const disabled = $walletStore.crystals.rewards.lte(0);
  let isLoading = false;

  const onClaim = async (): Promise<void> => {
    isLoading = true;

    const isConfirmed = await ethersService.transact("game", "claimRewards", []);
    if (!isConfirmed) {
      isLoading = false;
      return;
    }

    await ethersService.loadUser();
    isLoading = false;
  };
</script>

<div class="modal">
  <div class="modal__title">Claim rewards</div>
  <div class="modal__info">
    Once per day the system will distribute rewards collected from opening
    chests, fusing shards, and market fees to stakers.
  </div>
  <div class="modal__table">
    <table>
      <tr>
        <td>REWARDS POOL</td>
        <td><CurrencyComponent name="crystals" number={$walletStore.crystalsPool.toRewards}/></td>
      </tr>
      <tr>
        <td>BURN POOL</td>
        <td><CurrencyComponent name="crystals" number={$walletStore.crystalsPool.toBurned}/></td>
      </tr>
      <br/>
      <tr>
        <td>TOTAL STAKED</td>
        <td><CurrencyComponent name="crystals" number={$walletStore.crystalsGlobal.staked}/></td>
      </tr>
      <tr>
        <td>YOUR STAKED</td>
        <td><CurrencyComponent name="crystals" number={$walletStore.crystals.staked}/></td>
      </tr>
      <tr>
        <td>YOUR REWARDS</td>
        <td><CurrencyComponent name="crystals" number={$walletStore.crystals.rewards}/></td>
      </tr>
      <br/>
      <tr>
        <td>NEXT FLUSH</td>
        <td>13h 23m 15s</td>
      </tr>
    </table>
  </div>

  {#if isLoading}
    <div class="modal__submit">
      <i class="fa-solid fa-circle-notch fa-2x fa-spin"></i>
    </div>
  {:else}
    {#if $walletStore.crystals.rewards.lte(0)}
      <div class="modal__error">You have no rewards.</div>
    {:else}
      <div class="modal__submit">
        <button {disabled} on:click={onClaim}>CLAIM</button>
      </div>
    {/if}
  {/if}
</div>
