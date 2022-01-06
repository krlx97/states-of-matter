<script lang="ts">
  import AddFriend from "./AddFriend.svelte";
  import Block from "./Block.svelte";
  import ChangeDeckName from "./ChangeDeckName.svelte";
  import Gift from "./Gift.svelte";
  import JoinLobby from "./JoinLobby.svelte";
  import Tip from "./Tip.svelte";
  import Unfriend from "./Unfriend.svelte";
  import Graveyard from "./Graveyard.svelte";

  import modal from "stores/view/modalStore";
</script>

<!-- <svelte:component this={true}/> -->

{#if $modal.list.addFriend}
  <AddFriend/>
{/if}

{#if $modal.list.block}
  <Block/>
{/if}

{#if $modal.list.changeDeckName}
  <ChangeDeckName/>
{/if}

{#if $modal.list.gift}
  <Gift/>
{/if}

{#if $modal.list.joinLobby}
  <JoinLobby/>
{/if}

{#if $modal.list.tip}
  <Tip/>
{/if}

{#if $modal.list.unfriend}
  <Unfriend/>
{/if}

{#if $modal.list.graveyard}
  <Graveyard/>
{/if}
