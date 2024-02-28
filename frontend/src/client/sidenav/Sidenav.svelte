<script lang="ts">
  import { ProgressBarComponent, TextComponent } from "ui";
  import FriendsComponent from "./Friends.svelte";
  import PlayerComponent from "./Player.svelte";
  import { onMount } from "svelte";

  let ms2md = new Date().setHours(24, 0, 0, 0);
  let now = Date.now();
  let timeDifference = ms2md - now;
  const totalMilliseconds = 24 * 60 * 60 * 1000;
  let elapsedMilliseconds = now - ms2md;
  let elapsedWithin24Hours = (elapsedMilliseconds + totalMilliseconds) % totalMilliseconds;
  let percentageElapsed = (elapsedWithin24Hours / totalMilliseconds) * 100;
  let flushTime = new Date(ms2md - (ms2md + now)).toLocaleTimeString();
  let h = Math.floor(timeDifference / (1000 * 60 * 60));
  let m = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  let s = Math.floor((timeDifference % (1000 * 60)) / 1000);

  $: bars = [{
    color: "primary",
    progress: percentageElapsed,
  }]

  onMount(() => {
    setInterval(() => {
      if (ms2md < now) {
        ms2md = new Date().setHours(24, 0, 0, 0);
      }

      now = Date.now();

      elapsedMilliseconds = now - ms2md;
      elapsedWithin24Hours = (elapsedMilliseconds + totalMilliseconds) % totalMilliseconds;
      percentageElapsed = (elapsedWithin24Hours / totalMilliseconds) * 100;

      timeDifference = ms2md - now;

      // Convert milliseconds to hours, minutes, and seconds
      h = Math.floor(timeDifference / (1000 * 60 * 60));
      m = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      s = Math.floor((timeDifference % (1000 * 60)) / 1000);
      flushTime = new Date(now + (ms2md - now)).toLocaleTimeString();
    }, 1000);
  });
</script>

<style>
  .sidenav {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    backdrop-filter: blur(4px);
    background-color: rgba(31, 31, 31, 0.8);
    border: 0 solid;
    border-left-width: 1px;
    border-image: linear-gradient(
      180deg,
      rgba(var(--dark-grey), 0) 0%,
      rgba(var(--grey), 0.333) 50%,
      rgba(var(--dark-grey), 0) 100%
    ) 1;
  }

  .sidenav__social {
    flex-grow: 1;
    overflow-y: scroll;
  }

  .sidenav__social::-webkit-scrollbar {
    width: 4px;
  }

  .sidenav__social::-webkit-scrollbar-track {
    background-color: rgb(63, 63, 63);
    border-radius: 8px;
  }

  .sidenav__social::-webkit-scrollbar-thumb {
    background-color: rgb(127, 127, 127);
    border-radius: 8px;
  }

  .sidenav__flush {
    padding: var(--md);
    display: flex;
    flex-direction: column;
    gap: var(--md);
    border: 0 solid;
    border-top-width: 1px;
    border-image: linear-gradient(
      90deg,
      rgba(var(--dark-grey), 0) 0%,
      rgba(var(--grey), 0.333) 50%,
      rgba(var(--dark-grey), 0) 100%
    ) 1;
    text-align: center;
  }
</style>

<div class="sidenav">
  <PlayerComponent/>

  <div class="sidenav__social">
    <FriendsComponent/>
  </div>

  <div class="sidenav__flush">
    <div style="display: flex; justify-content: space-between;">
      <div>
        Flush
        <TextComponent size="lg" color="primary">
          {h.toString().padStart(2, '0')}:{m.toString().padStart(2, '0')}:{s.toString().padStart(2, '0')}
        </TextComponent>
      </div>
      <div>
        Version
        <TextComponent size="lg" color="grey">
          0.4.0
        </TextComponent>
      </div>
    </div>
    <ProgressBarComponent {bars}></ProgressBarComponent>
  </div>
</div>
