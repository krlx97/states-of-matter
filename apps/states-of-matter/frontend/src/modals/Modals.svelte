<script lang="ts">
  import {modalStore} from "stores";
  import AddFriend from "./AddFriend.svelte";
  import Block from "./Block.svelte";
  import CardLore from "./CardLore.svelte";
  import ChangeDeckName from "./ChangeDeckName.svelte";
  import Claim from "./Claim.svelte";
  import GamePopup from "./GamePopup.svelte";
  import Graveyard from "./Graveyard.svelte";
  import JoinLobby from "./JoinLobby.svelte";
  import NFTInfo from "./NFTInfo.svelte";
  import Stake from "./Stake.svelte";
  import Swap from "./Swap.svelte";
  import Transfer from "./Transfer.svelte";
  import Unfriend from "./Unfriend.svelte";
  import Unstake from "./Unstake.svelte";
</script>

{#if $modalStore.list.gamePopup}
  <GamePopup/>
{/if}

{#if $modalStore.list.addFriend}
  <AddFriend/>
{/if}

{#if $modalStore.list.block}
  <Block/>
{/if}

{#if $modalStore.list.cardLore}
  <CardLore/>
{/if}

{#if $modalStore.list.changeDeckName}
  <ChangeDeckName/>
{/if}

{#if $modalStore.list.claim}
  <Claim/>
{/if}

{#if $modalStore.list.graveyard}
  <Graveyard/>
{/if}

{#if $modalStore.list.joinLobby}
  <JoinLobby/>
{/if}

{#if $modalStore.list.nftInfo}
  <NFTInfo/>
{/if}

{#if $modalStore.list.stake}
  <Stake/>
{/if}

{#if $modalStore.list.swap}
  <Swap/>
{/if}

{#if $modalStore.list.transfer}
  <Transfer/>
{/if}

{#if $modalStore.list.unfriend}
  <Unfriend/>
{/if}

{#if $modalStore.list.unstake}
  <Unstake/>
{/if}
