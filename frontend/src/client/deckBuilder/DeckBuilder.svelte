<script lang="ts">
  import {playerStore, tutorialStore} from "stores";
  import {TutorialComponent} from "ui";
  import DeckCardsComponent from "./DeckCards.svelte";
  import DeckSlotsComponent from "./DeckSlots.svelte";
  import HeroCardsComponent from "./HeroCards.svelte";
  import KlassCardsComponent from "./KlassCards.svelte";
  import SelectedDeckComponent from "./SelectedDeck.svelte";
  import DeckBuilderTutorial1 from "./tutorial/DeckBuilderTutorial1.svelte";
  import DeckBuilderTutorial2 from "./tutorial/DeckBuilderTutorial2.svelte";
  import DeckBuilderTutorial3 from "./tutorial/DeckBuilderTutorial3.svelte";
  import DeckBuilderTutorial4 from "./tutorial/DeckBuilderTutorial4.svelte";
  import DeckBuilderTutorial5 from "./tutorial/DeckBuilderTutorial5.svelte";
    import { slide, fly } from "svelte/transition";

  $: isTutorial = $tutorialStore.name === "deckBuilder" && $tutorialStore.currentStep === 4;

  let areDeckSlotsVisible = false;

  const onToggleDeckSlots = (): void => {
    areDeckSlotsVisible = !areDeckSlotsVisible;
  };
</script>

<style>
  .deck-builder {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .deck-builder__inner {
    display: flex;
    gap: 64px;
  }

  .isTutorial {
    position: relative;
    z-index: 101;
  }

  .borderce {
    height: 768px;
    display: flex;
    flex-direction: column;
    border: 1px solid rgb(var(--grey));
    border-radius: 8px;
    box-sizing: border-box;
    overflow: hidden;
  }

  .centerce {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md);
  }
</style>

<div class="deck-builder">
  <div class="deck-builder__inner">
    <div class:isTutorial>
      <div class="borderce">
        <SelectedDeckComponent on:toggleDeckSlots="{onToggleDeckSlots}"/>
        {#if areDeckSlotsVisible}
          <div in:fly="{{duration: 400, x: 128}}">
            <DeckSlotsComponent on:selectDeck="{onToggleDeckSlots}"/>
          </div>
        {:else}
          <div in:fly="{{duration: 400, x: -128}}">
            <DeckCardsComponent/>
          </div>
        {/if}
      </div>
    </div>
    <div class="centerce">
      <HeroCardsComponent/>
      <KlassCardsComponent/>
    </div>
  </div>
</div>
{#if !$playerStore.tutorial.deckBuilder}
  <TutorialComponent tutorial="deckBuilder" steps="{[{
    position: "top: 50%; left: 50%; transform: translate(-50%, -50%)",
    component: DeckBuilderTutorial1
  }, {
    position: "top: 106px; left: 1256px;",
    component: DeckBuilderTutorial2
  }, {
    position: "top: 106px; left: 1256px;",
    component: DeckBuilderTutorial3
  }, {
    position: "top: 360px; left: 1256px;",
    component: DeckBuilderTutorial4
  }, {
    position: "top: 118px; left: 560px;",
    component: DeckBuilderTutorial5
  }]}"/>
{/if}
