<script lang="ts">
  let form: string;
  let formStore: any;
  export {form, formStore};
</script>

<style>
  i {
    font-size: 48px;
  }
</style>

<div class="form__submit">
  {#if $formStore.isLoading}
    <i class="fa-solid fa-circle-notch fa-spin"></i>
  {:else}
    <button class="button" disabled="{$formStore.isDisabled}" {form}>
      {form.toUpperCase()}
    </button>
  {/if}
</div>
