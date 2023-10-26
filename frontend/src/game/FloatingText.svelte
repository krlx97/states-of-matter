<script lang="ts">
  import {onMount} from "svelte";
  import {floatingTextStore} from "stores";

  let floatingText: HTMLDivElement;
  let field: any;
  let frame = 0;
  let opacity = 1;

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
      $floatingTextStore.player[field] = "";
    }
  };

  onMount((): void => {
    requestAnimationFrame(anime);
  });

  export {field};
</script>

<style>
  .floating-text {
    position: absolute;
    bottom: 0;
    left: 50%;
    padding: 0.5em;
    display: flex;
    align-items: center;
    background-color: rgb(var(--dark-grey));
    transform: translateX(-50%);
    border-radius: 8px;
    z-index: 1000;
  }
</style>

<div class="floating-text" bind:this={floatingText}>
  {@html $floatingTextStore.player[field]}
</div>
