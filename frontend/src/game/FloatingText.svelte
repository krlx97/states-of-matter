<script lang="ts">
  import {onMount} from "svelte";
  import {floatingTextStore} from "stores";
  import type {Field} from "@som/shared/types/mongo";

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
    bottom: 0;
    left: 16px;
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

<div class="floating-text" bind:this={floatingText}>
  {#if isOpponent}
    {@html $floatingTextStore.opponent[field]}
  {:else}
    {@html $floatingTextStore.player[field]}
  {/if}
</div>
