<script lang="ts">
  import {PlayerStatus} from "@som/shared/enums";
  import {playerStore} from "stores/data";
  import Lobby from "./Lobby.svelte";
  import SelectMode from "./SelectMode.svelte";

  $: isInLobby = $playerStore.status === PlayerStatus.INLOBBY;
</script>

<style lang="scss">
  .play {
    height: 100%;
    width: 100%;
    display: flex;
  }
</style>

<div class="play">
  {#if isInLobby}
    <Lobby/>
  {:else}
    <SelectMode/>
  {/if}
</div>
