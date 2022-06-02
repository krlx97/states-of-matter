<script lang="ts">
  let color: "grey" | "white" | "purple" | "blue" | "red" | "green" | "yellow" | "orange" = "white";
  let size: "xsm" | "sm" | "md" | "lg" | "xlg" = "md";
  let isMonospace = false;
  let isUnderline = false;

  export {color, size, isMonospace, isUnderline};
</script>

<style lang="scss">
  @import "../shared/styles/variables";

  span {
    display: block;
  }

  .isMonospace {font-family: monospace;}
  .isUnderline {text-decoration: underline;}

  .white {color: white}
  .purple {color: $purple}
  .blue {color: $blue}
  .green {color: $green}
  .orange {color: $orange}
  .yellow {color: $yellow}
  .red {color: $red}
  .grey {color: $dark-grey}

  .xsm {font-size: 0.5rem}
  .sm {font-size: $font-sm}
  .md {font-size: $font-md}
  .lg {font-size: $font-lg}
  .xlg {font-size: $font-xlg}
</style>

<span class={`${color} ${size}`} class:isMonospace class:isUnderline on:click><slot/></span>
