<script lang="ts">
  let bars = [];

  export {bars};
</script>

<style>
  .progress-bar {
    height: 6px;
    width: 100%;
    /* margin: var(--spacing-md) 0; */
    display: flex;
    border-radius: 8px;
    background-color: rgb(15, 15, 15);
    overflow: hidden;
  }

  .progress {
    /* transition: width 250ms linear; */
    height: 6px;
    /* border-radius: 8px; */
  }

  .green {background-color: rgb(var(--gas))}
  .red {background-color: rgb(var(--solid));}
  .blue {background-color: rgb(var(--liquid))}
  .purple {background-color: rgb(var(--plasma))}
  .grey {
    background-color: rgb(127, 127, 127);
  }
  .orange {
    background-color: rgb(255, 139, 0);
  }
</style>

<div class="progress-bar">
  {#each bars as bar}
    <div
      class="progress"
      class:green={bar.color === "green"}
      class:blue={bar.color === "blue"}
      class:purple={bar.color === "purple"}
      class:red={bar.color === "red"}
      class:orange={bar.color === "orange"}
      style={`width: ${bar.progress}%`}
    ></div>
  {/each}
</div>
