<script lang="ts">
  let color: "purple" | "green" | "blue" = "purple";
  let size: "sm" | "md" | "lg" = "md";
  let progress: number = 0;

  export {color, size, progress};
</script>

<style lang="scss">
  @import "../../styles/variables";

  .progress-bar {
    &--sm {height: 8px}
    &--md {height: 12px}
    &--lg {height: 16px}

    background-color: $dark-grey;
    border: 2px solid $light-grey;
    border-radius: 2px;
    box-sizing: border-box;

    &__progress {
      &--sm {height: 4px}
      &--md {height: 8px}
      &--lg {height: 12px}

      transition: width 250ms linear;
    }
  }

  .green {background-color: rgb(133, 199, 0)}
  .blue {background-color: rgb(0, 174, 191)}
  .purple {background-color: $purple}
</style>

<div class={`progress-bar progress-bar--${size}`}>
  <div
    class={`progress-bar__progress progress-bar__progress--${size}`}
    class:green={color === "green"}
    class:blue={color === "blue"}
    class:purple={color === "purple"}
    style={`width: ${progress}%`}
  ></div>
</div>
