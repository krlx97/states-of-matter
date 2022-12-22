<script lang="ts">
  import {accountStore} from "stores";
  import {socketService} from "services";
  import FungibleToken from "./FungibleToken.svelte";

  const airdrop = (): void => {
    const {name} = $accountStore.profile;

    socketService.socket.emit("airdrop", {name});
  };
</script>

<style>
  .ftokens {
    padding: var(--spacing-md);
    box-sizing: border-box;
  }
</style>

<div class="ftokens">
  <button on:click={airdrop}>AIRDROP 1,000.0000 VMT</button>
  {#each $accountStore.wallet.fungible as ft}
    <FungibleToken {ft}/>
  {/each}
</div>
