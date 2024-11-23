<style>
  form {
    width: 320px;
    display: flex;
    flex-direction: column;
    gap: var(--md);
  }

  .form__submit {
    display: flex;
    justify-content: center;
  }
</style>

<form on:submit|preventDefault>
  <slot/>
  {#if $$slots.submit}
    <div class="form__submit">
      <slot name="submit"/>
    </div>
  {/if}
</form>
