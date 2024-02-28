<script lang="ts">
  import {onMount} from "svelte";
  import {floatingTextStore} from "stores";
  import type {Field} from "@som/shared/types/mongo";
    import { fly } from "svelte/transition";

  let floatingText: HTMLDivElement;
  let field: Field;
  let frame = 0;
  let opacity = 1;
  let isOpponent = false;

  const anime = (ts: number): void => {
    floatingText.style.transform = `translateY(-${frame / 2}px)`;

    if (frame >= 210) {
      opacity -= 1 / 210;
      floatingText.style.opacity = opacity.toString();
    }

    frame += 1;

    if (frame <= 420) {
      requestAnimationFrame(anime);
    } else {
      if (isOpponent) {
        $floatingTextStore.opponent[field] = "";
      } else {
        $floatingTextStore.player[field] = "";
      }
    }
  };

  onMount((): void => {
    requestAnimationFrame(anime);
  });

  export {field, isOpponent};
</script>

<style>
  .floating-text {
    position: absolute;
    width: calc(var(--card-width) - 32px);
    height: 16px;
    /* bottom: 0;
    left: 16px; */
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(var(--dark-grey));
    border: 1px solid rgb(var(--grey));
    border-radius: 8px;
    box-sizing: border-box;
    font-size: var(--xs);
    z-index: 1000;
  }
</style>

{#if isOpponent && $floatingTextStore.opponent[field]}
  <div class="floating-text" in:fly={{y: 256, duration: 1000}}>
    {@html $floatingTextStore.opponent[field]}
  </div>
{:else if !isOpponent && $floatingTextStore.player[field]}
  <div class="floating-text" in:fly={{y: 256, duration: 1000}}>
    {@html $floatingTextStore.player[field]}
  </div>
{/if}
