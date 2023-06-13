<script lang="ts">
  import {ethersService} from "services";
  import {walletStore} from "stores";
  import {CurrencyComponent} from "ui";

  const disabled = $walletStore.crystals.unstaked.lte(0) || $walletStore.crystals.vesting * 1000 > Date.now(); // or vesting not expired
  let isLoading = false;

  const onClaim = async (): Promise<void> => {
    isLoading = true;

    const isConfirmed = await ethersService.transact("game", "claimUnstaked", []);
    if (!isConfirmed) {
      isLoading = false;
      return;
    }

    await ethersService.loadUser();
    isLoading = false;
  };
</script>

<div class="modal">
  <div class="modal__title">Claim unstaked</div>
  <div class="modal__info">
    When the vesting period ends, you can claim your unstaked tokens here.
  </div>
  <div class="modal__table">
    <table>
      <tr>
        <td>UNSTAKED</td>
        <td><CurrencyComponent name="crystals" number={$walletStore.crystals.unstaked}/></td>
      </tr>
      <tr>
        <td>VESTING</td>
        <td>{new Date($walletStore.crystals.vesting * 1000).toLocaleDateString()} {new Date($walletStore.crystals.vesting * 1000).toLocaleTimeString()}</td>
      </tr>
    </table>
  </div>

  {#if isLoading}
    <div class="modal__submit">
      <i class="fa-solid fa-circle-notch fa-2x fa-spin"></i>
    </div>
  {:else}
    {#if $walletStore.crystals.unstaked.lte(0)}
      <div class="modal__error">You have no unstaked tokens.</div>
    {:else if $walletStore.crystals.vesting * 1000 > Date.now()}
      <div class="modal__error">Not vested yet.</div>
    {:else}
      <div class="modal__submit">
        <button {disabled} on:click={onClaim}>CLAIM</button>
      </div>
    {/if}
  {/if}
</div>
