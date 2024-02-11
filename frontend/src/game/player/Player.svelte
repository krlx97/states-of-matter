<script lang="ts">
  import PlayerDeckComponent from "./PlayerDeck.svelte";
  import PlayerGraveyardComponent from "./PlayerGraveyard.svelte";
  import PlayerHandCardsComponent from "./PlayerHandCards.svelte";
  import PlayerHeroComponent from "./PlayerHero.svelte";
  import PlayerMinionFieldComponent from "./PlayerMinionField.svelte";
  import PlayerTrapFieldComponent from "./PlayerTrapField.svelte";
</script>

<style>
  .game-player {
    position: relative;
    height: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .game-player__fields {
    display: flex;
    gap: var(--md);
  }
</style>

<div class="game-player">
  <PlayerTrapFieldComponent/>
  <div class="game-player__fields">
    <PlayerGraveyardComponent/>
    <div></div>
    <div></div>
    <PlayerMinionFieldComponent field="a"/>
    <PlayerMinionFieldComponent field="b"/>
    <PlayerHeroComponent/>
    <PlayerMinionFieldComponent field="c"/>
    <PlayerMinionFieldComponent field="d"/>
    <div></div>
    <div></div>
    <PlayerDeckComponent/>
  </div>
  <PlayerHandCardsComponent/>
</div>
