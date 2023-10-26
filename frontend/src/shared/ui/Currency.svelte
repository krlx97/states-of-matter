<script lang="ts">
  import {formatUnits} from "ethers"

  let name: "ese" | "ecr" | "wtlos" | "lpecr" | "tlos";
  let number: bigint;
  let isIconVisible = true;

  export {name, number, isIconVisible};
</script>

<style>
  .currency {
    position: relative;
    cursor: pointer;
  }

  .currency__full {
    position: absolute;
    bottom: 100%;
    left: 50%;
    padding: var(--spacing-sm);
    display: none;
    transform: translateX(-50%);
  }

  .currency:hover .currency__full {
    display: initial;
    background-color: rgb(31, 31, 31);
    border: 1px solid rgb(127, 127, 127);
    border-radius: 8px;
  }

  img {
    margin-left: var(--spacing-xsm);
    display: inline;
    vertical-align: middle;
  }
</style>

<div class="currency">
  {#if name === "ese"}
    {number}
  {:else}
    {parseFloat(formatUnits(number.toString())).toFixed(3)}
  {/if}
  {#if isIconVisible}
    <img src="assets/currencies/xs/{name}.png" alt="{name}"/>
  {/if}
  <div class="currency__full">
    {#if name === "ese"}
      {number}
    {:else}
      {formatUnits(number.toString())}
    {/if}
  </div>
</div>
