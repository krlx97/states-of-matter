<script lang="ts">
  import {cards} from "@som/shared/data";
import {CardType} from "@som/shared/enums";
import {tutorialStore} from "stores";
  import HeroCardComponent from "./HeroCard.svelte";
    
  $: isTutorial = $tutorialStore.name === "deckBuilder" && $tutorialStore.currentStep === 2;
</script>

<style>
  .heroes {
    position: relative;
    display: flex;
    gap: var(--spacing-md);
  }

  .isTutorial {
    z-index: 101;
  }
</style>

<div class="heroes" class:isTutorial>
  {#each cards as card}
    {#if card.type === CardType.HERO}
      <HeroCardComponent {card}/>
    {/if}
  {/each}
</div>
