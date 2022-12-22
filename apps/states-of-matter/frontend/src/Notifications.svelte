<script lang="ts">
  import {fade, fly, type FlyParams} from "svelte/transition";
  import {notificationsStore} from "stores";

  const inFly: FlyParams = {
    x: 100,
    duration: 225
  };
</script>

<style>
  .notifications {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 320px;
  }

  .notification {
    margin: var(--spacing-sm);
    padding: var(--spacing-sm);
    background-color: rgb(var(--light-grey));
    border-bottom: 2px solid rgb(var(--purple));
    box-sizing: border-box;
  }
</style>

<div class="notifications">
  {#each $notificationsStore as {msg}}
    <div class="notification" in:fly={inFly} out:fade>{msg}</div>
  {/each}
</div>
