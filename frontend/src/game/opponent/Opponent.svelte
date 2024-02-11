<script lang="ts">
  import OpponentDeckComponent from "./OpponentDeck.svelte";
  import OpponentGraveyardComponent from "./OpponentGraveyard.svelte";
  import OpponentHandCardsComponent from "./OpponentHandCards.svelte";
  import OpponentHeroComponent from "./OpponentHero.svelte";
  import OpponentMinionFieldComponent from "./OpponentMinionField.svelte";
  import OpponentTrapFieldComponent from "./OpponentTrapField.svelte";
</script>

<style>
  .game-opponent {
    position: relative;
    height: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    /* overflow: hidden; */
  }

  .game-opponent__fields {
    display: flex;
    gap: var(--md);
  }
</style>

<div class="game-opponent">
  <OpponentTrapFieldComponent/>
<!-- transform: scale(0.8) causes animations to break. -->
  <div style="position: relative;">
    <div class="game-opponent__fields">
      <OpponentDeckComponent/>
<div></div>
    <div></div>
      <OpponentMinionFieldComponent field="d"/>
      <OpponentMinionFieldComponent field="c"/>
      <OpponentHeroComponent/>
      <OpponentMinionFieldComponent field="b"/>
      <OpponentMinionFieldComponent field="a"/>
<div></div>
    <div></div>
      <OpponentGraveyardComponent/>
    </div>
    <OpponentHandCardsComponent/>
  </div>
</div>
