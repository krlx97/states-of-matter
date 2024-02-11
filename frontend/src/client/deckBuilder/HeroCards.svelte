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
    padding: var(--md);
    padding-top: 0;
    display: flex;
    gap: var(--md);
    /* border: 0 solid;
    border-bottom-width: 1px;
    border-image: linear-gradient(
      90deg,
      rgb(var(--dark-grey), 1) 0%,
      rgb(var(--grey), 1) 50%,
      rgb(var(--dark-grey), 1) 100%
    ) 1; */
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
