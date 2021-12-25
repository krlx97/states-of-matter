<script lang="ts">
  import {createEventDispatcher} from "svelte";

  let style: "raised" | "outlined" | "icon" = "raised";
  let color: "purple" | "green" | "grey" = "purple";
  let disabled = false;

  const dispatch = createEventDispatcher();

  const onClick = (): void => { dispatch("click"); };

  export {style, color, disabled};
</script>

<style lang="scss">
  @import "../../styles/variables";

  button {
    padding: $spacing-sm $spacing-lg;
    background-color: transparent;
    border: 0;
    border-radius: 4px;
    box-sizing: border-box;
    color: white;
    cursor: pointer;
    font-family: inherit;
    font-size: inherit;
  }
  button:disabled {
    color: $dark-grey;
    cursor: not-allowed;
  }
  button:disabled:hover {background-color: unset}
  button:not(:disabled):active {background-color: $dark-grey}
  button:focus {outline: 0}

  .btn--raised-purple, .btn--raised-green, .btn--raised-grey {
    box-shadow: $elevation-sm;
  }

  .btn--raised-purple {background-color: $purple}
  .btn--raised-green {background-color: $green}
  .btn--raised-grey {
    background-color: $dark-grey;
    // color: $dark-grey;
  }
  .btn--icon-purple {color: $purple}
  .btn--icon-green {color: $green}
  .btn--icon-grey {color: white}

  .btn--outlined-purple {border: 2px solid $purple}
  .btn--outlined-green {border: 2px solid $green}
  .btn--outlined-grey {border: 2px solid $dark-grey}

  .btn--icon-purple, .btn--icon-green, .btn--icon-grey {
    padding: 0.5em;
    border-radius: 50%;
  }
</style>

<button class={`btn--${style}-${color}`} on:click={onClick} {disabled}>
  <slot/>
</button>
