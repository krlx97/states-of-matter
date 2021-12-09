<script lang="ts">
  import Lobby from "./Lobby.svelte";
  import SelectMode from "./SelectMode.svelte";
  import {PlayerStatus} from "enums";
  import {playerStore} from "stores/data";
</script>

<style>
  .play {
    display: flex;
    height: 100%;
    width: 100%;
  }
</style>

<div class="play">
  {#if $playerStore.status === PlayerStatus.INLOBBY}
    <Lobby/>
  {:else}
    <SelectMode/>
  {/if}
</div>