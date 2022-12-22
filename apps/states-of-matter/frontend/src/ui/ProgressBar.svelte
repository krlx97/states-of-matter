<script lang="ts">
  let color: "purple" | "green" | "blue" = "purple";
  let progress: number = 0;

  export {color, progress};
</script>

<style>
  .progress {transition: width 250ms linear;}
  .green {background-color: rgb(133, 199, 0)}
  .blue {background-color: rgb(0, 174, 191)}
  .purple {background-color: rgb(var(--purple))}
</style>

<div
  class="progress"
  class:green={color === "green"}
  class:blue={color === "blue"}
  class:purple={color === "purple"}
  style={`width: ${progress}%`}
></div>
