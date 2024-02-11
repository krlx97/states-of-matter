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
    height: 50px;
    width: 100%;
    /* Since input is 48px height and text is 16px vertical centered, there is 16px "padding" on top and bot. */
    /* We therefore don't set top and bottom padding */
    /* right padding for the 32px image, + 2x 8px image "padding" */
    /* Left padding 15px, +1px border makes 16px "padding" */
    padding: 0 var(--md) 0 var(--md);
    display: block;
    background-color: rgb(var(--dark-grey));
    border: 1px solid rgb(var(--grey));
    border-radius: 8px;
    box-sizing: border-box;
    color: white;
    font: var(--md)/1 "Nunito";
    /* font-family: "Nunito"; */
    /* font-size: var(--font-md); */
    letter-spacing: 4px;
    transition:
      border-color 0.2s cubic-bezier(var(--ease-in-out-quad)),
      color 0.2s cubic-bezier(var(--ease-in-out-quad));
    outline: 0;
  }

  label {
    position: absolute;
    /* 8px top padding from form__field, +16px text padding */
    top: -8px;
    /* again, simulate the 16px "padding", but since label is absolute border 1px doesnt count */
    left: 22px;
    /* cursor: text; */
    background: linear-gradient(
      0deg,
      rgba(31,31,31,1) 0%,
      rgba(31,31,31,1) 50%,
      rgba(255,255,255,0) 50%,
      rgba(255,255,255,0) 100%
    );
    transition:
      color 0.2s cubic-bezier(var(--ease-in-out-quad)),
      transform 0.2s cubic-bezier(var(--ease-in-out-quad));
    /* transform: translateY(-24px); */

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
