<script lang="ts">
  let color: "white" | "purple" | "blue" | "red" | "green" | "yellow" | "orange" = "white";
  let font: "default" | "monospace" = "default";
  let size: "xsm" | "sm" | "md" | "lg" | "xlg" = "md";
  let isMonospace = false;

  export {color, font, size, isMonospace};
</script>

<style lang="scss">
  @import "../../styles/variables";

  .isMonospace {font-family: monospace}

  .white {color: white}
  .purple {color: $purple}
  .blue {color: $blue}
  .green {color: $green}
  .orange {color: $orange}
  .yellow {color: $yellow}
  .red {color: $red}
  .grey {color: $dark-grey}

  .xsm {font-size: $font-xsm}
  .sm {font-size: $font-sm}
  .md {font-size: $font-md}
  .lg {font-size: $font-lg}
  .xlg {font-size: $font-xlg}
</style>

<span
  class={`${color} ${size}`}
  class:isMonospace
  style={`font-family: ${font === "monospace" ? "monospace" : ""}`}
><slot/></span>
