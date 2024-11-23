<script lang="ts">
  import Currency from "./Currency.svelte";
  import Text from "./Text.svelte";

  let items: any[] = [];

  export {items};
</script>

<style>
  table {
    width: 100%;
    line-height: 1.25;
    border: 1px solid;
    border-right: 0;
    border-left: 0;
    border-image: linear-gradient(
      90deg,
      rgba(var(--dark-grey), 0) 0%,
      rgba(var(--grey), 0.333) 50%,
      rgba(var(--dark-grey), 0) 100%
    ) 1;
    border-spacing: 0;
  }

  tr {
    display: flex;
  }

  tr:nth-child(odd) {
    background-color: rgba(var(--dark-grey), 0.333);
  }

  td {
    display: flex;
    align-items: center;
    flex-basis: 50%;
    padding: 0 var(--xs);
  }

  td:nth-child(odd) {
    font-size: var(--xs);
  }

  td:nth-child(even) {
    font-size: var(--md);
  }

  td:last-child {
    justify-content: flex-end;
  }
</style>

<table>
  {#each items as [a, b, c, d]}
    <tr>
      <td>
        {#if d}
          <Text color="{d}" size="xs">{a}</Text>
        {:else}
          {a}
        {/if}
      </td>
      <td>
        {#if c}
          <Currency name="{c}" number="{b}"/>
        {:else}
          {b}
        {/if}
      </td>
    </tr>
  {/each}
</table>
