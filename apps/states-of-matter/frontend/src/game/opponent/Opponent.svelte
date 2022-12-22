<script lang="ts">
  import OpponentDeck from "./OpponentDeck.svelte";
  import OpponentGraveyard from "./OpponentGraveyard.svelte";
  import OpponentHandCards from "./OpponentHandCards.svelte";
  import OpponentHero from "./OpponentHero.svelte";
  import OpponentMinionField from "./OpponentMinionField.svelte";
  import OpponentTrapField from "./OpponentTrapField.svelte";
</script>

<style>
  .fields-wrapper {
    position: relative;
    height: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .fields {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(1, 1fr);
    gap: 0 var(--spacing-sm);
  }
</style>

<div class="fields-wrapper">
  <div style="transform: scale(0.8); position: relative;">
    <div class="fields">
      <OpponentDeck/>
      <OpponentMinionField field="d"/>
      <OpponentMinionField field="c"/>
      <OpponentHero/>
      <OpponentMinionField field="b"/>
      <OpponentMinionField field="a"/>
      <OpponentGraveyard/>
    </div>
    <OpponentHandCards/>
  </div>
</div>
