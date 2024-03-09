<script lang="ts">
  import {formatUnits} from "ethers"

  let name: "ees" | "ecr" | "enrg" | "shard";
  let number: bigint;
  let isIconVisible = true;
  let iconSize = "xs";

  const fix = (val: any): any => {
    const parts = `${formatUnits(val.toString())}`.split(".");
    parts[1] = parts[1].slice(0, 3);
    return parts.join(".");
  }

  export {name, number, isIconVisible, iconSize};
</script>

<style>
  .currency {
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .currency__full {
    position: absolute;
    top: calc(100% + var(--sm));
    left: 50%;
    padding: var(--xs);
    display: none;
    font-size: var(--sm);
    transform: translateX(-50%);
    z-index: 40;
  }

  .currency:hover .currency__full {
    display: flex;
    background-color: rgb(31, 31, 31);
    border: 1px solid rgb(127, 127, 127);
    border-radius: 8px;
  }
</style>

<div class="currency" style="{iconSize === "sm" ? "font-size: 20px" : ""}">
  {#if name === "shard"}
    {number}
  {:else}
    {fix(number)}
  {/if}
  {#if isIconVisible}
    <img src="images/currencies/{iconSize}/{name}.png" alt="{name}"/>
  {/if}
  <div class="currency__full">
    {#if name === "shard"}
      {number}
    {:else}
      {formatUnits(number.toString())}
    {/if}
  </div>
</div>
