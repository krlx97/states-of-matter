<script lang="ts">
  import {PlayerStatus} from "@som/shared/enums";
  import {playerStore} from "stores";
  import Lobby from "./Lobby.svelte";
  import SelectMode from "./SelectMode.svelte";
</script>

<style>
  .play {
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
