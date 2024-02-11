<script lang="ts">
  let bars: any[] = [];
  let isPercentVisible = false;
  let isValueVisible = false;

  export {bars, isPercentVisible, isValueVisible};
</script>

<style>
  .progress-bar {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .texts, .bars {
    width: 100%;
    display: flex;
  }

  .text {
    font-size: var(--xs);
    text-align: center;
  }

  .bars {
    height: 4px;
    border-radius: 8px;
    overflow: hidden;
    background-color: rgb(15, 15, 15);
  }

  .progress {
    /* transition: width 250ms linear; */
    height: 4px;
    /* border-radius: 8px; */
  }

  .white {background-color: rgb(var(--neutral));}
  .green {background-color: rgb(var(--gas))}
  .red {background-color: rgb(var(--solid));}
  .blue {background-color: rgb(var(--liquid))}
  .purple {background-color: rgb(var(--plasma))}
  .fwhite {color: rgb(var(--neutral));}
  .fgreen {color: rgb(var(--gas))}
  .fred {color: rgb(var(--solid));}
  .fblue {color: rgb(var(--liquid))}
  .fpurple {color: rgb(var(--plasma))}
  .bronze {background-color: rgb(var(--bronze));}
  .silver {background-color: rgb(var(--silver));}
  .gold {background-color: rgb(var(--gold));}
  .master {background-color: rgb(var(--master));}

  .grey {
    background-color: rgb(127, 127, 127);
  }
  .orange {
    background-color: rgb(255, 139, 0);
  }
</style>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="progress-bar">
 
 {#if isValueVisible}
    <div class="texts">
      {#each bars as bar}
        <div class="text" style:width="{bar.progress}%" class:white={bar.color === "white"}
        class:fgreen={bar.color === "green"}
        class:fblue={bar.color === "blue"}
        class:fpurple={bar.color === "purple"}
        class:fred={bar.color === "red"}
        class:forange={bar.color === "orange"}>{bar.val}</div>
      {/each}
    </div>
  {/if}
  <div class="bars">
    {#each bars as bar}
      <div
        class="progress"
        class:white={bar.color === "white"}
        class:green={bar.color === "green"}
        class:blue={bar.color === "blue"}
        class:purple={bar.color === "purple"}
        class:red={bar.color === "red"}
        class:orange={bar.color === "orange"}
        class:bronze={bar.color === "Bronze"}
        class:silver={bar.color === "Silver"}
        class:gold={bar.color === "Gold"}
        style:width="{bar.progress}%"
        class:master={bar.color === "Master"}>
      </div>
    {/each}
  </div>
 {#if isPercentVisible}
  <div class="texts">
    {#each bars as bar}
      <div class="text" style:width="{bar.progress}%" class:white={bar.color === "white"}
      class:fgreen={bar.color === "green"}
      class:fblue={bar.color === "blue"}
      class:fpurple={bar.color === "purple"}
      class:fred={bar.color === "red"}
      class:forange={bar.color === "orange"}>{bar.progress.toFixed()}%</div>
    {/each}
  </div>
  {/if}
 
</div>
