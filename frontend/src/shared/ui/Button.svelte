<script lang="ts">
  let disabled = false;
  let type: "button" | "submit";
  let isIcon = false;
  let badge: string = "";
  export {disabled, type, isIcon, badge};
</script>

<style>
  button {
    position: relative;
    padding: 0 var(--lg) 0 calc(var(--lg) + 4px);
    height: 48px;
    background-color: rgb(var(--dark-grey));
    border: 1px solid rgb(var(--grey));
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgb(var(--grey));
    font: 16px/1 "Nunito";
    letter-spacing: 4px;
    transition:
      border-color 333ms cubic-bezier(var(--ease-in-out-quad)),
      color 333ms cubic-bezier(var(--ease-in-out-quad));
  }

  button:hover {
    /* border-color: rgb(var(--white)); */
    color: rgb(var(--white));
    cursor: pointer;
  }

  button:focus {
    /* border-color: rgb(var(--plasma)); */
    color: rgb(var(--white));
    outline: 0;
  }

  button:disabled {
    /* border-color: rgb(var(--grey)); */
    cursor: not-allowed;
  }
  button:disabled:hover {
    color: rgb(var(--solid));

  }

  .isIcon {
    position: relative;
    height: 16px;
    width: 16px;
    padding: 0;
    background-color: transparent;
    border-radius: 50%;
    border-width: 0;
    color: rgb(192, 192, 192);
    font-size: 16px;
    transition: color 333ms cubic-bezier(var(--ease-in-out-quad));
  }

  .isIcon:hover {
    color: rgb(255, 255, 255);
    cursor: pointer;
  }

  .button__badge {
    position: absolute;
    top: -4px;
    right: -4px;
    height: 12px;
    width: 12px;
    font-size: 12px;
    font-weight: bold;
    background-color: rgb(var(--solid));
    border-radius: 50%;
  }
</style>

{#if type}
  <button {disabled} {type} class:isIcon on:click>
    <slot/>
    {#if badge.length}
      <div class="button__badge">
        {badge}
      </div>
    {/if}
  </button>
{:else}
  <button {disabled} class:isIcon on:click>
    <slot/>
    {#if badge.length}
      <div class="button__badge">
        {badge}
      </div>
    {/if}
  </button>
{/if}
