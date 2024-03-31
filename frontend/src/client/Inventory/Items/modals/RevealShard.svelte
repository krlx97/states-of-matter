<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {soundService} from "services";
  import {ItemComponent} from "ui";

  const dispatch = createEventDispatcher();
  let innerElement: HTMLDivElement;
  let isRevealed = false;
  let item: any;

  const onReveal = (): void => {
    if (isRevealed) {
      return;
    }

    soundService.play("card");
    innerElement.style.transform = "rotateY(180deg)";
    isRevealed = true;
    dispatch("reveal");
  };

  export {item};
</script>

<style>
  .flip-card {
    width: 112px;
    height: 160px;
    transform: perspective(320px);
    perspective: 320px;
    cursor: pointer;
  }

  .flip-card-inner {
    position: relative;
    text-align: center;
    transition: transform 0.8s;
    transform-style: preserve-3d;
  }

  .flip-card-front, .flip-card-back {
    position: absolute;
    backface-visibility: hidden;
  }

  .flip-card-front:hover {
    background-color: rgba(var(--dark-grey));
  }

  .flip-card-front {
    color: white;
    width: 112px;
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    border: 2px solid;
    border-radius: 8px;
    box-sizing: border-box;
    transition:
      background-color 333ms cubic-bezier(var(--ease-in-out-quad)),
      border-color 333ms cubic-bezier(var(--ease-in-out-quad));
  }

  @keyframes border-animation {
    0% {border-color: rgb(var(--uncommon));}
    25% {border-color: rgb(var(--rare));}
    50% {border-color: rgb(var(--epic));}
    75% {border-color: rgb(var(--legendary));}
    100% {border-color: rgb(var(--mythic));}
  }

  .flip-card-back {
    transform: rotateY(180deg);
  }

  .reveal {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md);
  }

  .uncommon:hover {
    border-color: rgba(var(--uncommon), var(--opacity-md));
  }

  .rare:hover {
    border-color: rgba(var(--rare), var(--opacity-md));
  }

  .epic:hover {
    border-color: rgba(var(--epic), var(--opacity-md));
  }

  .legendary:hover {
    border-color: rgba(var(--legendary), var(--opacity-md));
  }
</style>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="reveal" on:click="{onReveal}">
  <div class="flip-card">
    <div class="flip-card-inner" bind:this={innerElement}>
      <div
        class="flip-card-front"
        class:uncommon={item.rarity === 1}
        class:rare={item.rarity === 2}
        class:epic={item.rarity === 3}
        class:legendary={item.rarity === 4}>
        ?
      </div>
      <div class="flip-card-back">
        <ItemComponent {item} isBalancesVisible="{false}"/>
      </div>
    </div>
  </div>
</div>
