<script lang="ts">
  import {gameStore} from "game/stores";
  import {playerStore} from "stores/data";

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

  .fields {
    position: relative;
    @include flex(column);

    &__top {
      margin-bottom: $spacing-sm;
      @include grid(7, 1, 0 $spacing-sm);
    }

    &__bot { @include flex($justify-content: space-between); }

    &__turn {
      position: absolute;
      top: 50%;
      left: 105%;
    }
  }
</style>

<div class="fields">
  <div class="fields__top">
    <PlayerMagicField/>
    <PlayerMinionField field="A"/>
    <PlayerMinionField field="B"/>
    <PlayerHero/>
    <PlayerMinionField field="C"/>
    <PlayerMinionField field="D"/>
    <PlayerTrapField/>
  </div>

  <div class="fields__bot">
    <PlayerGraveyard/>
    <PlayerHandCards/>
    <PlayerDeck/>
  </div>

  {#if $gameStore.currentPlayer === $playerStore.username}
    <div class="fields__turn">
      <FontAwesome icon="arrow-left"/>
    </div>
  {/if}
</div>
