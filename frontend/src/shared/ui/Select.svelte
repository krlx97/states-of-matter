<script lang="ts">
  import { soundService } from "services";

  let selected: any;
  let values: any[];
  let label: string;

  const onClick = (): void => {
    soundService.play("click");
  };

  export {selected, label, values};
</script>

<style>

  select {
    height: 48px;
    width: 100%;
    /* Since input is 48px height and text is 16px vertical centered, there is 16px "padding" on top and bot. */
    /* We therefore don't set top and bottom padding */
    /* right padding for the 32px image, + 2x 8px image "padding" */
    /* Left padding 15px, +1px border makes 16px "padding" */
    padding: 0 var(--md) 0 var(--md);
    display: block;
    background-color: rgb(var(--dark-grey));
    border: 1px solid rgba(var(--grey), var(--opacity-sm));
    border-radius: 8px;
    box-sizing: border-box;
    color: white;
    font: var(--md)/1 "Nunito";
    /* font-family: "Nunito"; */
    /* font-size: var(--font-md); */
    letter-spacing: 4px;
    transition: border-color 333ms cubic-bezier(var(--ease-in-out-quad));
    outline: 0;
  }

  select:hover {
    border-color: rgba(var(--white), var(--opacity-full));
    cursor: pointer;
  }

  label {
    position: absolute;
    top: -8px;
    left: 22px;
    cursor: text;
    background: linear-gradient(
      0deg,
      rgb(var(--dark-grey)) 0%,
      rgb(var(--dark-grey)) 50%,
      rgba(0, 0, 0, 0) 50%,
      rgba(0, 0, 0, 0) 100%
    );
  }

  .select {
    position: relative;
  }
</style>

<div class="select">
  <label for="{label}">{label}</label>
  <select id="{label}" bind:value="{selected}" on:change on:click="{onClick}">
    {#each values as value}
      <option {value}>{value}</option>
    {/each}
  </select>
</div>
