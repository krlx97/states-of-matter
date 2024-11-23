<script lang="ts">
  import {modalStore} from "stores";
</script>

{#if $modalStore.Component}
  <svelte:component this="{$modalStore.Component}" data={$modalStore.data}/>
{/if}
