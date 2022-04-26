<script lang="ts">
  import {gameStore, playerStore} from "stores";
  import FontAwesome from "../../ui/FontAwesome.svelte";
  import PlayerDeck from "./PlayerDeck.svelte";
  import PlayerGraveyard from "./PlayerGraveyard.svelte";
  import PlayerHandCards from "./PlayerHandCards.svelte";
  import PlayerHero from "./PlayerHero.svelte";
  import PlayerMagicField from "./PlayerMagicField.svelte";
  import PlayerMinionField from "./PlayerMinionField.svelte";
  import PlayerTrapField from "./PlayerTrapField.svelte";
</script>

<style lang="scss">
  @import "../../shared/styles/mixins";
  @import "../../shared/styles/variables";

  .fields-wrapper {
    position: relative;
    height: 50%;
    @include flex($align-items: center, $justify-content: center);
    overflow: hidden;
  }

  .fields {@include grid(7, 1, 0 $spacing-sm);}

  .turn {
    position: absolute;
    top: 50%;
    left: 105%;
  }
</style>

<div class="fields-wrapper">
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

  {#if $gameStore.currentPlayer === $playerStore.username}
    <div class="turn">
      <FontAwesome icon="arrow-left"/>
    </div>
  {/if}
</div>
