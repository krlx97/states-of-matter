<script lang="ts">
  import {ButtonComponent} from "ui";
  let formStore: any;
  export {form, formStore};
</script>

<style>
  .spin {
    font-size: 48px;
    animation: spin 800ms linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    } to {
      transform: rotate(360deg);
    }
  }
</style>

{#if $formStore.isLoading}
  <div class="spin">⟳</div>
{:else}
  <ButtonComponent disabled="{$formStore.isDisabled}">
    <slot/>
  </ButtonComponent>
{/if}
