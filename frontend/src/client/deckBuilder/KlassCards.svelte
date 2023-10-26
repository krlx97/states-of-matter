<script lang="ts">
  import {cards} from "@som/shared/data";
  import {CardType} from "@som/shared/enums";
import {tutorialStore} from "stores";
  import KlassCardComponent from "./KlassCard.svelte";
    
  let selectedKlass = 0;
  const klasses = [0, 1, 2, 3, 4];
  $: isTutorial = $tutorialStore.name === "deckBuilder" && $tutorialStore.currentStep === 3;
</script>

<style>
  .cards__klasses {
    display: flex;
    justify-content: space-evenly;
    margin: var(--spacing-xl) 0 var(--spacing-sm) 0;
  }

  .cards__klasses__klass {
    opacity: 0.6;
    cursor: pointer;
    transition: filter 250ms ease;
    border-radius: 50%;
  }

  .cards__klasses__klass:hover {
    opacity: 0.8;
    box-shadow: 0 0 8px 2px white;
  }

  .cards__klasses__klass-selected {
    opacity: 1;
    box-shadow: 0 0 16px 2px white;
  }

  .cards__list {
    height: calc(216px * 2 + var(--spacing-md) * 1);
    padding-right: var(--spacing-md);
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: var(--spacing-md);
    box-sizing: border-box;
    overflow-y: scroll;
  }

  .cards__list::-webkit-scrollbar {
    width: 8px;
  }

  .cards__list::-webkit-scrollbar-track {
    background-color: rgb(63, 63, 63);
    border-radius: 8px;
  }

  .cards__list::-webkit-scrollbar-thumb {
    background-color: rgb(127, 127, 127);
    border-radius: 8px;
  }

  .isTutorial {
    position: relative;
    z-index: 101;
  }
</style>

<div class:isTutorial>
<div class="cards__klasses">
  {#each klasses as klass}
<!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class="cards__klasses__klass"
      class:cards__klasses__klass-selected="{klass === selectedKlass}"
      on:click="{() => selectedKlass = klass}">
      <img src="assets/classes/48/{klass}.png" alt="Klass {klass}"/>
    </div>
  {/each}
</div>
<div class="cards__list">
  {#each cards as card}
    {#if card.klass === selectedKlass && card.type !== CardType.HERO}
      <KlassCardComponent {card}/>
    {/if}
  {/each}
</div>
</div>
