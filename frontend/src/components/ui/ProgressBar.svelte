<script lang="ts">
  import {onMount} from "svelte";

  let color: "yellow" | "red" | "purple";
  let progress: number;

  let progressbarRef: HTMLElement;

  onMount(() => {
    // switch (color) {
    //   case "yellow":
    //     progressbarRef.style.backgroundColor = "rgb(241, 186, 88)";
    //     break;
    //   case "red":
    //     progressbarRef.style.backgroundColor = "rgb(233, 52, 27)";
    //     break;
    //   case "purple":
    //     progressbarRef.style.backgroundColor = "rgb(121, 108, 255)";
    //     break;
    // }
  });

  export {color, progress};
</script>

<style lang="scss">
  @import "../../styles/variables";

  .progress-bar {
    padding: 4px;
    height: 16px;
    display: flex;
    align-items: center;
    background-color: $dark-grey;
    border-radius: 8px;
    box-sizing: border-box;
    
    &__progress {
      height: 8px;
      box-shadow: $elevation-sm;
      background-color: $purple;
      border-radius: 8px;
      transition: width 225ms $ease-in-out-quart;
    }
  }
</style>

<div class="progress-bar">
  <div class="progress-bar__progress" bind:this={progressbarRef} style={`width: ${progress}%`}>
  </div>
</div>
