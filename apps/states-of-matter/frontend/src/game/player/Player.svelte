<script lang="ts">
  import PlayerDeck from "./PlayerDeck.svelte";
  import PlayerGraveyard from "./PlayerGraveyard.svelte";
  import PlayerHandCards from "./PlayerHandCards.svelte";
  import PlayerHero from "./PlayerHero.svelte";
  import PlayerMinionField from "./PlayerMinionField.svelte";
  import PlayerTrapField from "./PlayerTrapField.svelte";
</script>

<style>
  .fields-wrapper {
    position: relative;
    flex-basis: 50%;
    display: flex;
    flex-direction: column;
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
  <PlayerTrapField/>
  <div class="fields">
    <PlayerGraveyard/>
    <PlayerMinionField field="a"/>
    <PlayerMinionField field="b"/>
    <PlayerHero/>
    <PlayerMinionField field="c"/>
    <PlayerMinionField field="d"/>
    <PlayerDeck/>
  </div>
  <PlayerHandCards/>
</div>
