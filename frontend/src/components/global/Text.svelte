<script lang="ts">
  let color: "white" | "purple" | "blue" | "red" | "green" | "yellow" | "orange" = "white";
  let font: "default" | "monospace" = "default";


  export {color, font};
</script>

<style lang="scss">
  @import "../../styles/variables";

  .white {color: white}
  .purple {color: $purple}
  .blue {color: $blue}
  .green {color: $green}
  .orange {color: $orange}
  .yellow {color: $yellow}
  .red {color: $red}
  .grey {color: $dark-grey}

  .solid {color: rgb(241, 186, 88)}
  .liquid {color: rgb(121, 108, 255)}
  .gas {color: rgb(134, 83, 15)}
  .plasma {color: rgb(233, 52, 27)}
</style>

<span class={color} style={`font-family: ${font === "monospace" ? "monospace" : ""}`}><slot/></span>
