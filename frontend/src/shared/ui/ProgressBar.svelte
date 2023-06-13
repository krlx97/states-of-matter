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

  .green {background-color: rgb(133, 199, 0)}
  .red {background-color: rgb(var(--red));}
  .blue {background-color: rgb(0, 174, 191)}
  .purple {background-color: rgb(var(--main)); box-shadow: 0 0 4px 0 rgb(var(--main));}
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
