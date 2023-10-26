<script lang="ts">
  import {ethersService} from "services";
  import {walletStore} from "stores";
  import {CurrencyComponent} from "ui";

  const disabled = $walletStore.ecr.airdrops <= 0;
  let isLoading = false;

  const airdropAmount = 1500n;
  const toBalance = 500n;
  const toStaked = 1000n;

  const onClaim = async (): Promise<void> => {
    isLoading = true;

    const isConfirmed = await ethersService.transact("somGame", "claimAirdrops", []);
    if (!isConfirmed) {
      isLoading = false;
      return;
    }

    await ethersService.reloadUser();
    isLoading = false;
  };
</script>

<div class="modal">
  <div class="modal__title">Claim airdrops</div>
  <div class="modal__info">
    You will receive one airdrop every time you level up in States of Matter.
    You can claim said airdrops here.
  </div>

  <div class="modal__table">
    <table>
      <tr>
        <td>AIRDROPS LEFT</td>
        <td>{$walletStore.crystalsGlobal.airdrops}</td>
      </tr>
      <tr>
        <td>YOUR AIRDROPS</td>
        <td>{$walletStore.ecr.airdrops}</td>
      </tr>
      <br/>
      <tr>
        <td>AIRDROP AMOUNT</td>
        <td><CurrencyComponent name="ecr" number={airdropAmount}/></td>
      </tr>
      <tr>
        <td>TO BALANCE</td>
        <td><CurrencyComponent name="ecr" number={toBalance}/></td>
      </tr>
      <tr>
        <td>TO STAKED</td>
        <td><CurrencyComponent name="ecr" number={toStaked}/></td>
      </tr>
    </table>
  </div>

  {#if isLoading}
    <div class="modal__submit">
      <i class="fa-solid fa-circle-notch fa-2x fa-spin"></i>
    </div>
  {:else}
    {#if $walletStore.ecr.airdrops <= 0}
      <div class="modal__error">You have no airdrops.</div>
    {:else}
      <div class="modal__submit">
        <button {disabled} on:click={onClaim}>CLAIM</button>
      </div>
    {/if}
  {/if}
</div>
