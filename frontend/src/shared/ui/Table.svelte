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
      rgb(63, 63, 63) 0%,
      rgb(var(--grey)) 50%,
      rgb(63, 63, 63) 100%
    ) 1;
    border-spacing: 0;
  }

  tr {
    display: flex;
  }

  tr:nth-child(even) {
    background-color: rgba(var(--grey), 0.1);
  }
  /* tr:nth-child(odd) {
    background-color: rgba(var(--dark-grey), 0.1);
  } */

  td {
    display: flex;
    flex-basis: 50%;
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
            <Text color="{d}">{a}</Text>
          {:else}
            {a}
          {/if}
       
      </td>
      <td>
        {#if c}
          <Currency name="{c}" number="{b}"/>
        {:else}
          <!-- {#if d}
            <Text color="{d}">{b}</Text>
          {:else} -->
            {b}
          <!-- {/if} -->
        {/if}
      </td>
    </tr>
  {/each}
</table>
