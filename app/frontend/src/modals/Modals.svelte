<script lang="ts">
  import {modalStore} from "stores/view";

  import AddFriend from "./AddFriend.svelte";
  import Block from "./Block.svelte";
  import ChangeDeckName from "./ChangeDeckName.svelte";
  import Gift from "./Gift.svelte";
  import JoinLobby from "./JoinLobby.svelte";
  import Tip from "./Tip.svelte";
  import Unfriend from "./Unfriend.svelte";
  import Graveyard from "./Graveyard.svelte";
</script>

<!-- <svelte:component this={true}/> -->

{#if $modalStore.list.addFriend}
  <AddFriend/>
{/if}

{#if $modalStore.list.block}
  <Block/>
{/if}

{#if $modalStore.list.changeDeckName}
  <ChangeDeckName/>
{/if}

{#if $modalStore.list.gift}
  <Gift/>
{/if}

{#if $modalStore.list.joinLobby}
  <JoinLobby/>
{/if}

{#if $modalStore.list.tip}
  <Tip/>
{/if}

{#if $modalStore.list.unfriend}
  <Unfriend/>
{/if}

{#if $modalStore.list.graveyard}
  <Graveyard/>
{/if}
