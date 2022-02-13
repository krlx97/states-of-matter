<script lang="ts">
  let value: any = "";
  let placeholder: string;
  let type: "text" | "number" | "checkbox" | "password" = "text";
  let checked = false;
  let maxlength: number;

  export {value, placeholder, type, checked, maxlength};
</script>

<style lang="scss">
  @import "../shared/styles/variables";

  label {
    margin-bottom: $spacing-md;
    display: block;

    div {margin-bottom: 0.5em;}
  }
  .label--checkbox {
    display: flex;
    align-items: center;

    div {margin-bottom: 0em;}
  }

  input[type="text"], input[type="password"] {
    appearance: none;
    font-family: "Exo 2";
    font-size: 16px;
    padding: $spacing-sm $spacing-lg;
    border: 1px solid $purple;
    border-radius: 4px;
    box-sizing: border-box;
    width: 100%;
    background-color: $dark-grey;
    color: white;
    box-shadow: 0 0 0 2px $dark-grey;
    transition: box-shadow 225ms ease-in-out;

    &:hover {
      box-shadow: 0 0 0 4px $dark-grey;
    }

    &:focus {
      outline: 0;
      box-shadow: 0 0 0 6px $dark-grey;
    }

    &:disabled {
      color: #ccc;
    }
  }

  input[type="checkbox"] {
    appearance: none;
    height: 24px;
    width: 24px;
    margin: 0;
    margin-right: 1em;

    background-color: $dark-grey;
    border: 1px solid $purple;
    border-radius: 4px;
    box-sizing: border-box;
    cursor: pointer;
    position: relative;
    box-shadow: 0 0 0 2px $dark-grey;
    transition: box-shadow 225ms ease-in-out;

    &:hover {
      box-shadow: 0 0 0 4px $dark-grey;
    }

    &:focus {
      outline: 0;
      box-shadow: 0 0 0 6px $dark-grey;
    }

    &:checked {
      background-color: $purple;
      border: none;
      // box-shadow: 0 0 0 2px $dark-grey;

      &::before {
        position: absolute;
        top: 0;
        left: 0;
        content: "✓";
        font-size: 16px;
        height: 24px;
        width: 24px;
        font-weight: bold;
        color: white;

        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
</style>

{#if type === "text"}
  <label>
    <div>{placeholder}</div>
    <input type="text" {placeholder} {maxlength} bind:value/>
  </label>
{:else if type === "number"}
  <p>Coming soon</p>
{:else if type === "password"}
  <label>
    <div>{placeholder}</div>
    <input type="password" {placeholder} {maxlength} bind:value/>
  </label>
{:else if type === "checkbox"}
  <label class="label--checkbox">
    <input type="checkbox" {placeholder} bind:checked/>
    <div>{placeholder}</div>
  </label>
{/if}
