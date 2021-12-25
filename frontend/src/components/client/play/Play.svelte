<script lang="ts">
  import {PlayerStatus} from "enums";
  import {playerStore} from "stores/data";
  import Lobby from "./Lobby.svelte";
  import SelectMode from "./SelectMode.svelte";
</script>

<style lang="scss">
  .play {
    height: 100%;
    width: 100%;
    display: flex;
  }
</style>

<div class="play">
  {#if $playerStore.status === PlayerStatus.INLOBBY}
    <Lobby/>
  {:else}
    <SelectMode/>
  {/if}
</div>
