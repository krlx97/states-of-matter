<script lang="ts">
  import {onMount} from "svelte";

  let floatingText: HTMLDivElement;
  let text: any;

  const anime = (ts: number): void => {
    floatingText.style.transform = `translateY(-${text.frame / 5}px)`;

    if (text.frame >= 210) {
      text.opacity -= 1 / 210;
      floatingText.style.opacity = text.opacity.toString();
    }

    text.frame += 1;

    if (text.frame <= 420) {
      text.animationId = requestAnimationFrame(anime);
    } else {
      cancelAnimationFrame(text.animationId);
      floatingText.remove();
    }
  };

  onMount((): void => {
    floatingText.style.left = `${text.left}px`;

    text.animationId = requestAnimationFrame(anime);
  });

  export {text};
</script>

<style>
  .floating-text {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 0.5em;
    display: flex;
    align-items: center;
    background-color: rgb(var(--light-grey));
    border-radius: 4px;
    box-shadow: var(--elevation-sm);
    z-index: 1000;
  }
</style>

<div class="floating-text" bind:this={floatingText}>
  {@html text.text}
</div>
