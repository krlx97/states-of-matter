<script lang="ts">
  import {modalStore} from "stores";
</script>

{#if $modalStore.isVisible}
  <svelte:component this="{$modalStore.component}"/>
{/if}
